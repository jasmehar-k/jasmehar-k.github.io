import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { scroller } from 'react-scroll';

import ground from '../assets/ground.png';
import cloud from '../assets/cloud.png';
import marioRun from '../assets/mario_run.gif';
import marioIdle from '../assets/mario_slide.png';
import shortPipe from '../assets/pipe.png';

const MOVE_SPEED      = 220;   // px/s
const JUMP_VEL        = 500;   // px/s upward
const GRAVITY         = 1150;  // px/s²
const MARIO_W         = 60;    // sprite width px
const MARIO_H         = 80;    // sprite height px (approx, for exit detection)
const GROUND_H        = 40;    // ground tile strip height px
const PIPE_W          = 90;    // pipe sprite width px
const PIPE_ENTER_SPD  = 130;   // px/s Mario sinks into pipe

// xPercent: pipe center as % of container width
// pipeH: pipe height in px above ground (= y value where Mario's feet land on it)
const PIPES = [
  { label: 'ABOUT',      target: 'about',      xPercent: 15, pipeH: 90  },
  { label: 'SKILLS',     target: 'skills',     xPercent: 35, pipeH: 90 },
  { label: 'EXPERIENCE', target: 'experience', xPercent: 62, pipeH: 90 },
  { label: 'PROJECTS',   target: 'projects',   xPercent: 82, pipeH: 90 },
];

const bob = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(-8px); }
`;

const typing = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;

const blink = keyframes`
  0%   { border-right-color: rgba(255,255,255,0.7); }
  50%  { border-right-color: transparent; }
  100% { border-right-color: rgba(255,255,255,0.7); }
`;

const driftLeftToRight = keyframes`
  0%   { left: -500px; }
  100% { left: 110%; }
`;

const driftFromCenterToRight = keyframes`
  0%   { left: calc(50% - 250px); }
  100% { left: 110%; }
`;

const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #5c94fc;
  font-family: 'Press Start 2P', cursive;
  border-bottom: 4px solid #2f2f2f;
`;

const TitleArea = styled.div`
  position: absolute;
  top: 15rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;
`;

const TypingTitle = styled.h1`
  color: #fff;
  margin: 0;
  font-size: clamp(0.85rem, 2vw, 1.7rem);
  text-shadow: 4px 4px 0 #2f2f2f;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid rgba(255,255,255,0.8);
  width: 0;
  animation: ${typing} 3s  steps(20, end) forwards, ${blink} 0.75s step-end infinite;
`;

const CloudImg = styled.img`
  position: absolute;
  image-rendering: pixelated;
  z-index: 1;
  pointer-events: none;
  top: ${({ $top }) => $top};
  width: ${({ $width }) => $width};
  animation: ${({ $anim }) => $anim} ${({ $duration }) => $duration} linear
    ${({ $delay }) => $delay ?? '0s'} ${({ $repeat }) => $repeat ?? 'infinite'};

  @media (max-width: 768px) {
    display: none;
  }
`;

/* Each pipe is absolutely centered at xPercent, sitting on top of the ground strip */
const PipeWrapper = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 4;
  pointer-events: none;
`;

const PipeLabel = styled.div`
  margin-bottom: 0.45rem;
  padding: 0.3rem 0.5rem;
  background: #ffcc00;
  color: #2f2f2f;
  border: 3px solid #2f2f2f;
  font-size: 0.4rem;
  white-space: nowrap;
`;

const PipeImg = styled.img`
  display: block;
  width: ${PIPE_W}px;
  height: ${({ $h }) => $h}px;
  image-rendering: pixelated;
  object-fit: fill;
`;

const MarioSprite = styled.img`
  position: absolute;
  height: 74px;
  width: auto;
  image-rendering: pixelated;
  z-index: ${({ $zidx }) => $zidx};
  pointer-events: none;
`;

const Hint = styled.div`
  position: absolute;
  left: 50%;
  bottom: ${GROUND_H + 108}px;
  z-index: 10;
  padding: 0.45rem 0.7rem;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid #2f2f2f;
  color: #2f2f2f;
  font-size: 0.38rem;
  white-space: nowrap;
  animation: ${bob} 2s ease-in-out infinite;
  pointer-events: none;

  @media (max-width: 600px) {
    display: none;
  }
`;

const GroundStrip = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: ${GROUND_H}px;
  background-image: url(${ground});
  background-repeat: repeat-x;
  background-size: contain;
  z-index: 6;
`;

const INIT_STATE = {
  x: 80, y: 0, vy: 0,
  facingRight: true,
  jumpWasDown: false,
  mode: 'walking',   // 'walking' | 'entering_pipe'
  targetPipe: -1,
  enterX: 0,
};

const HeroSection = () => {
  const containerRef = useRef(null);
  const pipeImgRefs  = useRef([]);
  const keysRef      = useRef({});
  const stateRef     = useRef({ ...INIT_STATE });
  const frameRef     = useRef(null);
  const lastTimeRef  = useRef(null);
  const inViewRef    = useRef(true);
  const navigatedRef = useRef(false);

  const [render, setRender] = useState({
    x: 80, y: 0,
    facingRight: true,
    moving: false,
    entering: false,
    targetPipe: -1,
  });

  // Disable arrow-key page scroll when hero is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { inViewRef.current = e.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Keyboard input
  useEffect(() => {
    const HANDLED = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','A','d','D','w','W',' ']);
    const onDown = (e) => {
      if (inViewRef.current && HANDLED.has(e.key)) e.preventDefault();
      keysRef.current[e.key] = true;
    };
    const onUp = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const tick = (time) => {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0;
      lastTimeRef.current = time;

      const keys = keysRef.current;
      let { x, y, vy, facingRight, jumpWasDown, mode, targetPipe, enterX } = stateRef.current;
      const containerW = containerRef.current?.offsetWidth ?? 1000;

      // ── Pipe entry animation ──────────────────────────────────────────────
      if (mode === 'entering_pipe') {
        y -= PIPE_ENTER_SPD * dt;

        // Trigger navigation once Mario's feet pass below ground
        if (y < 0 && !navigatedRef.current) {
          navigatedRef.current = true;
          scroller.scrollTo(PIPES[targetPipe].target, {
            smooth: true, duration: 700, offset: -80,
          });
          setTimeout(() => {
            stateRef.current = { ...INIT_STATE };
            navigatedRef.current = false;
            setRender({ x: INIT_STATE.x, y: 0, facingRight: true, moving: false, entering: false, targetPipe: -1 });
          }, 900);
        }

        stateRef.current = { x: enterX, y, vy: 0, facingRight, jumpWasDown, mode, targetPipe, enterX };
        setRender(r => ({ ...r, x: enterX, y, entering: true, targetPipe }));
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      // ── Walking / jumping ─────────────────────────────────────────────────
      let moving = false;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        x -= MOVE_SPEED * dt;
        facingRight = false;
        moving = true;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        x += MOVE_SPEED * dt;
        facingRight = true;
        moving = true;
      }
      x = Math.max(0, Math.min(containerW - MARIO_W, x));

      // Jump — only from ground level
      const jumpDown = !!(keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']);
      if (jumpDown && !jumpWasDown && y <= 0) {
        vy = JUMP_VEL;
        moving = true;
      }
      jumpWasDown = jumpDown;

      // Apply physics
      const prevY = y;
      vy -= GRAVITY * dt;
      y  += vy * dt;

      // Pipe-top collision — only while falling, crossing the pipe rim from above
      if (vy <= 0 && containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        for (let i = 0; i < PIPES.length; i++) {
          const el = pipeImgRefs.current[i];
          if (!el) continue;
          const pr    = el.getBoundingClientRect();
          const pLeft = pr.left - cRect.left;
          const pRight = pr.right - cRect.left;

          // Mario's inner quarter-points must overlap the pipe
          const mL = x + MARIO_W * 0.2;
          const mR = x + MARIO_W * 0.8;
          if (mR > pLeft && mL < pRight) {
            const pipeH = PIPES[i].pipeH;
            if (y <= pipeH && prevY > pipeH) {
              // Snap Mario's feet to pipe top and start entry
              y = pipeH;
              vy = 0;
              mode = 'entering_pipe';
              targetPipe = i;
              const pipeCenterX = pLeft + (pRight - pLeft) / 2;
              enterX = pipeCenterX - MARIO_W / 2;
              break;
            }
          }
        }
      }

      // Ground floor
      if (y <= 0) { y = 0; vy = 0; }

      stateRef.current = { x, y, vy, facingRight, jumpWasDown, mode, targetPipe, enterX };
      setRender({ x, y, facingRight, moving, entering: false, targetPipe: -1 });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const { x, y, facingRight, moving, entering, targetPipe: rtPipe } = render;

  // While entering: go behind the pipe body once below the pipe rim
  let marioZIdx = 5;
  if (entering && rtPipe >= 0 && y < PIPES[rtPipe].pipeH) {
    marioZIdx = 3;
  }

  return (
    <HeroContainer ref={containerRef}>
      {/* Drifting clouds */}
      {/* <CloudImg src={cloud} $top="30px"  $width="500px" $anim={driftLeftToRight}      $duration="100s" $delay="25s" />
      <CloudImg src={cloud} $top="120px" $width="500px" $anim={driftLeftToRight}      $duration="70s" />
      <CloudImg src={cloud} $top="90px"  $width="400px" $anim={driftFromCenterToRight} $duration="60s" $repeat="forwards" /> */}

      <TitleArea>
        <TypingTitle>HI! I&apos;M JASMEHAR</TypingTitle>
      </TitleArea>

      {PIPES.map((pipe, i) => (
        <PipeWrapper key={pipe.target} style={{ left: `${pipe.xPercent}%` }}>
          <PipeLabel>{pipe.label}</PipeLabel>
          <PipeImg
            ref={el => { pipeImgRefs.current[i] = el; }}
            src={shortPipe}
            alt={pipe.label}
            $h={pipe.pipeH}
          />
        </PipeWrapper>
      ))}

      <MarioSprite
        src={moving || entering ? marioRun : marioIdle}
        alt="Mario"
        $zidx={marioZIdx}
        style={{
          bottom: `${GROUND_H + y}px`,
          left: `${x}px`,
          transform: `scaleX(${facingRight ? 1 : -1})`,
        }}
      />

      <Hint>← → / A D &nbsp; move &nbsp;|&nbsp; ↑ / W &nbsp; jump &nbsp;|&nbsp; land on a pipe to enter!</Hint>
      <GroundStrip />
    </HeroContainer>
  );
};

export default HeroSection;
