import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { scroller } from 'react-scroll';

import ground from '../assets/ground.png';
import cloud from '../assets/cloud.png';
import marioRun from '../assets/mario_run.gif';
import marioIdle from '../assets/mario_slide.png';
import shortPipe from '../assets/pipe.png';
import { sfx } from '../hooks/useSound';

const MOVE_SPEED     = 220;   // px/s
const JUMP_VEL       = 500;   // px/s upward
const GRAVITY        = 1150;  // px/s²
const MARIO_W        = 60;    // sprite width px
const MARIO_H        = 74;    // sprite height px
const GROUND_H       = 40;    // ground tile strip height px
const PIPE_W         = 90;    // pipe sprite width px
const PIPE_ENTER_SPD = 130;   // px/s Mario sinks into pipe
const BLOCK_SIZE     = 46;    // ?-block px
const BLOCK_BOTTOM   = 150;   // ?-block underside height above ground px
const BLOCK_MAX_HITS = 5;     // coins per block before it empties

// xPercent: pipe center as % of container width
const PIPES = [
  { label: 'ABOUT',      target: 'about',      xPercent: 15, pipeH: 90 },
  { label: 'SKILLS',     target: 'skills',     xPercent: 35, pipeH: 90 },
  { label: 'EXPERIENCE', target: 'experience', xPercent: 62, pipeH: 90 },
  { label: 'PROJECTS',   target: 'projects',   xPercent: 82, pipeH: 90 },
];

const BLOCKS = [
  { xPercent: 44 },
  { xPercent: 50 },
  { xPercent: 56 },
];

const bob = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(-8px); }
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

const blockBounce = keyframes`
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-12px); }
  100% { transform: translateY(0); }
`;

const coinRise = keyframes`
  0%   { transform: translateY(0) rotateY(0deg); opacity: 1; }
  100% { transform: translateY(-90px) rotateY(540deg); opacity: 0; }
`;

const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: var(--sky);
  font-family: var(--font-pixel);
  border-bottom: 4px solid #2f2f2f;
`;

const TitleArea = styled.div`
  position: absolute;
  top: clamp(7rem, 22vh, 13rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;
  width: max-content;
  max-width: 92vw;
`;

const TypingTitle = styled.h1`
  color: #fff;
  margin: 0;
  font-size: clamp(0.95rem, 2.4vw, 1.9rem);
  text-shadow: 4px 4px 0 #2f2f2f;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid rgba(255,255,255,0.8);
  width: 0;
  animation: ${typing} 2.6s steps(18, end) forwards, ${blink} 0.75s step-end infinite;
  display: inline-block;
`;

const Subtitle = styled.p`
  margin: 1.1rem 0 0;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(0.85rem, 1.6vw, 1.05rem);
  color: rgba(255, 255, 255, 0.94);
  text-shadow: 1px 1px 0 rgba(47, 47, 47, 0.5);
  opacity: 0;
  animation: fadeIn 0.8s ease 2.7s forwards;

  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const CloudImg = styled.img`
  position: absolute;
  image-rendering: pixelated;
  z-index: 1;
  pointer-events: none;
  animation: ${driftLeftToRight} linear infinite;

  @media (max-width: 768px) {
    display: none;
  }
`;

const PipeWrapper = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 4;
  cursor: pointer;
`;

const PipeLabel = styled.div`
  margin-bottom: 0.45rem;
  padding: 0.35rem 0.5rem;
  background: var(--gold);
  color: #2f2f2f;
  border: 3px solid #2f2f2f;
  box-shadow: 2px 2px 0 rgba(47, 47, 47, 0.55);
  font-size: 0.42rem;
  white-space: nowrap;
  transition: transform 0.15s ease;

  ${PipeWrapper}:hover & {
    transform: translateY(-3px);
    background: #ffe066;
  }
`;

const PipeImg = styled.img`
  display: block;
  width: ${PIPE_W}px;
  height: ${({ $h }) => $h}px;
  image-rendering: pixelated;
  object-fit: fill;
`;

const QuestionBlock = styled.div`
  position: absolute;
  bottom: ${GROUND_H + BLOCK_BOTTOM}px;
  width: ${BLOCK_SIZE}px;
  height: ${BLOCK_SIZE}px;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $used }) => ($used ? '#9a6a2c' : 'var(--gold)')};
  border: 4px solid #2f2f2f;
  box-shadow: inset -4px -4px 0 rgba(0, 0, 0, 0.25), inset 4px 4px 0 rgba(255, 255, 255, 0.35);
  color: ${({ $used }) => ($used ? 'rgba(47,47,47,0.45)' : '#2f2f2f')};
  font-size: 1.1rem;
  pointer-events: none;

  &.bounce {
    animation: ${blockBounce} 0.24s ease;
  }
`;

const PopCoin = styled.div`
  position: absolute;
  width: 22px;
  height: 22px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #ffe87a, #e8a000);
  border: 3px solid #b8860b;
  z-index: 3;
  pointer-events: none;
  animation: ${coinRise} 0.6s ease-out forwards;
`;

const MarioSprite = styled.img`
  position: absolute;
  height: ${MARIO_H}px;
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
  background: rgba(255, 255, 255, 0.92);
  border: 3px solid #2f2f2f;
  color: #2f2f2f;
  font-size: 0.4rem;
  white-space: nowrap;
  animation: ${bob} 2s ease-in-out infinite;
  pointer-events: none;

  @media (max-width: 600px), (pointer: coarse) {
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

const TouchControls = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${GROUND_H + 12}px;
  z-index: 20;
  display: none;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;

  @media (pointer: coarse) {
    display: flex;
  }
`;

const TouchGroup = styled.div`
  display: flex;
  gap: 0.7rem;
  pointer-events: auto;
`;

const TouchButton = styled.button`
  width: 58px;
  height: 58px;
  border: 4px solid #2f2f2f;
  background: rgba(255, 255, 255, 0.85);
  color: #2f2f2f;
  font-family: var(--font-pixel);
  font-size: 1rem;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    background: var(--gold);
  }
`;

const INIT_STATE = {
  x: 80, y: 0, vy: 0,
  facingRight: true,
  jumpWasDown: false,
  mode: 'walking',   // 'walking' | 'entering_pipe'
  targetPipe: -1,
  enterX: 0,
};

let coinId = 0;

const HeroSection = () => {
  const containerRef = useRef(null);
  const pipeImgRefs  = useRef([]);
  const blockRefs    = useRef([]);
  const keysRef      = useRef({});
  const stateRef     = useRef({ ...INIT_STATE });
  const frameRef     = useRef(null);
  const lastTimeRef  = useRef(null);
  const inViewRef    = useRef(true);
  const navigatedRef = useRef(false);
  const blockHitsRef = useRef(BLOCKS.map(() => 0));

  const [render, setRender] = useState({
    x: 80, y: 0,
    facingRight: true,
    moving: false,
    entering: false,
    targetPipe: -1,
  });
  const [blockBounces, setBlockBounces] = useState(BLOCKS.map(() => 0));
  const [usedBlocks, setUsedBlocks] = useState(BLOCKS.map(() => false));
  const [popCoins, setPopCoins] = useState([]);

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

  const spawnCoin = (index) => {
    const el = blockRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const rect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const id = ++coinId;
    setPopCoins((coins) => [
      ...coins,
      { id, left: rect.left - cRect.left + rect.width / 2, bottom: GROUND_H + BLOCK_BOTTOM + BLOCK_SIZE },
    ]);
    setTimeout(() => {
      setPopCoins((coins) => coins.filter((c) => c.id !== id));
    }, 650);
  };

  const hitBlock = (index) => {
    const hits = blockHitsRef.current[index];
    if (hits >= BLOCK_MAX_HITS) {
      sfx.bump();
      return;
    }
    blockHitsRef.current[index] = hits + 1;
    sfx.coin();
    window.dispatchEvent(new Event('mario:coin'));
    spawnCoin(index);
    setBlockBounces((b) => b.map((v, i) => (i === index ? v + 1 : v)));
    if (hits + 1 >= BLOCK_MAX_HITS) {
      setUsedBlocks((u) => u.map((v, i) => (i === index ? true : v)));
    }
  };

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

        if (y < 0 && !navigatedRef.current) {
          navigatedRef.current = true;
          scroller.scrollTo(PIPES[targetPipe].target, {
            smooth: true, duration: 700, offset: -56,
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
        sfx.jump();
      }
      jumpWasDown = jumpDown;

      // Apply physics
      const prevY = y;
      vy -= GRAVITY * dt;
      y  += vy * dt;

      const cRect = containerRef.current?.getBoundingClientRect();

      // ?-block headbutt — only while rising, head crossing block underside
      if (vy > 0 && cRect) {
        const prevHead = prevY + MARIO_H;
        const newHead = y + MARIO_H;
        for (let i = 0; i < BLOCKS.length; i++) {
          const el = blockRefs.current[i];
          if (!el) continue;
          const br = el.getBoundingClientRect();
          const bLeft = br.left - cRect.left;
          const bRight = br.right - cRect.left;
          const mL = x + MARIO_W * 0.25;
          const mR = x + MARIO_W * 0.75;
          if (mR > bLeft && mL < bRight && prevHead <= BLOCK_BOTTOM && newHead > BLOCK_BOTTOM) {
            y = BLOCK_BOTTOM - MARIO_H;
            vy = 0;
            hitBlock(i);
            break;
          }
        }
      }

      // Pipe-top collision — only while falling, crossing the pipe rim from above
      if (vy <= 0 && cRect) {
        for (let i = 0; i < PIPES.length; i++) {
          const el = pipeImgRefs.current[i];
          if (!el) continue;
          const pr    = el.getBoundingClientRect();
          const pLeft = pr.left - cRect.left;
          const pRight = pr.right - cRect.left;

          const mL = x + MARIO_W * 0.2;
          const mR = x + MARIO_W * 0.8;
          if (mR > pLeft && mL < pRight) {
            const pipeH = PIPES[i].pipeH;
            if (y <= pipeH && prevY > pipeH) {
              y = pipeH;
              vy = 0;
              mode = 'entering_pipe';
              targetPipe = i;
              const pipeCenterX = pLeft + (pRight - pLeft) / 2;
              enterX = pipeCenterX - MARIO_W / 2;
              sfx.pipe();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pressKey = (key, down) => {
    keysRef.current[key] = down;
  };

  const touchHandlers = (key) => ({
    onTouchStart: (e) => { e.preventDefault(); pressKey(key, true); },
    onTouchEnd: (e) => { e.preventDefault(); pressKey(key, false); },
    onTouchCancel: () => pressKey(key, false),
  });

  const clickPipe = (pipe) => {
    sfx.pipe();
    scroller.scrollTo(pipe.target, { smooth: true, duration: 600, offset: -56 });
  };

  const { x, y, facingRight, moving, entering, targetPipe: rtPipe } = render;

  // While entering: go behind the pipe body once below the pipe rim
  let marioZIdx = 5;
  if (entering && rtPipe >= 0 && y < PIPES[rtPipe].pipeH) {
    marioZIdx = 3;
  }

  return (
    <HeroContainer ref={containerRef} id="hero">
      <CloudImg src={cloud} style={{ top: '40px', width: '420px', animationDuration: '90s' }} />
      <CloudImg src={cloud} style={{ top: '130px', width: '320px', animationDuration: '65s', animationDelay: '-30s' }} />

      <TitleArea>
        <TypingTitle>HI! I&apos;M JASMEHAR</TypingTitle>
        <Subtitle>software engineering @ uwaterloo · ai + full stack</Subtitle>
      </TitleArea>

      {BLOCKS.map((block, i) => (
        <QuestionBlock
          key={`b${i}-${blockBounces[i]}`}
          ref={el => { blockRefs.current[i] = el; }}
          style={{ left: `${block.xPercent}%` }}
          className={blockBounces[i] > 0 ? 'bounce' : ''}
          $used={usedBlocks[i]}
        >
          {usedBlocks[i] ? '' : '?'}
        </QuestionBlock>
      ))}

      {popCoins.map((coin) => (
        <PopCoin key={coin.id} style={{ left: coin.left, bottom: coin.bottom }} />
      ))}

      {PIPES.map((pipe, i) => (
        <PipeWrapper
          key={pipe.target}
          style={{ left: `${pipe.xPercent}%` }}
          onClick={() => clickPipe(pipe)}
          role="link"
          aria-label={`Go to ${pipe.label.toLowerCase()}`}
        >
          <PipeLabel>{pipe.label}</PipeLabel>
          <PipeImg
            ref={el => { pipeImgRefs.current[i] = el; }}
            src={shortPipe}
            alt=""
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

      <Hint>← → move · ↑ jump · bump ? blocks · land on a pipe to enter</Hint>

      <TouchControls>
        <TouchGroup>
          <TouchButton {...touchHandlers('ArrowLeft')} aria-label="move left">◀</TouchButton>
          <TouchButton {...touchHandlers('ArrowRight')} aria-label="move right">▶</TouchButton>
        </TouchGroup>
        <TouchGroup>
          <TouchButton {...touchHandlers('ArrowUp')} aria-label="jump">A</TouchButton>
        </TouchGroup>
      </TouchControls>

      <GroundStrip />
    </HeroContainer>
  );
};

export default HeroSection;
