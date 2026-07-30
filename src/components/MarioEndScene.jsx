// MarioEndScene — the end of world 1-1.
//
// Mario runs in from the left, climbs the block staircase a step at a time,
// jumps across onto the flagpole, slides down with the flag, then walks along
// and into the castle door.
//
// The level is laid out in fixed pixels from a centred origin rather than in
// percentages. Percentages made the staircase-to-pole gap grow with the viewport
// (883px at 2560px wide), which turned the jump into a flat glide, and made the
// climb land him between steps. Everything below is measured off the tiles.
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import castleImg from '../assets/castle.png';
import webring from '../assets/webring.png';
import { overworld } from '../utils/overworldArt';
import { marioSprite } from '../utils/marioSprite';
import { NES } from '../utils/pixelSprite';

/* ───────────────────────────── level geometry ───────────────────────── */

const TILE = 40;
const GROUND_H = TILE * 2;
const STEPS = 8;
const CHAR_H = 76;
const CHAR_W = 52;

const STAIR_W = STEPS * TILE; // 320 — staircase starts at level x = 0
const STAIR_TOP = GROUND_H + STEPS * TILE; // 400

const POLE_GAP = 200; // staircase right edge to the pole's block
const POLE_CX = STAIR_W + POLE_GAP + TILE / 2; // 540
const POLE_BASE = GROUND_H + TILE; // stands on one block
const POLE_H = 400;
const POLE_TOP = POLE_BASE + POLE_H; // 520
const GRAB_Y = POLE_TOP - CHAR_H; // 444 — where he catches it

// castle.png is 144x176 with three openings; the middle one (the door) sits at
// x 63..79, y 143..176 — measured from the file, not guessed
const CASTLE_H = 440; // tall enough that the door clears Mario's 76px
const CASTLE_W = Math.round((CASTLE_H * 144) / 176); // 360
const CASTLE_X = POLE_CX + 260; // 800
const DOOR_CX = CASTLE_X + Math.round((71 / 144) * CASTLE_W); // 978

const JUMP_PEAK = POLE_TOP; // arc up to the top of the pole, then drop onto it
const LEVEL_W = CASTLE_X + CASTLE_W; // 1160
const SCENE_H = JUMP_PEAK + CHAR_H + 250; // room for the jump and the sign-off

const SPRITES = {
  idle: marioSprite('idle', CHAR_H),
  run: marioSprite('run', CHAR_H),
};

/* ─────────────────────────────── the run ────────────────────────────── */

const T = { runIn: 1500, climb: 1700, jump: 800, slide: 1400, runOut: 2100 };
const APPROACH_X = -300; // where the off-screen dash ends and the walk-in begins
// The approach is split so the walk-in has a fixed, sane speed whatever the
// viewport width. This is the invisible half — kept short so he shows up
// promptly rather than making you wait offstage.
const OFF_SCREEN_MS = 450;
const RUN_MS = T.runIn + T.climb + T.jump + T.slide + T.runOut;
const GRAB_MS = T.runIn + T.climb + T.jump; // he takes hold of the flag here
const LAND_MS = GRAB_MS + T.slide; // back on the ground here
const DOOR_W = Math.round((17 / 144) * CASTLE_W); // 43
const DOOR_R = DOOR_CX + Math.round(DOOR_W / 2); // right jamb of the doorway
const END_X = DOOR_R + CHAR_W; // far enough in to be fully behind the near wall

const at = (ms) => `${((ms / RUN_MS) * 100).toFixed(2)}%`;

const buildRun = () => {
  const rows = [
    // min() keeps the start off-screen at any width, however wide the viewport
    `0% { left: min(-${LEVEL_W}px, -60vw); bottom: ${GROUND_H}px; }`,
    `${at(OFF_SCREEN_MS)} { left: ${APPROACH_X}px; bottom: ${GROUND_H}px; }`,
    `${at(T.runIn)} { left: -34px; bottom: ${GROUND_H}px; }`,
  ];

  // One stop per block, centred on that step. Aiming at the step's right edge
  // instead is what left him half in the air and half in front of the stairs.
  for (let i = 1; i <= STEPS; i += 1) {
    rows.push(
      `${at(T.runIn + (T.climb * i) / STEPS)} ` +
        `{ left: ${i * TILE - TILE / 2}px; bottom: ${GROUND_H + i * TILE}px; }`
    );
  }

  const top = T.runIn + T.climb;
  // a real arc: up over 45% of the jump, then down onto the pole
  rows.push(`${at(top + T.jump * 0.45)} { left: ${STAIR_W + 100}px; bottom: ${JUMP_PEAK}px; }`);
  rows.push(`${at(GRAB_MS)} { left: ${POLE_CX}px; bottom: ${GRAB_Y}px; }`);
  rows.push(`${at(LAND_MS - T.slide * 0.12)} { left: ${POLE_CX}px; bottom: ${POLE_BASE}px; }`);
  rows.push(`${at(LAND_MS)} { left: ${POLE_CX}px; bottom: ${GROUND_H}px; }`);
  rows.push(`100% { left: ${END_X}px; bottom: ${GROUND_H}px; }`);

  return rows.join('\n  ');
};

const runLevel = keyframes`${buildRun()}`;

const flagDown = keyframes`
  from { bottom: ${POLE_TOP - 48}px; }
  to   { bottom: ${POLE_BASE + 6}px; }
`;

const drift = keyframes`
  from { transform: translateX(-220px); }
  to   { transform: translateX(calc(100vw + 220px)); }
`;

/* ───────────────────────────── the scene ────────────────────────────── */

const Scene = styled.section`
  position: relative;
  overflow: hidden;
  min-height: ${SCENE_H}px;
  background: ${NES.sky};
  font-family: 'Press Start 2P', cursive;
`;

/* The level sits at a fixed pixel width and scales as one piece on smaller
   screens. The bottom offset cancels the scale so its ground line still meets
   the full-width ground strip, which is deliberately left unscaled. */
const LevelBox = styled.div`
  --s: 1;
  position: absolute;
  left: 50%;
  bottom: calc(${GROUND_H}px * (1 - var(--s)));
  width: ${LEVEL_W}px;
  height: ${SCENE_H}px;
  margin-left: -${LEVEL_W / 2}px;
  transform: scale(var(--s));
  transform-origin: bottom center;

  @media (max-width: 1240px) { --s: 0.88; }
  @media (max-width: 1080px) { --s: 0.76; }
  @media (max-width: 900px) { --s: 0.62; }
  @media (max-width: 740px) { --s: 0.5; }
  @media (max-width: 560px) { --s: 0.38; }
  @media (max-width: 440px) { --s: 0.3; }
  @media (max-width: 360px) { --s: 0.26; }
`;

const Cloud = styled.div`
  position: absolute;
  top: ${({ $top }) => $top}px;
  width: ${({ $w }) => $w}px;
  height: ${({ $w }) => Math.round(($w * 10) / 32)}px;
  background-image: ${overworld.cloud};
  background-size: 100% 100%;
  image-rendering: pixelated;
  animation: ${drift} linear infinite;
  z-index: 1;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Ground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${GROUND_H}px;
  background-image: ${overworld.soil};
  background-size: ${TILE}px ${TILE}px;
  background-repeat: repeat;
  image-rendering: pixelated;
  z-index: 5;
`;

const Hill = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  left: ${STAIR_W + 30}px;
  width: 190px;
  height: 83px;
  background-image: ${overworld.hill};
  background-size: 100% 100%;
  image-rendering: pixelated;
  z-index: 1;
  pointer-events: none;
`;

const Stairs = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  left: 0;
  display: flex;
  align-items: flex-end;
  z-index: 3;
  pointer-events: none;
`;

const Step = styled.div`
  width: ${TILE}px;
  height: ${({ $n }) => $n * TILE}px;
  background-image: ${overworld.stair};
  background-size: ${TILE}px ${TILE}px;
  background-repeat: repeat;
  image-rendering: pixelated;
`;

/* ───────────────────────────── the flagpole ─────────────────────────── */

const PoleBase = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  left: ${POLE_CX - TILE / 2}px;
  width: ${TILE}px;
  height: ${TILE}px;
  background-image: ${overworld.stair};
  background-size: ${TILE}px ${TILE}px;
  image-rendering: pixelated;
  z-index: 3;
`;

const Pole = styled.div`
  position: absolute;
  bottom: ${POLE_BASE}px;
  left: ${POLE_CX - 4}px;
  width: 8px;
  height: ${POLE_H}px;
  background: ${NES.greenLight};
  box-shadow: inset -3px 0 0 ${NES.greenMid};
  z-index: 2;
`;

const PoleBall = styled.div`
  position: absolute;
  bottom: ${POLE_TOP - 6}px;
  left: ${POLE_CX - 11}px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${NES.greenMid};
  box-shadow: inset -4px -4px 0 ${NES.greenDark};
  z-index: 3;
`;

const Flag = styled.div`
  position: absolute;
  bottom: ${POLE_TOP - 48}px;
  left: ${POLE_CX + 4 - 54}px;
  width: 54px;
  height: 42px;
  background-image: ${overworld.flag};
  background-size: 100% 100%;
  image-rendering: pixelated;
  z-index: 2;
  animation: ${({ $go }) => ($go ? flagDown : 'none')} ${T.slide}ms ease-in
    ${GRAB_MS}ms forwards;
`;

const Castle = styled.img`
  position: absolute;
  bottom: ${GROUND_H}px;
  left: ${CASTLE_X}px;
  height: ${CASTLE_H}px;
  width: ${CASTLE_W}px;
  image-rendering: pixelated;
  z-index: 3;
  pointer-events: none;
`;

/* The same castle again, clipped to everything right of the door jamb and laid
   over Mario. He walks in front of the facade, so he is visible entering the dark
   doorway, and then this near wall swallows him — instead of him blinking out
   the moment he reached the castle's outer edge. */
const CastleNearWall = styled(Castle)`
  clip-path: inset(0 0 0 ${DOOR_R - CASTLE_X}px);
  z-index: 6;
`;

/* ─────────────────────────────── mario ──────────────────────────────── */

const MarioBox = styled.div`
  position: absolute;
  left: min(-${LEVEL_W}px, -60vw);
  bottom: ${GROUND_H}px;
  width: ${CHAR_W}px;
  height: ${CHAR_H}px;
  margin-left: -${CHAR_W / 2}px;
  z-index: 4;
  pointer-events: none;
  animation: ${({ $go }) => ($go ? runLevel : 'none')} ${RUN_MS}ms linear forwards;
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

/* ────────────────────────────── sign-off ────────────────────────────── */

const SignOff = styled.div`
  position: absolute;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  width: max-content;
  max-width: 90vw;
  text-align: center;
  color: ${NES.white};
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.4);
`;

const Thanks = styled.p`
  margin: 0;
  font-size: 0.62rem;
  line-height: 2.1;

  @media (max-width: 768px) {
    font-size: 0.48rem;
  }
`;

const IconRow = styled.div`
  margin-top: 1.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;

const IconLink = styled.a`
  color: ${NES.white};
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding-bottom: 0.2rem;
  border-bottom: 3px solid transparent;
  transition: border-color 0.15s ease;

  &:hover {
    color: ${NES.white};
    border-bottom-color: ${NES.white};
  }
`;

const CLOUDS = [
  { top: 150, w: 170, dur: 105, delay: 0 },
  { top: 254, w: 130, dur: 78, delay: -40 },
];

const MarioEndScene = () => {
  const sceneRef = useRef(null);
  const [go, setGo] = useState(false);
  const [phase, setPhase] = useState('run');

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setGo(entry.isIntersecting), // replays whenever it returns
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // The pose has to change on the beat, so these mirror the keyframe timings:
  // he grips the pole through the jump and slide, and runs everything else.
  useEffect(() => {
    if (!go) {
      setPhase('run');
      return undefined;
    }
    setPhase('run');
    const timers = [
      setTimeout(() => setPhase('hold'), T.runIn + T.climb),
      setTimeout(() => setPhase('run'), LAND_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [go]);

  const sprite = phase === 'hold' ? SPRITES.idle : SPRITES.run;

  return (
    <Scene ref={sceneRef} id="end">
      {CLOUDS.map((c) => (
        <Cloud
          key={c.top}
          $top={c.top}
          $w={c.w}
          style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
        />
      ))}

      <SignOff>
        <Thanks>
          THANKS FOR PLAYING THROUGH MY PORTFOLIO
          <br />
          REACH ME AT JASMEHAR.KR@GMAIL.COM
        </Thanks>
        <IconRow>
          <IconLink
            href="/Jasmehar-Kaur-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume"
            title="Resume"
          >
            <FontAwesomeIcon icon={faFileAlt} />
          </IconLink>
          <IconLink
            href="https://github.com/jasmehar-k"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} />
          </IconLink>
          <IconLink
            href="https://linkedin.com/in/jasmehar-kaur"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </IconLink>
          <IconLink
            href="https://se-webring.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SE Webring"
            title="SE Webring"
          >
            <img src={webring} alt="" style={{ width: '22px', height: 'auto' }} />
          </IconLink>
        </IconRow>
      </SignOff>

      <LevelBox>
        <Hill />

        <Stairs>
          {Array.from({ length: STEPS }, (_, i) => (
            <Step key={i} $n={i + 1} />
          ))}
        </Stairs>

        <PoleBase />
        <Pole />
        <PoleBall />
        <Flag $go={go} />

        <Castle src={castleImg} alt="Castle" />

        <MarioBox $go={go}>
          <MarioSprite
            src={sprite.src}
            $frame={sprite.frame}
            $drop={sprite.drop}
            $nudge={sprite.nudge}
            alt=""
          />
        </MarioBox>

        <CastleNearWall src={castleImg} alt="" aria-hidden="true" />
      </LevelBox>

      <Ground />
    </Scene>
  );
};

export default MarioEndScene;
