import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const pulse = keyframes`
  0%, 100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
`;

const drift = keyframes`
  0% {
    transform: translate3d(-12px, 0, 0);
  }
  100% {
    transform: translate3d(12px, -10px, 0);
  }
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
  font-family: 'Press Start 2P', cursive;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
`;

const Panel = styled.div`
  max-width: min(32rem, 100%);
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
  font-family: 'Press Start 2P', cursive;
  font-size: 0.55rem;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.28);
  text-transform: uppercase;

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
  background: linear-gradient(180deg, #2c3d59 0%, #151a27 42%, #0d111a 100%);
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

const FallbackJoystick = styled.div`
  position: absolute;
  left: 24%;
  bottom: 24%;
  width: 1.2rem;
  height: 3.6rem;
  border-radius: 999px;
  background: linear-gradient(180deg, #8cb5d5, #39526f);

  &::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: 50%;
    width: 2rem;
    height: 2rem;
    transform: translateX(-50%);
    border-radius: 50%;
    background: #ff6e59;
  }
`;

const FallbackButtons = styled.div`
  position: absolute;
  right: 16%;
  bottom: 25%;
  width: 4.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: radial-gradient(circle at 20% 50%, #ffde77 0.55rem, transparent 0.65rem),
    radial-gradient(circle at 80% 50%, #7ef0ff 0.55rem, transparent 0.65rem);
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

function supportsWebGL() {
  if (typeof window === 'undefined') {
    return false;
  }

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

function useIntroAudio(muted) {
  const audioContextRef = useRef(null);
  const humRef = useRef(null);
  const masterGainRef = useRef(null);

  const ensureAudio = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

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

  const playStartTone = async () => {
    await ensureAudio();

    if (!audioContextRef.current || muted) {
      return;
    }

    const context = audioContextRef.current;
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.22);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    osc.start(now);
    osc.stop(now + 0.32);
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

  return { ensureAudio, playStartTone };
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

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((particle) => {
      particle.position[1] += Math.sin(t * 0.3 + particle.key) * 0.0009;
    });
  });

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

function Cabinet({ transitionProgress }) {
  const emissiveIntensity = 1.25 + transitionProgress * 3.7;
  const screenScale = 1 + transitionProgress * 0.22;

  return (
    <group position={[0, 0, -5.2]}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.52, 0.22, 1.54]} />
        <meshStandardMaterial color="#090d14" roughness={0.85} metalness={0.28} />
      </mesh>
      <mesh position={[0, 1.15, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[2.28, 1.62, 1.18]} />
        <meshStandardMaterial color="#101722" roughness={0.75} metalness={0.18} />
      </mesh>
      <mesh position={[0, 2.72, -0.15]} rotation={[-0.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.34, 2.48, 1.12]} />
        <meshStandardMaterial color="#151d2b" roughness={0.7} metalness={0.22} />
      </mesh>
      <mesh position={[-1.16, 2.3, -0.02]} rotation={[0, 0, 0.11]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 3.88, 1.3]} />
        <meshStandardMaterial color="#2f4668" roughness={0.52} metalness={0.38} />
      </mesh>
      <mesh position={[1.16, 2.3, -0.02]} rotation={[0, 0, -0.11]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 3.88, 1.3]} />
        <meshStandardMaterial color="#2f4668" roughness={0.52} metalness={0.38} />
      </mesh>
      <mesh position={[0, 3.98, -0.18]} rotation={[-0.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.16, 0.64, 0.88]} />
        <meshStandardMaterial color="#141b28" roughness={0.62} metalness={0.24} />
      </mesh>
      <mesh position={[0, 3.98, 0.32]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.84, 0.38]} />
        <meshStandardMaterial color="#ffca57" emissive="#ffca57" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 2.58, 0.31]} rotation={[-0.3, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[1.92, 1.28]} />
        <meshStandardMaterial color="#0a1119" roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.58, 0.35]} rotation={[-0.3, 0, 0]} scale={screenScale}>
        <planeGeometry args={[1.7, 1.04]} />
        <meshStandardMaterial
          color="#5de7ff"
          emissive="#4ddfff"
          emissiveIntensity={emissiveIntensity}
          roughness={0.18}
          metalness={0.08}
        />
      </mesh>
      <mesh position={[0, 2.58, 0.4]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.78, 1.12]} />
        <meshPhysicalMaterial
          color="#d2f8ff"
          transparent
          opacity={0.18}
          roughness={0.12}
          metalness={0}
          transmission={0.42}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <mesh position={[0, 1.52, 0.58]} rotation={[-0.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.96, 0.52, 0.82]} />
        <meshStandardMaterial color="#1b2433" roughness={0.48} metalness={0.35} />
      </mesh>
      <mesh position={[0, 1.63, 0.76]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.76, 0.28]} />
        <meshStandardMaterial color="#0b1118" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[-0.66, 1.56, 0.82]} castShadow>
        <cylinderGeometry args={[0.055, 0.07, 0.36, 20]} />
        <meshStandardMaterial color="#6e89a9" roughness={0.38} metalness={0.82} />
      </mesh>
      <mesh position={[-0.66, 1.81, 0.84]} castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color="#ef5c44" emissive="#ef5c44" emissiveIntensity={0.38} roughness={0.35} />
      </mesh>
      <mesh position={[0.34, 1.61, 0.83]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
        <meshStandardMaterial color="#ffd45a" emissive="#f7cb4f" emissiveIntensity={0.22} roughness={0.3} />
      </mesh>
      <mesh position={[0.64, 1.71, 0.84]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
        <meshStandardMaterial color="#69eaf8" emissive="#69eaf8" emissiveIntensity={0.24} roughness={0.28} />
      </mesh>
      <mesh position={[0.93, 1.55, 0.82]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
        <meshStandardMaterial color="#ff8e63" emissive="#ff8e63" emissiveIntensity={0.24} roughness={0.28} />
      </mesh>
      <mesh position={[-0.78, 30.55, 0.33]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.14, 1.18]} />
        <meshStandardMaterial color="#cf3d3c" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0.78, 2.55, 0.33]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.14, 1.18]} />
        <meshStandardMaterial color="#2fb4f2" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.55, -0.48]} castShadow receiveShadow>
        <boxGeometry args={[2.04, 0.96, 0.22]} />
        <meshStandardMaterial color="#0b1018" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.82, 0.42]}>
        <planeGeometry args={[1.45, 0.22]} />
        <meshStandardMaterial color="#1f2836" roughness={0.4} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0.82, 0.43]}>
        <planeGeometry args={[1.3, 0.06]} />
        <meshStandardMaterial color="#3a4b61" roughness={0.22} metalness={0.65} />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[14, 0.12, 16]} />
        <meshStandardMaterial color="#111823" roughness={0.95} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[14, 0.12, 16]} />
        <meshStandardMaterial color="#0a0d12" roughness={1} />
      </mesh>
      <mesh position={[0, 2.1, -8]}>
        <boxGeometry args={[14, 4.2, 0.18]} />
        <meshStandardMaterial color="#101723" roughness={0.96} />
      </mesh>
      <mesh position={[0, 2.1, 8]}>
        <boxGeometry args={[14, 4.2, 0.18]} />
        <meshStandardMaterial color="#0b1119" roughness={0.96} />
      </mesh>
      <mesh position={[-7, 2.1, 0]}>
        <boxGeometry args={[0.18, 4.2, 16]} />
        <meshStandardMaterial color="#0c1018" roughness={1} />
      </mesh>
      <mesh position={[7, 2.1, 0]}>
        <boxGeometry args={[0.18, 4.2, 16]} />
        <meshStandardMaterial color="#0d1118" roughness={1} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 16, 14, 16]} />
        <meshStandardMaterial color="#162130" roughness={0.88} metalness={0.15} />
      </mesh>
      <mesh position={[0, 4.02, -5.15]}>
        <cylinderGeometry args={[0.32, 0.42, 0.4, 20]} />
        <meshStandardMaterial color="#d6b772" emissive="#ffd265" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function StaticCamera({ isMobile, transitionProgress }) {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (isMobile) {
      camera.position.x = Math.sin(clock.getElapsedTime() * 0.25) * 0.24;
      camera.position.y = 2.72;
      camera.position.z = 6.45 - transitionProgress * 10.3;
      camera.lookAt(0, 3.48, -4.6);
    }
  });

  return null;
}

function DesktopController({
  active,
  transitioning,
  onInteractionChange,
  transitionProgress,
}) {
  const controlsRef = useRef(null);
  const keysRef = useRef({});
  const { camera } = useThree();
  const interactionRef = useRef({ inRange: false, aimed: false, locked: false });
  const cabinetPosition = useMemo(() => new THREE.Vector3(0, 2.4, -4.55), []);

  useEffect(() => {
    camera.position.set(0, 1.9, 6.25);
    camera.lookAt(0, 2.1, -5);
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

    if (!controls) {
      return undefined;
    }

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
      const target = new THREE.Vector3(0, 2.44, -4.2);
      camera.position.lerp(target, 0.06 + transitionProgress * 0.1);
      camera.lookAt(0, 2.42, -5.1);
    } else if (active && controlsRef.current?.isLocked) {
      const moveSpeed = 2.3 * safeDelta;
      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

      if (keysRef.current.KeyW || keysRef.current.ArrowUp) {
        direction.add(forward);
      }
      if (keysRef.current.KeyS || keysRef.current.ArrowDown) {
        direction.sub(forward);
      }
      if (keysRef.current.KeyD || keysRef.current.ArrowRight) {
        direction.add(right);
      }
      if (keysRef.current.KeyA || keysRef.current.ArrowLeft) {
        direction.sub(right);
      }

      if (direction.lengthSq() > 0) {
        direction.normalize().multiplyScalar(moveSpeed);
        camera.position.add(direction);
      }

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -4.7, 4.7);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -3.4, 6.7);
      camera.position.y = 1.9;
    }

    const toCabinet = cabinetPosition.clone().sub(camera.position);
    const distance = toCabinet.length();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const alignment = forward.dot(toCabinet.normalize());
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

function ArcadeScene({
  isMobile,
  phase,
  onInteractionChange,
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ fov: isMobile ? 44 : 68, position: [0, 1.65, 6.25] }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 7.5, 16]} />
      <ambientLight intensity={0.2} color="#7da6ff" />
      <spotLight
        position={[0, 4, -5.1]}
        angle={0.45}
        penumbra={0.8}
        intensity={75}
        color="#ffd77a"
        castShadow
      />
      <pointLight position={[0, 2.3, -4.5]} intensity={18} color="#76efff" distance={8} />
      <Suspense fallback={<Html center>Loading...</Html>}>
        <TransitionDirector phase={phase}>
          {(transitionProgress) => (
            <>
              <Room />
              <Float speed={1.3} rotationIntensity={0.04} floatIntensity={0.12}>
                <Cabinet transitionProgress={transitionProgress} />
              </Float>
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
          <FallbackJoystick />
          <FallbackButtons />
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

function ArcadeIntro({ phase, onBeginTransition, onFinishTransition }) {
  const [isMobile, setIsMobile] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const [muted, setMuted] = useState(false);
  const [interaction, setInteraction] = useState({ inRange: false, aimed: false, locked: false });
  const hasStartedRef = useRef(false);
  const { ensureAudio, playStartTone } = useIntroAudio(muted);

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
    if (phase !== 'transitioning') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onFinishTransition();
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onFinishTransition, phase]);

  useEffect(() => {
    if (isMobile || phase !== 'intro3d') {
      return undefined;
    }

    const handleClick = async () => {
      if (interaction.inRange && interaction.aimed && !hasStartedRef.current) {
        hasStartedRef.current = true;
        await playStartTone();
        onBeginTransition();
      } else {
        await ensureAudio();
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [ensureAudio, interaction.aimed, interaction.inRange, isMobile, onBeginTransition, phase, playStartTone]);

  const handleStart = async () => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    await playStartTone();
    onBeginTransition();
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
          onToggleMute={() => setMuted((current) => !current)}
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
                  onClick={async () => {
                    await ensureAudio();
                    setMuted((current) => !current);
                  }}
                >
                  {muted ? 'Unmute' : 'Mute'}
                </PixelButton>
                {isMobile && (
                  <PixelButton type="button" onClick={handleStart}>
                    Start Arcade
                  </PixelButton>
                )}
              </ButtonRow>
            </TopBar>

            <BottomBar>
              {phase === 'intro3d' && !isMobile && isReadyToStart && (
                <Prompt>Click arcade to start</Prompt>
              )}
              {phase === 'intro3d' && !isMobile && !interaction.locked && (
                <Prompt>Click to enter room</Prompt>
              )}
              {phase === 'intro3d' && isMobile && (
                <Prompt>Tap start to power on the cabinet</Prompt>
              )}
              {phase === 'transitioning' && (
                <Prompt>Booting portfolio...</Prompt>
              )}
            </BottomBar>
          </Overlay>
          <Reticle $visible={!isMobile && interaction.locked && phase === 'intro3d'} $active={isReadyToStart} />
        </>
      )}
    </IntroShell>
  );
}

export default ArcadeIntro;
