// HeroSection — a playable world 1-1.
//
// Mario is under the visitor's control (arrows or WASD, up/W/space to jump).
// Each pipe is a section: stand on one and he ducks into it and the page
// scrolls there. Clicking a pipe hands control to the game, which runs him
// over and jumps him onto it.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { scroller } from 'react-scroll';

import marioRun from '../assets/mario_run.gif';
import marioIdle from '../assets/mario_slide.png';
import { overworld } from '../utils/overworldArt';
import { NES } from '../utils/pixelSprite';
import { sfx } from '../hooks/useSound';

/* ────────────────────────────── physics ─────────────────────────────── */

const TILE = 40;
const GROUND_H = TILE * 2;
// Big Mario stands two blocks tall in the game, and the sprite here is the big
// one, so he is scaled against the tile rather than under it.
const MARIO_W = 52;
const MARIO_H = 76;
const WALK_SPEED = 250; // px/s under manual control
const RUN_SPEED = 355; // px/s when the game is driving him to a pipe
const JUMP_VEL = 660; // px/s upward
const GRAVITY = 1300; // px/s²
const ENTER_SPEED = 150; // px/s sinking into a pipe

// jump apex = JUMP_VEL² / (2 * GRAVITY) ≈ 167px, so nothing he has to land on
// is allowed to be taller than that
const APEX = (JUMP_VEL * JUMP_VEL) / (2 * GRAVITY);

// How far out to start a jump so he is falling back through a lid of height h
// exactly as he arrives over it. Jumping at a fixed distance instead just sails
// him over the top every time.
const runway = (h) => {
  const rise = JUMP_VEL / GRAVITY;
  const fall = Math.sqrt((2 * Math.max(0, APEX - h)) / GRAVITY);
  return RUN_SPEED * (rise + fall);
};

/* Pipe width has to shrink on narrow screens: the four pipes sit at fixed
   percentages, so at 390px they are only 78px apart and a 108px rim makes them
   physically overlap — lids included, which lands him on the wrong pipe. */
const PIPE_SIZES = [
  { max: 560, rim: 64, body: 54 },
  { max: 900, rim: 88, body: 74 },
];
const PIPE_W = 92;
const RIM_W = 108;
const RIM_H = 28;

// He only ducks in when his middle is genuinely over the mouth. This is a
// fraction of each lid's *measured* width, so it scales with the responsive
// pipe; at a flat 30% of PIPE_W it was 28px, enough to drop in visibly off.
const ENTER_FRACTION = 0.16;
const CENTRE_SPEED = 340; // px/s he slides onto the mouth as he sinks

const PIPES = [
  { label: 'ABOUT', target: 'about', xPct: 0.2, h: 80 },
  { label: 'EXPERIENCE', target: 'experience', xPct: 0.4, h: 120 },
  { label: 'PROJECTS', target: 'projects', xPct: 0.6, h: 120 },
  { label: 'SKILLS', target: 'skills', xPct: 0.79, h: 80 },
];

// tops clear the fixed status bar, which is ~64px and taller once it stacks
const CLOUDS = [
  { top: 112, w: 160, dur: 95, delay: 0 },
  { top: 196, w: 120, dur: 72, delay: -30 },
  { top: 146, w: 200, dur: 120, delay: -60 },
];

const HILLS = [
  { xPct: 0.02, w: 280 },
  { xPct: 0.55, w: 180 },
];

const BUSHES = [
  { xPct: 0.3, w: 160 },
  { xPct: 0.68, w: 120 },
  { xPct: 0.92, w: 140 },
];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

/* ──────────────────────────── presentation ──────────────────────────── */

const drift = keyframes`
  from { transform: translateX(-240px); }
  to   { transform: translateX(calc(100vw + 240px)); }
`;

const typing = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;

const caret = keyframes`
  0%, 100% { border-right-color: rgba(255, 255, 255, 0.85); }
  50%      { border-right-color: transparent; }
`;

const Level = styled.section`
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: ${NES.sky};
  font-family: 'Press Start 2P', cursive;
  user-select: none;
`;

const Cloud = styled.div`
  position: absolute;
  top: ${({ $top }) => $top}px;
  height: ${({ $w }) => Math.round(($w * 10) / 32)}px;
  width: ${({ $w }) => $w}px;
  background-image: ${overworld.cloud};
  background-size: 100% 100%;
  image-rendering: pixelated;
  animation: ${drift} linear infinite;
  z-index: 1;
  pointer-events: none;

  /* the status bar stacks into two rows here, so it eats more headroom */
  @media (max-width: 900px) {
    top: ${({ $top }) => $top + 56}px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Hill = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  height: ${({ $w }) => Math.round(($w * 14) / 32)}px;
  width: ${({ $w }) => $w}px;
  background-image: ${overworld.hill};
  background-size: 100% 100%;
  image-rendering: pixelated;
  z-index: 1;
  pointer-events: none;
`;

const Bush = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  height: ${({ $w }) => Math.round(($w * 7) / 24)}px;
  width: ${({ $w }) => $w}px;
  background-image: ${overworld.bush};
  background-size: 100% 100%;
  image-rendering: pixelated;
  z-index: 2;
  pointer-events: none;
`;

const Ground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${GROUND_H}px;
  background-image: ${overworld.ground};
  background-size: ${TILE}px ${TILE}px;
  background-repeat: repeat;
  image-rendering: pixelated;
  z-index: 6;
`;

const PipeWrap = styled.button`
  position: absolute;
  bottom: ${GROUND_H}px;
  /* centres on its own width, so it stays on the mark whether the rim or the
     label happens to be the widest thing in the column */
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  z-index: 4;
  font-family: inherit;
`;

/* the game draws pipes as a light highlight column, a mid body and a dark
   shadow column, all inside a black outline */
const pipeSkin = (w) => `
  background: linear-gradient(
    90deg,
    ${NES.black} 0 4px,
    ${NES.greenLight} 4px ${Math.round(w * 0.22)}px,
    ${NES.greenMid} ${Math.round(w * 0.22)}px ${Math.round(w * 0.68)}px,
    ${NES.greenDark} ${Math.round(w * 0.68)}px ${w - 4}px,
    ${NES.black} ${w - 4}px 100%
  );
`;

const PipeRim = styled.span`
  width: ${RIM_W}px;
  height: ${RIM_H}px;
  ${pipeSkin(RIM_W)}
  box-shadow: inset 0 4px 0 ${NES.black}, inset 0 -4px 0 ${NES.black};

  ${PIPE_SIZES.map((z) => `
    @media (max-width: ${z.max}px) {
      width: ${z.rim}px;
      ${pipeSkin(z.rim)}
    }
  `).join('')}
`;

const PipeBody = styled.span`
  width: ${PIPE_W}px;
  height: ${({ $h }) => $h - RIM_H}px;
  ${pipeSkin(PIPE_W)}

  ${PIPE_SIZES.map((z) => `
    @media (max-width: ${z.max}px) {
      width: ${z.body}px;
      ${pipeSkin(z.body)}
    }
  `).join('')}
`;

const PipeLabel = styled.span`
  margin-bottom: 0.55rem;
  padding: 0.4rem 0.5rem;
  background: ${NES.qMid};
  color: ${NES.black};
  border: 3px solid ${NES.black};
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.45);
  font-size: 0.42rem;
  white-space: nowrap;
  transition: transform 0.15s ease, background 0.15s ease;

  ${PipeWrap}:hover &,
  ${PipeWrap}:focus-visible & {
    transform: translateY(-4px);
    background: #ffc356;
  }
`;

/* The two sprites frame their character very differently, so sizing both to the
   same box leaves the running one visibly shorter. Measured from the files:
   the run gif's Mario fills ~85.6% of its 160px frame (it carries 15-30px of
   headroom, and the content bobs between 130 and 145px as he runs), while the
   standing png's fills ~94.7% of its 876px frame.
   Each sprite is therefore given the frame height that makes the *character*
   MARIO_H tall, plus a nudge down so the feet sit on the ground either way. */
/* nudge: the character is not centred inside its own frame either — measured
   at +1.6px (idle) and +6.1px (run, wandering as his limbs swing), so centring
   the frame leaves the character itself off to the right. */
const SPRITES = {
  idle: { src: marioIdle, frame: 80, drop: 1, nudge: 2 },
  run: { src: marioRun, frame: 89, drop: 2, nudge: 6 },
};

const MarioBox = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${MARIO_W}px;
  height: ${MARIO_H}px;
  pointer-events: none;
  will-change: transform;
`;

const MarioSprite = styled.img`
  position: absolute;
  left: 50%;
  bottom: ${({ $drop }) => -$drop}px;
  height: ${({ $frame }) => $frame}px;
  width: auto;
  max-width: none;
  transform: translateX(calc(-50% - ${({ $nudge }) => $nudge}px));
  image-rendering: pixelated;
`;

const TitleArea = styled.div`
  position: absolute;
  top: clamp(7.5rem, 20vh, 12rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  text-align: center;
  pointer-events: none;
  width: max-content;
  max-width: 92vw;
`;

const Title = styled.h1`
  margin: 0;
  color: ${NES.white};
  font-size: clamp(0.9rem, 2.4vw, 1.85rem);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.45);
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid rgba(255, 255, 255, 0.85);
  width: 0;
  display: inline-block;
  animation: ${typing} 2.4s steps(17, end) forwards, ${caret} 0.75s step-end infinite;
`;

const Subtitle = styled.p`
  margin: 1.2rem 0 0;
  font-size: clamp(0.4rem, 0.9vw, 0.52rem);
  line-height: 2;
  color: ${NES.white};
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.45);
  opacity: 0;
  animation: fadeIn 0.7s ease 2.5s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

/* Sits with the title rather than down by the ground: anywhere near the floor
   it ends up behind a pipe. */
const Hint = styled.p`
  margin: 2rem 0 0;
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  color: ${NES.white};
  font-size: 0.4rem;
  line-height: 1.9;
  opacity: 0;
  animation: fadeIn 0.7s ease 3s forwards;

  @media (max-width: 900px), (pointer: coarse) {
    display: none;
  }
`;

const Touch = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${GROUND_H + 14}px;
  z-index: 8;
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

const TouchBtn = styled.button`
  width: 60px;
  height: 60px;
  border: 4px solid ${NES.black};
  background: rgba(255, 255, 255, 0.85);
  color: ${NES.black};
  font-family: 'Press Start 2P', cursive;
  font-size: 0.9rem;
  touch-action: none;

  &:active {
    background: ${NES.qMid};
  }
`;

/* ─────────────────────────────── the level ──────────────────────────── */

const START = {
  x: 60, y: 0, vy: 0, facing: 1, mode: 'play', target: -1, phase: 'approach', enterX: 0,
};

const HeroSection = () => {
  const levelRef = useRef(null);
  const marioRef = useRef(null);
  const rimRefs = useRef([]);
  const keys = useRef({});
  const state = useRef({ ...START });
  const layout = useRef({ w: 1200, pipes: [] });
  const frame = useRef(0);
  const lastT = useRef(0);
  const jumpHeld = useRef(false);
  const navigated = useRef(false);
  const inView = useRef(true);

  const [moving, setMoving] = useState(false);
  // he drops behind the pipes only while sinking into one, so it reads as
  // going *in* rather than sliding across the front
  const [behind, setBehind] = useState(false);

  // Pipe geometry in pixels. Recomputed on resize; the loop reads it by ref so
  // it never has to touch the DOM per frame.
  const measure = useCallback(() => {
    const level = levelRef.current;
    if (!level) return;
    const w = level.offsetWidth;
    const lvl = level.getBoundingClientRect();

    layout.current = {
      w,
      // Read each lid's real position rather than deriving it. The pipe is
      // centred by a negative margin of half the rim, which only actually
      // centres it while the rim is the widest thing in the column — a longer
      // label, or a different font metric, shifts the whole pipe off the mark.
      pipes: PIPES.map((p, i) => {
        const el = rimRefs.current[i];
        if (!el) {
          const cx = p.xPct * w;
          return { ...p, cx, left: cx - RIM_W / 2, right: cx + RIM_W / 2, top: p.h,
            tol: RIM_W * ENTER_FRACTION };
        }
        const r = el.getBoundingClientRect();
        const left = r.left - lvl.left;
        const right = r.right - lvl.left;
        return { ...p, cx: (left + right) / 2, left, right, top: p.h,
          tol: (right - left) * ENTER_FRACTION };
      }),
    };
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    // the pixel font loads after first paint and changes the label width, which
    // moves the rim we just measured
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // don't burn frames while the hero is scrolled away
  useEffect(() => {
    const el = levelRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; }, {
      threshold: 0.05,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const HANDLED = new Set([
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'a', 'A', 'd', 'D', 'w', 'W', ' ',
    ]);
    const down = (e) => {
      // only swallow the page's own scroll keys while the level is on screen
      if (inView.current && HANDLED.has(e.key)) e.preventDefault();
      keys.current[e.key] = true;
      // any manual input takes control back from a pipe click
      if (state.current.mode === 'auto' && HANDLED.has(e.key)) {
        state.current.mode = 'play';
        state.current.target = -1;
      }
    };
    const up = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const enterPipe = useCallback((index) => {
    const p = layout.current.pipes[index];
    state.current.mode = 'enter';
    state.current.target = index;
    state.current.enterX = p ? p.cx - MARIO_W / 2 : state.current.x;
    setBehind(true);
    sfx.pipe();
  }, []);

  useEffect(() => {
    const tick = (t) => {
      frame.current = requestAnimationFrame(tick);
      const dt = lastT.current ? clamp((t - lastT.current) / 1000, 0, 0.05) : 0;
      lastT.current = t;
      if (!dt) return;

      const s = state.current;
      const { w, pipes } = layout.current;

      // idle cheaply when off screen, unless mid pipe-entry
      if (!inView.current && s.mode === 'play') return;

      const draw = () => {
        if (marioRef.current) {
          marioRef.current.style.transform =
            `translate3d(${s.x}px, ${-(GROUND_H + s.y)}px, 0) scaleX(${s.facing})`;
        }
      };

      if (s.mode === 'enter') {
        // Slide onto the mouth while sinking, so he always goes down dead
        // centre even when he landed nearer the edge of the lid.
        const dx = s.enterX - s.x;
        const step = CENTRE_SPEED * dt;
        s.x += Math.abs(dx) <= step ? dx : Math.sign(dx) * step;
        s.y -= ENTER_SPEED * dt;
        if (s.y < -MARIO_H && !navigated.current) {
          navigated.current = true;
          scroller.scrollTo(PIPES[s.target].target, { smooth: true, duration: 800, offset: -90 });
          setTimeout(() => {
            state.current = { ...START };
            navigated.current = false;
            setBehind(false);
            setMoving(false);
          }, 1000);
        }
        draw();
        return;
      }

      const prevY = s.y;
      const onGround = s.y <= 0.01;

      let dir = 0;
      let speed = WALK_SPEED;

      if (s.mode === 'auto') {
        const p = pipes[s.target];
        speed = RUN_SPEED;
        if (p) {
          const dx = p.cx - (s.x + MARIO_W / 2);
          const dist = Math.abs(dx);
          const need = runway(p.h);

          if (s.phase === 'backoff') {
            // he was already too close to make the jump, so walk away first to
            // buy runway; the margin stops him dithering on the boundary
            dir = -Math.sign(dx) || -1;
            if (dist > need + 40 || s.x <= 2 || s.x >= w - MARIO_W - 2) s.phase = 'approach';
          } else {
            dir = Math.sign(dx);
            if (onGround && dist <= need + 6) {
              s.vy = JUMP_VEL;
              sfx.jump();
            }
          }
        }
      } else {
        if (keys.current.ArrowLeft || keys.current.a || keys.current.A) dir = -1;
        if (keys.current.ArrowRight || keys.current.d || keys.current.D) dir = 1;
        const wantJump = !!(
          keys.current.ArrowUp || keys.current.w || keys.current.W || keys.current[' ']
        );
        if (wantJump && !jumpHeld.current && onGround) {
          s.vy = JUMP_VEL;
          sfx.jump();
        }
        jumpHeld.current = wantJump;
      }

      if (dir) s.facing = dir;
      s.x = clamp(s.x + dir * speed * dt, 0, Math.max(0, w - MARIO_W));

      s.vy -= GRAVITY * dt;
      s.y += s.vy * dt;

      // Pipes are solid on the lid only. Nothing blocks him sideways, so he
      // walks in front of them and meets one by landing on it — which also
      // means he can never be trapped against the side of one.
      let restingPipe = -1;
      pipes.forEach((p, i) => {
        const overlaps = s.x + MARIO_W > p.left && s.x < p.right;
        if (!overlaps) return;
        if (s.vy <= 0 && prevY >= p.top && s.y <= p.top) {
          s.y = p.top;
          s.vy = 0;
          restingPipe = i;
        }
      });

      if (s.y <= 0) {
        s.y = 0;
        s.vy = 0;
      }

      // Only duck in once he is actually standing over the mouth. Landing on a
      // corner of the lid just leaves him standing there, free to walk to the
      // middle and drop in.
      if (restingPipe >= 0) {
        const p = pipes[restingPipe];
        if (Math.abs(s.x + MARIO_W / 2 - p.cx) <= p.tol) {
          enterPipe(restingPipe);
          return;
        }
      }

      draw();

      const isMoving = dir !== 0 || s.y > 0;
      setMoving((m) => (m === isMoving ? m : isMoving));
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [enterPipe]);

  const clickPipe = (i) => {
    const s = state.current;
    if (s.mode === 'enter') return;
    const p = layout.current.pipes[i];
    const dist = p ? Math.abs(p.cx - (s.x + MARIO_W / 2)) : 0;
    s.mode = 'auto';
    s.target = i;
    // already standing on or beside it? back up far enough to get a run at it
    s.phase = p && dist < runway(p.h) + 10 ? 'backoff' : 'approach';
  };

  const press = (key, isDown) => {
    keys.current[key] = isDown;
    if (isDown && state.current.mode === 'auto') {
      state.current.mode = 'play';
      state.current.target = -1;
    }
  };

  const touch = (key) => ({
    onPointerDown: (e) => { e.preventDefault(); press(key, true); },
    onPointerUp: (e) => { e.preventDefault(); press(key, false); },
    onPointerLeave: () => press(key, false),
    onPointerCancel: () => press(key, false),
  });

  return (
    <Level id="hero" ref={levelRef}>
      {CLOUDS.map((c) => (
        <Cloud
          key={c.top}
          $w={c.w}
          $top={c.top}
          style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
        />
      ))}

      {HILLS.map((h) => (
        <Hill key={h.xPct} $w={h.w} style={{ left: `${h.xPct * 100}%` }} />
      ))}
      {BUSHES.map((b) => (
        <Bush key={b.xPct} $w={b.w} style={{ left: `${b.xPct * 100}%` }} />
      ))}

      <TitleArea>
        <Title>HI! I&apos;M JASMEHAR</Title>
        <Subtitle>SOFTWARE ENGINEERING @ UWATERLOO</Subtitle>
        <br />
        <Hint>ARROWS OR WASD TO MOVE · UP TO JUMP · STAND ON A PIPE TO ENTER · OR CLICK ONE</Hint>
      </TitleArea>

      {PIPES.map((p, i) => (
        <PipeWrap
          key={p.target}
          style={{ left: `${p.xPct * 100}%` }}
          onClick={() => clickPipe(i)}
          aria-label={`Go to ${p.label.toLowerCase()}`}
        >
          <PipeLabel>{p.label}</PipeLabel>
          <PipeRim ref={(el) => { rimRefs.current[i] = el; }} />
          <PipeBody $h={p.h} />
        </PipeWrap>
      ))}

      <MarioBox ref={marioRef} aria-hidden="true" style={{ zIndex: behind ? 3 : 5 }}>
        <MarioSprite
          src={(moving ? SPRITES.run : SPRITES.idle).src}
          $frame={(moving ? SPRITES.run : SPRITES.idle).frame}
          $drop={(moving ? SPRITES.run : SPRITES.idle).drop}
          $nudge={(moving ? SPRITES.run : SPRITES.idle).nudge}
          alt=""
        />
      </MarioBox>

      <Touch>
        <TouchGroup>
          <TouchBtn {...touch('ArrowLeft')} aria-label="move left">&lt;</TouchBtn>
          <TouchBtn {...touch('ArrowRight')} aria-label="move right">&gt;</TouchBtn>
        </TouchGroup>
        <TouchGroup>
          <TouchBtn {...touch('ArrowUp')} aria-label="jump">A</TouchBtn>
        </TouchGroup>
      </Touch>

      <Ground />
    </Level>
  );
};

export default HeroSection;
