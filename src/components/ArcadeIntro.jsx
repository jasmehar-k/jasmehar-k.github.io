import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { sfx, toggleMute, useMuted } from '../hooks/useSound';

/* ────────────────────────── overlay styling ────────────────────────── */

const pulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

const drift = keyframes`
  0%   { transform: translate3d(-12px, 0, 0); }
  100% { transform: translate3d(12px, -10px, 0); }
`;

const IntroShell = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255, 214, 94, 0.12), transparent 30%),
    radial-gradient(circle at bottom, rgba(14, 69, 104, 0.32), transparent 42%),
    linear-gradient(180deg, #04050a 0%, #090b15 50%, #020308 100%);
  opacity: ${({ $phase }) => ($phase === 'transitioning' ? 0 : 1)};
  transition: opacity 1.45s ease;
`;

const CabinetFlash = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  background:
    radial-gradient(circle at center, rgba(102, 235, 255, 0.85) 0%, rgba(102, 235, 255, 0.08) 35%, transparent 70%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0));
  transition: opacity 1.1s ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  padding: 1.5rem;
  color: #f7f1cf;
  font-family: var(--font-pixel);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
`;

const Panel = styled.div`
  max-width: min(30rem, 100%);
  padding: 1rem 1.1rem;
  border: 3px solid rgba(255, 225, 124, 0.7);
  background: rgba(9, 12, 20, 0.76);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  pointer-events: auto;
`;

const Title = styled.p`
  margin: 0 0 0.8rem;
  font-size: clamp(0.78rem, 1.5vw, 1rem);
  color: #ffd86b;
`;

const Copy = styled.p`
  margin: 0;
  font-size: clamp(0.52rem, 1vw, 0.7rem);
  line-height: 1.85;
  color: rgba(247, 241, 207, 0.92);
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: flex-end;
  pointer-events: auto;
`;

const PixelButton = styled.button`
  border: 3px solid #231609;
  background: ${({ $variant }) => ($variant === 'secondary' ? '#7f96a6' : '#ffcb58')};
  color: #17120b;
  padding: 0.85rem 1rem;
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.28);
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.28);
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 4.5rem;
`;

const Prompt = styled.div`
  padding: 0.9rem 1.2rem;
  border: 3px solid rgba(129, 237, 255, 0.9);
  background: rgba(5, 10, 19, 0.84);
  color: #b9f7ff;
  font-size: clamp(0.54rem, 1.2vw, 0.72rem);
  letter-spacing: 0.04em;
  text-align: center;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const Reticle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  margin-left: -9px;
  margin-top: -9px;
  border: 2px solid rgba(193, 250, 255, 0.85);
  border-radius: 50%;
  opacity: ${({ $visible }) => ($visible ? 0.9 : 0)};
  transform: scale(${({ $active }) => ($active ? 1.16 : 1)});
  transition: opacity 0.2s ease, transform 0.2s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(193, 250, 255, 0.8);
  }

  &::before {
    top: 50%;
    left: -8px;
    right: -8px;
    height: 2px;
    transform: translateY(-50%);
  }

  &::after {
    left: 50%;
    top: -8px;
    bottom: -8px;
    width: 2px;
    transform: translateX(-50%);
  }
`;

const FallbackRoom = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1.5rem;
`;

const FallbackStage = styled.div`
  position: relative;
  width: min(28rem, 90vw);
  height: min(34rem, 78vh);
  border-radius: 2rem;
  background:
    radial-gradient(circle at top, rgba(255, 226, 120, 0.12), transparent 24%),
    linear-gradient(180deg, #0a0e18 0%, #060810 100%);
  border: 2px solid rgba(159, 204, 255, 0.12);
  box-shadow: inset 0 -80px 120px rgba(0, 0, 0, 0.35);
  overflow: hidden;
`;

const FallbackLight = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  width: 11rem;
  height: 11rem;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 228, 147, 0.5), transparent 70%);
  filter: blur(10px);
`;

const FallbackCabinet = styled.button`
  position: absolute;
  left: 50%;
  bottom: 2.5rem;
  width: min(13rem, 50vw);
  height: min(23rem, 56vh);
  transform: translateX(-50%);
  border: 0;
  background: none;
  cursor: pointer;
`;

const FallbackCabinetBody = styled.div`
  position: absolute;
  inset: 0;
  clip-path: polygon(20% 0%, 80% 0%, 100% 22%, 100% 100%, 0% 100%, 0% 22%);
  background: linear-gradient(180deg, #8c2020 0%, #4a1212 42%, #200a0a 100%);
  border: 4px solid #0a0f18;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
`;

const FallbackScreen = styled.div`
  position: absolute;
  left: 18%;
  right: 18%;
  top: 17%;
  height: 26%;
  background:
    linear-gradient(180deg, rgba(12, 28, 46, 0.9), rgba(34, 200, 235, 0.25)),
    radial-gradient(circle at center, rgba(90, 245, 255, 0.55), transparent 65%);
  border: 4px solid #071019;
  box-shadow: 0 0 25px rgba(55, 206, 255, 0.25);
`;

const FallbackMarquee = styled.div`
  position: absolute;
  left: 17%;
  right: 17%;
  top: 6%;
  height: 10%;
  display: grid;
  place-items: center;
  background: linear-gradient(90deg, #ffba49, #ffde77, #ffba49);
  border: 3px solid #3d2b10;
  color: #1b140b;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
`;

const FallbackControls = styled.div`
  position: absolute;
  left: 26%;
  right: 26%;
  bottom: 18%;
  height: 17%;
  border-radius: 1rem;
  background: linear-gradient(180deg, #223448, #131b26);
  border: 3px solid #0a0f18;
`;

const Dust = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 241, 194, 0.18);
  filter: blur(1px);
  animation: ${drift} ${({ $duration }) => $duration}s ease-in-out infinite alternate;
`;

/* ────────────────────────── helpers ────────────────────────── */

function supportsWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

// low arcade-room hum, follows the global mute state
function useIntroAudio(muted) {
  const audioContextRef = useRef(null);
  const humRef = useRef(null);
  const masterGainRef = useRef(null);

  const ensureAudio = async () => {
    if (typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const masterGain = context.createGain();
      masterGain.gain.value = muted ? 0 : 0.06;
      masterGain.connect(context.destination);

      const oscA = context.createOscillator();
      const oscB = context.createOscillator();
      const humGain = context.createGain();
      humGain.gain.value = 0.32;
      humGain.connect(masterGain);

      oscA.type = 'sine';
      oscA.frequency.value = 52;
      oscB.type = 'triangle';
      oscB.frequency.value = 78;
      oscA.connect(humGain);
      oscB.connect(humGain);
      oscA.start();
      oscB.start();

      audioContextRef.current = context;
      humRef.current = { oscA, oscB, humGain };
      masterGainRef.current = masterGain;
    }

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : 0.06;
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      if (humRef.current) {
        humRef.current.oscA.stop();
        humRef.current.oscB.stop();
      }
      audioContextRef.current?.close();
    };
  }, []);

  return { ensureAudio };
}

/* ────────────────────────── canvas textures ────────────────────────── */

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function drawTitleScreen(ctx, w, h, blinkOn) {
  // sky
  ctx.fillStyle = '#5c94fc';
  ctx.fillRect(0, 0, w, h);

  // ground bricks
  const brickH = h * 0.06;
  ctx.fillStyle = '#c84c0c';
  ctx.fillRect(0, h - brickH * 2, w, brickH * 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.45)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 2; row++) {
    const y = h - brickH * (2 - row);
    for (let x = (row % 2) * brickH; x < w; x += brickH * 2) {
      ctx.strokeRect(x, y, brickH * 2, brickH);
    }
  }

  // title panel (SMB1 logo style)
  const px = w * 0.1;
  const py = h * 0.12;
  const pw = w * 0.8;
  const ph = h * 0.42;
  ctx.fillStyle = '#b53120';
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = '#f8d878';
  ctx.lineWidth = 6;
  ctx.strokeRect(px + 5, py + 5, pw - 10, ph - 10);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(px, py + ph - 10, pw, 10);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8d878';
  ctx.font = `${Math.round(h * 0.075)}px "Press Start 2P", monospace`;
  ctx.fillText("JASMEHAR'S", w / 2, py + ph * 0.42);
  ctx.fillText('PORTFOLIO', w / 2, py + ph * 0.72);

  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(h * 0.035)}px "Press Start 2P", monospace`;
  ctx.fillText('©2026 JASMEHAR KAUR', w / 2, py + ph + h * 0.09);

  if (blinkOn) {
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.round(h * 0.05)}px "Press Start 2P", monospace`;
    ctx.fillText('PRESS START', w / 2, h * 0.78);
  }

  // scanlines + vignette for CRT feel
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }
  const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

function drawMarquee(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#8c1616');
  grad.addColorStop(0.5, '#b32020');
  grad.addColorStop(1, '#8c1616');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#f8d878';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd86b';
  ctx.font = `${Math.round(h * 0.34)}px "Press Start 2P", monospace`;
  ctx.fillText('JASMEHAR', w / 2, h * 0.48);
  ctx.fillStyle = '#fffef7';
  ctx.font = `${Math.round(h * 0.15)}px "Press Start 2P", monospace`;
  ctx.fillText('ARCADE PORTFOLIO', w / 2, h * 0.76);

  // corner stars
  ctx.fillStyle = '#f8d878';
  [[w * 0.08, h * 0.5], [w * 0.92, h * 0.5]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, h * 0.06, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSideArt(ctx, w, h) {
  ctx.fillStyle = '#8c1a1a';
  ctx.fillRect(0, 0, w, h);

  // simple pixel mushroom
  const unit = w / 14;
  const ox = w * 0.22;
  const oy = h * 0.3;
  ctx.fillStyle = '#e52521';
  ctx.fillRect(ox + unit, oy, unit * 6, unit * 2);
  ctx.fillRect(ox, oy + unit * 2, unit * 8, unit * 2);
  ctx.fillStyle = '#fffef7';
  ctx.fillRect(ox + unit * 3, oy + unit, unit * 2, unit * 2);
  ctx.fillRect(ox + unit * 0.5, oy + unit * 2.5, unit * 1.5, unit * 1.5);
  ctx.fillRect(ox + unit * 6, oy + unit * 2.5, unit * 1.5, unit * 1.5);
  ctx.fillRect(ox + unit * 2, oy + unit * 4, unit * 4, unit * 2);
  ctx.fillStyle = '#0f0f1b';
  ctx.fillRect(ox + unit * 2.7, oy + unit * 4.2, unit * 0.7, unit);
  ctx.fillRect(ox + unit * 4.6, oy + unit * 4.2, unit * 0.7, unit);

  // fading coin trail
  ctx.fillStyle = 'rgba(248, 216, 120, 0.85)';
  [[0.7, 0.16], [0.78, 0.26], [0.72, 0.36]].forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.ellipse(w * fx, h * fy, unit * 0.8, unit * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

function useCanvasTexture(w, h, draw) {
  return useMemo(() => {
    const canvas = makeCanvas(w, h);
    const ctx = canvas.getContext('2d');
    draw(ctx, w, h);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, ctx, texture };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ────────────────────────── cabinet ────────────────────────── */

// side profile of a classic upright cabinet: x = depth (0 back, + front), y = height
const PROFILE = [
  [0.0, 0.0],   // back bottom
  [1.42, 0.0],  // front bottom
  [1.42, 0.85], // kick panel top
  [1.28, 1.45], // recessed coin-door panel leans back
  [1.52, 1.5],  // control deck front lip juts out
  [1.52, 1.72], // lip top
  [0.98, 1.98], // deck slopes up toward screen
  [0.78, 3.05], // screen face tilts back
  [1.02, 3.32], // overhang out to marquee
  [0.92, 4.05], // marquee face
  [0.55, 4.18], // top front
  [0.0, 4.18],  // top back
];

const PANEL_T = 0.09;
const INNER_W = 2.02;
const DECK_ANGLE = 0.448;   // slope of the control deck
const SCREEN_ANGLE = -0.185;
const MARQUEE_ANGLE = -0.136;
const COIN_PANEL_ANGLE = -0.23;

function SidePanels() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    PROFILE.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: PANEL_T, bevelEnabled: false });
  }, []);

  const { texture: artTexture } = useCanvasTexture(256, 512, drawSideArt);

  const panelMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#8c1a1a', roughness: 0.72, metalness: 0.08 }),
      new THREE.MeshStandardMaterial({ color: '#0c0c12', roughness: 0.45, metalness: 0.3 }), // T-molding edge
    ],
    [],
  );

  return (
    <>
      {/* rotation maps profile x → world z so the flat faces point sideways */}
      <mesh geometry={geometry} material={panelMaterials} rotation={[0, -Math.PI / 2, 0]} position={[1.1, 0, 0]} castShadow receiveShadow />
      <mesh geometry={geometry} material={panelMaterials} rotation={[0, -Math.PI / 2, 0]} position={[-1.01, 0, 0]} castShadow receiveShadow />

      {/* side art decals */}
      <mesh position={[1.106, 2.15, 0.55]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.05, 2.0]} />
        <meshStandardMaterial map={artTexture} roughness={0.8} />
      </mesh>
      <mesh position={[-1.016, 2.15, 0.55]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.05, 2.0]} />
        <meshStandardMaterial map={artTexture} roughness={0.8} />
      </mesh>
    </>
  );
}

function CRTScreen({ transitionProgress }) {
  const { canvas, ctx, texture } = useCanvasTexture(512, 400, (c, w, h) => drawTitleScreen(c, w, h, true));
  const blinkRef = useRef(true);

  // redraw once the pixel font finishes loading
  useEffect(() => {
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        drawTitleScreen(ctx, canvas.width, canvas.height, blinkRef.current);
        texture.needsUpdate = true;
      });
    }
    return () => {
      cancelled = true;
    };
  }, [canvas, ctx, texture]);

  useFrame(({ clock }) => {
    const blinkOn = Math.floor(clock.getElapsedTime() * 1.6) % 2 === 0;
    if (blinkOn !== blinkRef.current) {
      blinkRef.current = blinkOn;
      drawTitleScreen(ctx, canvas.width, canvas.height, blinkOn);
      texture.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 2.515, 0]} rotation={[SCREEN_ANGLE, 0, 0]}>
      {/* bezel */}
      <mesh position={[0, 0, 0.872]}>
        <planeGeometry args={[1.82, 1.38]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.9} />
      </mesh>
      {/* tube — meshBasicMaterial so it self-illuminates like a CRT */}
      <mesh position={[0, 0, 0.887]}>
        <planeGeometry args={[1.54, 1.16]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* white-out layer used during the boot transition */}
      <mesh position={[0, 0, 0.892]}>
        <planeGeometry args={[1.54, 1.16]} />
        <meshBasicMaterial color="#dffbff" transparent opacity={transitionProgress * 0.95} toneMapped={false} />
      </mesh>
      {/* curved glass */}
      <mesh position={[0, 0, 0.905]}>
        <planeGeometry args={[1.62, 1.24]} />
        <meshPhysicalMaterial
          color="#d2f8ff"
          transparent
          opacity={0.16}
          roughness={0.08}
          metalness={0}
          transmission={0.5}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>
      {/* glow cast onto the player */}
      <pointLight position={[0, 0, 1.4]} intensity={2.5 + transitionProgress * 26} color="#7ddfff" distance={5} />
    </group>
  );
}

function Marquee() {
  const { texture } = useCanvasTexture(512, 168, drawMarquee);
  return (
    <group position={[0, 3.685, 0]} rotation={[MARQUEE_ANGLE, 0, 0]}>
      <mesh position={[0, 0, 0.97]}>
        <planeGeometry args={[1.94, 0.66]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.1, 1.5]} intensity={4} color="#ffd77a" distance={3.2} />
    </group>
  );
}

function Joystick() {
  return (
    <group>
      <mesh position={[0, 0.008, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.14, 0.016, 24]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.038, 0.26, 16]} />
        <meshStandardMaterial color="#c8ccd4" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.29, 0]} castShadow>
        <sphereGeometry args={[0.088, 24, 24]} />
        <meshPhysicalMaterial color="#e52521" roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
    </group>
  );
}

function ArcadeButton({ position, color }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.082, 0.086, 0.018, 24]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.062, 0.03, 24]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.18} roughness={0.25} clearcoat={0.8} />
      </mesh>
    </group>
  );
}

function ControlDeck() {
  return (
    <group position={[0, 1.85, 1.25]} rotation={[DECK_ANGLE, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[INNER_W + 2 * PANEL_T, 0.07, 0.62]} />
        <meshStandardMaterial color="#141420" roughness={0.55} metalness={0.25} />
      </mesh>
      {/* deck overlay stripe */}
      <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[INNER_W + 2 * PANEL_T - 0.06, 0.56]} />
        <meshStandardMaterial color="#1c1c2c" roughness={0.6} />
      </mesh>
      <group position={[-0.52, 0.035, 0.03]}>
        <Joystick />
      </group>
      <ArcadeButton position={[0.28, 0.035, -0.09]} color="#e52521" />
      <ArcadeButton position={[0.56, 0.035, 0.0]} color="#fbd000" />
      <ArcadeButton position={[0.84, 0.035, 0.09]} color="#43b047" />
    </group>
  );
}

function CoinDoor() {
  return (
    <group position={[0, 1.13, 1.37]} rotation={[COIN_PANEL_ANGLE, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.52, 0.5, 0.035]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.35} metalness={0.6} />
      </mesh>
      {/* two glowing coin slots */}
      <mesh position={[-0.11, 0.05, 0.02]}>
        <boxGeometry args={[0.05, 0.12, 0.01]} />
        <meshStandardMaterial color="#3a0a0a" emissive="#ff5040" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.11, 0.05, 0.02]}>
        <boxGeometry args={[0.05, 0.12, 0.01]} />
        <meshStandardMaterial color="#3a0a0a" emissive="#ff5040" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, -0.17, 0.02]}>
        <boxGeometry args={[0.3, 0.02, 0.01]} />
        <meshStandardMaterial color="#c8ccd4" roughness={0.3} metalness={0.8} />
      </mesh>
      <pointLight position={[0, 0, 0.4]} intensity={0.5} color="#ff6a50" distance={1.4} />
    </group>
  );
}

function Cabinet({ transitionProgress }) {
  return (
    <group position={[0, 0.06, -5.2]}>
      <SidePanels />

      {/* back panel */}
      <mesh position={[0, 2.09, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[INNER_W, 4.18, 0.08]} />
        <meshStandardMaterial color="#12121a" roughness={0.9} />
      </mesh>
      {/* top cap */}
      <mesh position={[0, 4.21, 0.28]} castShadow>
        <boxGeometry args={[INNER_W + 2 * PANEL_T, 0.08, 0.58]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* kick plate */}
      <mesh position={[0, 0.42, 1.39]} castShadow receiveShadow>
        <boxGeometry args={[INNER_W, 0.85, 0.06]} />
        <meshStandardMaterial color="#141420" roughness={0.8} />
      </mesh>
      {/* coin-door panel, leaning back slightly */}
      <mesh position={[0, 1.15, 1.34]} rotation={[COIN_PANEL_ANGLE, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[INNER_W, 0.64, 0.06]} />
        <meshStandardMaterial color="#181824" roughness={0.7} />
      </mesh>
      {/* deck front lip */}
      <mesh position={[0, 1.6, 1.49]} castShadow>
        <boxGeometry args={[INNER_W + 2 * PANEL_T, 0.24, 0.07]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* panel between deck and screen */}
      <mesh position={[0, 2.02, 0.94]} rotation={[SCREEN_ANGLE, 0, 0]}>
        <boxGeometry args={[INNER_W, 0.28, 0.05]} />
        <meshStandardMaterial color="#141420" roughness={0.8} />
      </mesh>
      {/* marquee overhang underside */}
      <mesh position={[0, 3.32, 0.9]} castShadow>
        <boxGeometry args={[INNER_W, 0.07, 0.3]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.6} />
      </mesh>

      <CRTScreen transitionProgress={transitionProgress} />
      <Marquee />
      <ControlDeck />
      <CoinDoor />
    </group>
  );
}

/* ────────────────────────── room + atmosphere ────────────────────────── */

function Room() {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[14, 0.12, 16]} />
        <meshStandardMaterial color="#111823" roughness={0.95} />
      </mesh>
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[14, 0.12, 16]} />
        <meshStandardMaterial color="#0a0d12" roughness={1} />
      </mesh>
      <mesh position={[0, 2.2, -8]}>
        <boxGeometry args={[14, 4.4, 0.18]} />
        <meshStandardMaterial color="#101723" roughness={0.96} />
      </mesh>
      <mesh position={[0, 2.2, 8]}>
        <boxGeometry args={[14, 4.4, 0.18]} />
        <meshStandardMaterial color="#0b1119" roughness={0.96} />
      </mesh>
      <mesh position={[-7, 2.2, 0]}>
        <boxGeometry args={[0.18, 4.4, 16]} />
        <meshStandardMaterial color="#0c1018" roughness={1} />
      </mesh>
      <mesh position={[7, 2.2, 0]}>
        <boxGeometry args={[0.18, 4.4, 16]} />
        <meshStandardMaterial color="#0d1118" roughness={1} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 16, 14, 16]} />
        <meshStandardMaterial color="#162130" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* dark neighbour cabinets for arcade depth */}
      {[[-4.2, -5.6, 0.28], [4.2, -5.6, -0.28]].map(([x, z, ry]) => (
        <group key={x} position={[x, 0, z]} rotation={[0, ry, 0]}>
          <mesh position={[0, 1.9, 0]} castShadow>
            <boxGeometry args={[1.9, 3.8, 1.5]} />
            <meshStandardMaterial color="#0b0f16" roughness={0.95} />
          </mesh>
          <mesh position={[0, 2.5, 0.77]}>
            <planeGeometry args={[1.2, 0.9]} />
            <meshStandardMaterial color="#0e2233" emissive="#123044" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* ceiling lamp above the hero cabinet */}
      <mesh position={[0, 4.32, -5.15]}>
        <cylinderGeometry args={[0.32, 0.42, 0.4, 20]} />
        <meshStandardMaterial color="#d6b772" emissive="#ffd265" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Atmosphere() {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        key: index,
        position: [
          (Math.random() - 0.5) * 11,
          0.6 + Math.random() * 3.5,
          (Math.random() - 0.5) * 13,
        ],
        scale: 0.02 + Math.random() * 0.04,
      })),
    [],
  );

  return (
    <>
      {particles.map((particle) => (
        <mesh key={particle.key} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#f6deb0" emissive="#ffd87d" emissiveIntensity={0.2} transparent opacity={0.26} />
        </mesh>
      ))}
    </>
  );
}

/* ────────────────────────── cameras / controls ────────────────────────── */

const SCREEN_WORLD = new THREE.Vector3(0, 2.55, -4.3);

function StaticCamera({ isMobile, transitionProgress }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (isMobile) {
      camera.position.x = Math.sin(clock.getElapsedTime() * 0.25) * 0.24;
      camera.position.y = 2.72;
      camera.position.z = 6.45 - transitionProgress * 10.3;
      camera.lookAt(0, 3.2, -4.6);
    }
  });

  return null;
}

function DesktopController({ active, transitioning, onInteractionChange, transitionProgress }) {
  const controlsRef = useRef(null);
  const keysRef = useRef({});
  const { camera } = useThree();
  const interactionRef = useRef({ inRange: false, aimed: false, locked: false });

  useEffect(() => {
    camera.position.set(0, 1.9, 6.25);
    camera.lookAt(0, 2.3, -5);
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      keysRef.current[event.code] = true;
    };
    const handleKeyUp = (event) => {
      keysRef.current[event.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return undefined;

    const syncLockState = () => onInteractionChange((prev) => ({ ...prev, locked: controls.isLocked }));
    controls.addEventListener('lock', syncLockState);
    controls.addEventListener('unlock', syncLockState);
    return () => {
      controls.removeEventListener('lock', syncLockState);
      controls.removeEventListener('unlock', syncLockState);
    };
  }, [onInteractionChange]);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.05);

    if (transitioning) {
      const target = new THREE.Vector3(0, 2.52, -3.9);
      camera.position.lerp(target, 0.06 + transitionProgress * 0.1);
      camera.lookAt(SCREEN_WORLD);
    } else if (active && controlsRef.current?.isLocked) {
      const moveSpeed = 2.3 * safeDelta;
      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

      if (keysRef.current.KeyW || keysRef.current.ArrowUp) direction.add(forward);
      if (keysRef.current.KeyS || keysRef.current.ArrowDown) direction.sub(forward);
      if (keysRef.current.KeyD || keysRef.current.ArrowRight) direction.add(right);
      if (keysRef.current.KeyA || keysRef.current.ArrowLeft) direction.sub(right);

      if (direction.lengthSq() > 0) {
        direction.normalize().multiplyScalar(moveSpeed);
        camera.position.add(direction);
      }

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -4.7, 4.7);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -2.9, 6.7);
      camera.position.y = 1.9;
    }

    const toScreen = SCREEN_WORLD.clone().sub(camera.position);
    const distance = toScreen.length();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const alignment = forward.dot(toScreen.normalize());
    const nextInteraction = {
      inRange: distance < 3.45,
      aimed: alignment > 0.93,
      locked: controlsRef.current?.isLocked ?? false,
    };

    const changed =
      nextInteraction.inRange !== interactionRef.current.inRange ||
      nextInteraction.aimed !== interactionRef.current.aimed ||
      nextInteraction.locked !== interactionRef.current.locked;

    if (changed) {
      interactionRef.current = nextInteraction;
      onInteractionChange(nextInteraction);
    }
  });

  return <PointerLockControls ref={controlsRef} />;
}

function TransitionDirector({ phase, children }) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useFrame((_, delta) => {
    const target = phase === 'transitioning' ? 1 : 0;
    const next = THREE.MathUtils.damp(progressRef.current, target, 4.2, delta);
    if (Math.abs(next - progressRef.current) > 0.001) {
      progressRef.current = next;
      setProgress(next);
    }
  });

  return children(progress);
}

function ArcadeScene({ isMobile, phase, onInteractionChange }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: isMobile ? 44 : 68, position: [0, 1.65, 6.25] }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 7.5, 16]} />
      <ambientLight intensity={0.22} color="#7da6ff" />
      <spotLight
        position={[0, 4.2, -5.1]}
        angle={0.5}
        penumbra={0.8}
        intensity={70}
        color="#ffd77a"
        castShadow
      />
      <Suspense fallback={<Html center>Loading...</Html>}>
        <TransitionDirector phase={phase}>
          {(transitionProgress) => (
            <>
              <Room />
              <Cabinet transitionProgress={transitionProgress} />
              <Atmosphere />
              {isMobile ? (
                <StaticCamera isMobile={isMobile} transitionProgress={transitionProgress} />
              ) : (
                <DesktopController
                  active={phase === 'intro3d'}
                  transitioning={phase === 'transitioning'}
                  onInteractionChange={onInteractionChange}
                  transitionProgress={transitionProgress}
                />
              )}
            </>
          )}
        </TransitionDirector>
      </Suspense>
    </Canvas>
  );
}

/* ────────────────────────── fallback + shell ────────────────────────── */

function WebGLFallback({ onStart, muted, onToggleMute, isMobile }) {
  return (
    <FallbackRoom>
      <FallbackStage>
        <FallbackLight />
        <Dust style={{ top: '16%', left: '18%' }} $duration={4.4} />
        <Dust style={{ top: '31%', right: '16%' }} $duration={5.2} />
        <Dust style={{ bottom: '27%', left: '24%' }} $duration={3.8} />
        <FallbackCabinet onClick={onStart} type="button">
          <FallbackCabinetBody />
          <FallbackScreen />
          <FallbackMarquee>JASMEHAR.EXE</FallbackMarquee>
          <FallbackControls />
        </FallbackCabinet>
      </FallbackStage>
      <Overlay>
        <TopBar>
          <Panel>
            <Title>{isMobile ? 'Tap to power on' : '3D fallback mode'}</Title>
            <Copy>
              WebGL is unavailable here, so the intro is using a cinematic fallback. Start the cabinet to enter the portfolio.
            </Copy>
          </Panel>
          <ButtonRow>
            <PixelButton type="button" $variant="secondary" onClick={onToggleMute}>
              {muted ? 'Sound Off' : 'Sound On'}
            </PixelButton>
            <PixelButton type="button" onClick={onStart}>
              Start Portfolio
            </PixelButton>
          </ButtonRow>
        </TopBar>
      </Overlay>
    </FallbackRoom>
  );
}

function ArcadeIntro({ phase, onBeginTransition, onFinishTransition, onSkip }) {
  const [isMobile, setIsMobile] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const [interaction, setInteraction] = useState({ inRange: false, aimed: false, locked: false });
  const hasStartedRef = useRef(false);
  const muted = useMuted();
  const { ensureAudio } = useIntroAudio(muted);

  useEffect(() => {
    setWebglReady(supportsWebGL());

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateLayoutMode = () => {
      setIsMobile(mediaQuery.matches || window.innerWidth < 900);
    };

    updateLayoutMode();
    mediaQuery.addEventListener('change', updateLayoutMode);
    window.addEventListener('resize', updateLayoutMode);
    return () => {
      mediaQuery.removeEventListener('change', updateLayoutMode);
      window.removeEventListener('resize', updateLayoutMode);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'transitioning') return undefined;
    const timer = window.setTimeout(() => {
      onFinishTransition();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [onFinishTransition, phase]);

  useEffect(() => {
    if (isMobile || phase !== 'intro3d') return undefined;

    const handleClick = async () => {
      if (interaction.inRange && interaction.aimed && !hasStartedRef.current) {
        hasStartedRef.current = true;
        sfx.powerOn();
        onBeginTransition();
      } else {
        await ensureAudio();
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [ensureAudio, interaction.aimed, interaction.inRange, isMobile, onBeginTransition, phase]);

  const handleStart = async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    sfx.powerOn();
    onBeginTransition();
  };

  const handleSkip = (event) => {
    event.stopPropagation();
    onSkip();
  };

  const isReadyToStart = isMobile || (interaction.inRange && interaction.aimed && interaction.locked);

  return (
    <IntroShell $phase={phase} aria-hidden={phase === 'portfolio'}>
      {webglReady ? (
        <ArcadeScene isMobile={isMobile} phase={phase} onInteractionChange={setInteraction} />
      ) : (
        <WebGLFallback
          isMobile={isMobile}
          muted={muted}
          onToggleMute={toggleMute}
          onStart={handleStart}
        />
      )}

      <CabinetFlash $active={phase === 'transitioning'} />

      {webglReady && (
        <>
          <Overlay>
            <TopBar>
              <Panel>
                <Title>{isMobile ? 'Arcade entrance' : 'Walk up to the cabinet'}</Title>
                <Copy>
                  {isMobile
                    ? 'Tap start to step into the machine. The full 3D walk-up is reserved for desktop so the intro stays smooth on phones.'
                    : interaction.locked
                      ? 'Use WASD or arrow keys to move. Aim at the glowing screen when you are close, then click to boot the site.'
                      : 'Click anywhere to enter the room, then use WASD or arrow keys and your mouse to walk toward the glowing cabinet.'}
                </Copy>
              </Panel>
              <ButtonRow>
                <PixelButton
                  type="button"
                  $variant="secondary"
                  onClick={async (event) => {
                    event.stopPropagation();
                    await ensureAudio();
                    toggleMute();
                  }}
                >
                  {muted ? 'Unmute' : 'Mute'}
                </PixelButton>
                {isMobile && (
                  <PixelButton type="button" onClick={handleStart}>
                    Start Arcade
                  </PixelButton>
                )}
                <PixelButton type="button" onClick={handleSkip}>
                  Skip Intro ▸▸
                </PixelButton>
              </ButtonRow>
            </TopBar>

            <BottomBar>
              {phase === 'intro3d' && !isMobile && isReadyToStart && (
                <Prompt>Click the screen to press start</Prompt>
              )}
              {phase === 'intro3d' && !isMobile && !interaction.locked && (
                <Prompt>Click to enter the arcade · Esc to free your mouse</Prompt>
              )}
              {phase === 'intro3d' && isMobile && (
                <Prompt>Tap start to power on the cabinet</Prompt>
              )}
              {phase === 'transitioning' && <Prompt>Booting portfolio...</Prompt>}
            </BottomBar>
          </Overlay>
          <Reticle $visible={!isMobile && interaction.locked && phase === 'intro3d'} $active={isReadyToStart} />
        </>
      )}
    </IntroShell>
  );
}

export default ArcadeIntro;
