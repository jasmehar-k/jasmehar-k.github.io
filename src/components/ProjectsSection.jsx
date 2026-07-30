// ProjectsSection — world 2-2, a side-scrolling underwater level.
//
// The section is laid out taller than the viewport and pins a viewport-sized
// stage inside it, so scrolling DOWN pans the camera RIGHT through the level.
// Mario holds a fixed spot on screen and the world slides past him, exactly
// like the NES camera. Project cards sit on mossy platforms spread along the
// level in a zig-zag, surfacing from the right as the camera advances.
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-scroll';
import { FaAward, FaGithub } from 'react-icons/fa';
import { Icon } from '@iconify/react';

import useScrollProgress from '../hooks/useScrollProgress';
import { buildSwimPath, swimPathAt } from '../utils/swimPath';
import { art, NES } from '../utils/waterArt';

import marioSwim from '../assets/mario_slide.png';

import recipeFinder from '../assets/recipe_finder.png';
import intersection from '../assets/intersection.png';
import foot_print from '../assets/foot_print.png';
import braillinator from '../assets/braillinator.png';
import portfolio from '../assets/portfolio.png';
import prediction from '../assets/prediction.png';
import iclick from '../assets/iclick.jpg';
import breadboard from '../assets/breadboard.png';
import visionCAD from '../assets/visionCAD.png';
import dill_pkl from '../assets/dill_pkl.png';
import pelican from '../assets/pelican.png';
import handShakeImg from '../assets/hand_shake.png';

/* ───────────────────────────── level geometry ───────────────────────── */

const SKY_H = 90;        // sky strip above the waterline
const CREST_H = 24;      // sawtooth waterline
const WATER_TOP = SKY_H + CREST_H;
const FLOOR_H = 96;      // seabed thickness
const MARIO_X = 0.26;    // mario's fixed screen position, as a fraction of width
const SWIM_CLEAR = 52;   // gap mario keeps between himself and any obstacle
const PIPE_MOUTH_H = 140;

// Each card's vertical offset from the stage centre. Landscape cards are short,
// so there is room for a wide zig-zag; mario routes around whatever this places.
const ZIG = [-120, 130, -60, 150, -150, 80];
const zigOf = (i) => ZIG[i % ZIG.length];

const readVar = (el, name) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

const swimOpts = (obstacles, trackW, vw, vh, slot, outro) => {
  const bot = vh - FLOOR_H;
  // back the clearance off when the tallest card leaves only a thin lane of
  // water, so a route always exists on short screens
  const tallest = obstacles.reduce((m, o) => Math.max(m, o.bottom - o.top), 0);
  const lane = (bot - WATER_TOP - tallest) / 2;

  return {
    x0: MARIO_X * vw,
    x1: trackW - (1 - MARIO_X) * vw,
    top: WATER_TOP,
    bot,
    clear: clamp(lane - 10, 18, SWIM_CLEAR),
    startY: WATER_TOP + 40,
    endY: bot - PIPE_MOUTH_H / 2,
    // Blur span, as a fraction of card spacing. Wider reads smoother but
    // overshoots further when rounding, so it has to scale with how much open
    // water there is to overshoot into. 0.22 is the most a roomy screen takes
    // before the curve starts cutting through cards.
    smoothPx: slot * clamp(lane / 1200, 0.08, 0.22),
    // level off well before the pipe so the approach is a flat horizontal swim.
    // The blur and the end ramp both eat into this, so it is set generously.
    endHoldPx: outro * 0.85,
  };
};

/* ───────────────────────────── animations ───────────────────────────── */

const riseUp = keyframes`
  0%   { transform: translateY(0) scale(0.7); opacity: 0; }
  15%  { opacity: 0.6; }
  85%  { opacity: 0.45; }
  100% { transform: translateY(-70vh) scale(1); opacity: 0; }
`;

const trailRise = keyframes`
  0%   { transform: translate(0, 0) scale(0.5); opacity: 0.75; }
  100% { transform: translate(-54px, -30px) scale(1); opacity: 0; }
`;

const bobFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
`;

const swayCoral = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50%      { transform: rotate(3deg); }
`;

const hintPulse = keyframes`
  0%, 100% { opacity: 0.55; transform: translateY(0); }
  50%      { opacity: 1; transform: translateY(5px); }
`;

/* ─────────────────────────── section + stage ────────────────────────── */

const Section = styled.section`
  /* slots are much wider than the cards on purpose: mario needs horizontal room
     to climb between a high card and the next low one without darting */
  --slot: 1220px;
  --lead: 900px;   /* open water before the first card, holds the level title */
  --outro: 1500px; /* open water after the last card, before the exit pipe */
  --pace: 0.48;
  --count: 12;

  /* The camera stops panning at p=1, so mario can only ever reach a point
     (1 - MARIO_X) * 100vw short of the track's right edge. The exit pipe has to
     sit exactly there, which means the tail has to scale with the viewport. */
  --exit: calc(var(--lead) + var(--count) * var(--slot) + var(--outro));
  --tail: calc(74vw + var(--outro));
  --track: calc(var(--lead) + var(--count) * var(--slot) + var(--tail));
  --pan: min(0px, calc(100vw - var(--track)));
  --p: 0;

  position: relative;
  height: max(100vh, calc(100vh + (var(--track) - 100vw) * var(--pace)));
  font-family: 'Press Start 2P', cursive;

  @media (max-width: 900px) {
    --slot: 600px;
    --lead: 340px;
    --outro: 700px;
    --pace: 0.72;
  }
`;

const Stage = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: ${NES.water};
`;

const Sky = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${SKY_H}px;
  background: ${NES.sky};
  z-index: 1;
`;

const Waterline = styled.div`
  position: absolute;
  top: ${SKY_H}px;
  left: 0;
  right: 0;
  height: ${CREST_H}px;
  background-image: ${art.waterline};
  background-size: ${CREST_H}px ${CREST_H}px;
  background-repeat: repeat-x;
  background-position-x: calc(var(--p) * var(--pan));
  image-rendering: pixelated;
  z-index: 2;
`;

const Seabed = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${FLOOR_H}px;
  background-color: ${NES.mossDark};
  background-image: ${art.moss};
  background-size: 48px 48px;
  background-repeat: repeat;
  background-position-x: calc(var(--p) * var(--pan));
  image-rendering: pixelated;
  z-index: 5;
`;

/* every level layer pans off the same progress value; depth scales the rate */
const Layer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--track);
  transform: translate3d(calc(var(--p) * var(--pan) * ${({ $depth }) => $depth}), 0, 0);
  will-change: transform;
`;

const BackLayer = styled(Layer)`
  z-index: 1;
  pointer-events: none;
`;

const Track = styled(Layer)`
  z-index: 4;
`;

/* pans with the level like the track, but sits above mario so he disappears
   into the pipe mouth at the end rather than swimming across its face.
   Transparent to input, or it would swallow every click on the cards beneath. */
const FrontLayer = styled(Layer)`
  z-index: 7;
  pointer-events: none;
`;

/* ──────────────────────────── level scenery ─────────────────────────── */

const Column = styled.div`
  position: absolute;
  bottom: ${FLOOR_H}px;
  width: 96px;
  background-image: ${art.moss};
  background-size: 48px 48px;
  background-repeat: repeat;
  image-rendering: pixelated;
`;

const Coral = styled.div`
  position: absolute;
  background-image: ${art.coral};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  image-rendering: pixelated;
  transform-origin: bottom center;
  animation: ${swayCoral} ${({ $dur }) => $dur}s ease-in-out infinite;
  pointer-events: none;
`;

const Blooper = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  background-image: ${art.blooper};
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  animation: ${bobFloat} ${({ $dur }) => $dur}s ease-in-out infinite;
  pointer-events: none;
`;

const Cheep = styled.div`
  position: absolute;
  width: 56px;
  height: 46px;
  background-image: ${art.cheep};
  background-size: contain;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  transform: scaleX(-1);
  animation: ${bobFloat} ${({ $dur }) => $dur}s ease-in-out infinite;
  pointer-events: none;
`;

const Bubble = styled.span`
  position: absolute;
  bottom: ${FLOOR_H}px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.55);
  animation: ${riseUp} ${({ $dur }) => $dur}s linear ${({ $delay }) => $delay}s infinite;
  pointer-events: none;
`;

/* Level title, standing in the open water of the lead-in where mario dives.
   Part of the track, so it pans away with the level like everything else. */
const LevelTitle = styled.div`
  position: absolute;
  top: ${WATER_TOP}px;
  bottom: ${FLOOR_H}px;
  left: 0;
  width: var(--lead);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  text-align: center;
  pointer-events: none;
`;

const TitleText = styled.h2`
  margin: 0;
  font-size: clamp(1.1rem, 2.6vw, 2.3rem);
  line-height: 1.5;
  color: #ffffff;
  text-shadow: 5px 5px 0 rgba(0, 0, 0, 0.4);
`;

const TitleSub = styled.p`
  margin: 0;
  font-size: 0.5rem;
  line-height: 2.1;
  color: #cfe8ff;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.4);
`;

/* ──────────────────────────── card platforms ────────────────────────── */

const Slot = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--slot);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SlotInner = styled.div`
  transform: translateY(${({ $zig }) => $zig}px);
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-height: 820px) {
    transform: translateY(${({ $zig }) => Math.round($zig * 0.4)}px);
  }

  /* phone cards stack image over text and get tall enough to fill the water
     column, so there is no room left to zig-zag; mario tracks a flat lane */
  @media (max-width: 900px) {
    transform: none;
  }
`;

const Platform = styled.div`
  width: 712px;
  height: 32px;
  margin-top: 10px;
  background-image: ${art.moss};
  background-size: 32px 32px;
  background-repeat: repeat-x;
  image-rendering: pixelated;

  @media (max-width: 900px) {
    width: 348px;
  }
`;

/* Landscape card: title bar across the top, then image beside the text. Keeps
   the cards short so mario has room to route above and below them. */
const ProjectCard = styled.div`
  position: relative;
  width: 680px;
  background-color: #fff;
  border: 4px solid #2f2f2f;
  box-shadow: 8px 8px 0 #2f2f2f;

  @media (max-width: 900px) {
    width: 320px;
  }
`;

/* centred, with equal padding both sides: the award badge sits off the top-left
   corner and the links off the top-right, so the text has to clear both */
const ProjectName = styled.h3`
  margin: 0;
  padding: 0.75rem 3.4rem;
  font-size: 0.78rem;
  line-height: 1.6;
  text-align: center;
  color: #2f2f2f;
  background-color: #ffd700;
  border-bottom: 4px solid #2f2f2f;

  @media (max-width: 900px) {
    font-size: 0.6rem;
    padding: 0.7rem 2.6rem;
  }
`;

const CardRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0.7rem;
    padding: 0.8rem;
  }
`;

/* No fixed height and no object-fit: the image keeps its own aspect ratio and
   the bordered box wraps it exactly, so there is never a letterbox gap. */
const CardMedia = styled.div`
  flex: 0 0 288px;
  align-self: flex-start;
  line-height: 0;
  border: 3px solid #2f2f2f;

  img {
    display: block;
    width: 100%;
    height: auto;
    image-rendering: pixelated;
  }

  /* shorter cards on short screens, so a lane of open water survives above and
     below them and mario can still be routed around rather than confined */
  @media (max-height: 820px) {
    flex: 0 0 224px;
  }

  @media (max-width: 900px) {
    flex: none;
    align-self: stretch;
  }
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.32rem;
  margin-bottom: 0.6rem;
`;

const SkillTag = styled.span`
  background-color: #ffcc00;
  color: #000;
  padding: 0.28rem 0.42rem;
  font-size: 0.48rem;
  border: 2px solid #2f2f2f;

  @media (max-width: 900px) {
    font-size: 0.42rem;
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.56rem;
  line-height: 1.95;
  color: #2f2f2f;

  @media (max-width: 900px) {
    font-size: 0.46rem;
  }
`;

const LinkIcons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 0.5rem;
  z-index: 1;
`;

const ProjectLinkIcon = styled.a`
  color: #1f1f1f;
  font-size: 0.95rem;
  filter: drop-shadow(1px 1px 0 rgba(47, 47, 47, 0.35));
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const AwardBadge = styled.div`
  position: absolute;
  top: -12px;
  left: -12px;
  z-index: 2;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 999px;
  background-color: #ffd34d;
  border: 3px solid #2f2f2f;
  box-shadow: 3px 3px 0 #2f2f2f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a5a00;
  font-size: 1rem;

  &:hover span {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const AwardTooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 0.85rem);
  left: -0.25rem;
  min-width: 150px;
  max-width: 220px;
  padding: 0.55rem 0.7rem;
  background-color: #ffffff;
  color: #2f2f2f;
  border: 2px solid #2f2f2f;
  border-radius: 18px;
  box-shadow: 4px 4px 0 #2f2f2f;
  font-size: 0.45rem;
  line-height: 1.4;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
`;

/* ─────────────────────────────── mario ──────────────────────────────── */

const Mario = styled.div`
  position: absolute;
  top: 0;
  left: ${MARIO_X * 100}%;
  width: 0;
  height: 0;
  z-index: 6;
  pointer-events: none;
  will-change: transform;
`;

/* square box so the 90deg rotation stays centred on mario's position */
const SpriteWrap = styled.div`
  position: absolute;
  left: -39px;
  top: -39px;
  width: 78px;
  height: 78px;
  transition: transform 0.35s ease;
`;

/* the standing sprite tipped onto its side reads as a swimmer: head leads to
   the right, legs trail behind. Short of a full 90deg so he still angles into
   the swim rather than lying flat */
const Sprite = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  transform: rotate(70deg);
`;

const TrailBubble = styled.span`
  position: absolute;
  left: 2px;
  top: 46px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.65);
  animation: ${trailRise} ${({ $dur }) => $dur}s linear ${({ $delay }) => $delay}s infinite;
  animation-play-state: ${({ $on }) => ($on ? 'running' : 'paused')};
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ScrollHint = styled.div`
  position: absolute;
  left: 50%;
  bottom: ${FLOOR_H + 24}px;
  transform: translateX(-50%);
  z-index: 8;
  color: #fcfcfc;
  font-size: 0.5rem;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.65);
  animation: ${hintPulse} 2s ease-in-out infinite;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.4s ease;
  pointer-events: none;
  white-space: nowrap;
`;

/* ──────────────────────────── exit warp pipe ────────────────────────── */

/* re-enables input inside the otherwise click-through front layer */
const PipeExit = styled(Link)`
  position: absolute;
  bottom: ${FLOOR_H}px;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  text-decoration: none;
  pointer-events: auto;
`;

const PipeMouth = styled.span`
  width: 44px;
  height: ${PIPE_MOUTH_H}px;
  background: linear-gradient(180deg, ${NES.pipeMid} 0 12px, ${NES.pipeLight} 12px 26px, ${NES.pipeMid} 26px 100%);
  border: 4px solid ${NES.pipeDark};
`;

const PipeBody = styled.span`
  width: 104px;
  height: 104px;
  background: linear-gradient(180deg, ${NES.pipeMid} 0 10px, ${NES.pipeLight} 10px 22px, ${NES.pipeMid} 22px 100%);
  border: 4px solid ${NES.pipeDark};
  border-left: none;
`;

const PipeLabel = styled.span`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.6rem);
  transform: translateX(-50%);
  padding: 0.4rem 0.55rem;
  background-color: #ffcc00;
  color: #000;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  font-size: 0.45rem;
  white-space: nowrap;
  transition: transform 0.2s ease;

  ${PipeExit}:hover & {
    transform: translateX(-50%) translateY(-4px);
    background-color: #ffe066;
  }
`;

/* ───────────────────── reduced-motion vertical fallback ─────────────── */

const PlainSection = styled.section`
  background-color: ${NES.water};
  padding: 4rem 2rem;
  font-family: 'Press Start 2P', cursive;
`;

const PlainTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  color: #fff;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
  margin-bottom: 3rem;
`;

const PlainGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
`;

/* ──────────────────────────────── content ───────────────────────────── */

const PROJECTS = [
  {
    name: 'hand.shake',
    image: handShakeImg,
    alt: 'hand.shake grip-assist glove holding a water bottle',
    tags: ['Python', 'Raspberry Pi 5', 'Computer Vision', 'OpenRouter', 'QNX', 'Tendon Actuation'],
    description:
      "Wearable grip-assist glove that identifies an object through an onboard camera and vision model, then drives a tendon-actuated finger toward a matched force target, boosting the user's grip. Live force and grip telemetry stream to a HUD dashboard.",
    github: 'https://github.com/jasmehar-k/hand.shake',
    devpost: 'https://devpost.com/software/hand-shake-wg3x9y',
  },
  {
    name: 'Pelican',
    image: pelican,
    tags: ['Python', 'LangGraph', 'Polars', 'DuckDB', 'FastAPI', 'React', 'CVXPy'],
    description:
      'Autonomous factor research platform where LLM agents search arXiv, generate alpha signal code, and run point-in-time backtests, accepting signals with IC t-stat ≥ 1.5. Accepted signals feed a CVXPy mean-variance portfolio optimizer with an Almgren-Chriss transaction cost model.',
    github: 'https://github.com/jasmehar-k/pelican',
  },
  {
    name: 'dill.pkl',
    image: dill_pkl,
    tags: ['Optuna', 'FastAPI', 'Python', 'TypeScript'],
    description:
      'Agentic web app that automates the full ML pipeline (data analysis, preprocessing, feature engineering, model selection, training, and evaluation) and outputs a deployable model.',
    github: 'https://github.com/jasmehar-k/dill.pkl',
    devpost: 'https://devpost.com/software/dill-pkl',
    award: 'Best Production-Ready AI Tool at GenAI Genesis 2026',
  },
  {
    name: 'Braillinator',
    image: braillinator,
    tags: ['Python', 'PyTorch', 'U-Net', 'OCR', 'Raspberry Pi', 'React Native'],
    description:
      'Real-time text-to-Braille system using a React Native app and Raspberry Pi that converts phone camera images into tactile Braille output, with a conditional U-Net that sharpens degraded photos before Tesseract OCR to reduce miss rates by up to 46%.',
    github: 'https://github.com/jasmehar-k/braillinator',
  },
  {
    name: 'iClick',
    image: iclick,
    tags: ['Gradient Boosting Regression', 'Supervised Learning', 'Computer Vision', 'Latency Optimization'],
    description:
      'System that enables hands-free computer control using precise cursor control through eye tracking, gesture recognition, and streaming speech-to-text.',
    github: 'https://github.com/jasmehar-k/iClick',
    devpost: 'https://devpost.com/software/iclick-4rynjv',
  },
  {
    name: 'VisionCAD',
    image: visionCAD,
    tags: ['FastAPI', 'CADQuery', 'Python', 'Vue.js'],
    description:
      'Converts hand-drawn sketches into 3D CAD models by analyzing uploaded images with an LLM, extracting geometry, and generating a downloadable STEP file openable in SolidWorks or Onshape.',
    github: 'https://github.com/jasmehar-k/VisionCAD',
    devpost: 'https://devpost.com/software/visioncad',
    award: '2nd Place at EngHacks 2026',
  },
  {
    name: 'BREAD.board',
    image: breadboard,
    tags: ['FastAPI', 'LiveKit', 'WebSockets', 'OpenAI', 'Computer Vision'],
    description:
      'Real-time circuit-building assistant that streams live video to analyze breadboard assembly, interpret schematics, and deliver step-by-step guidance and answer user questions.',
    github: 'https://github.com/jasmehar-k/BREAD.board',
    devpost: 'https://devpost.com/software/circuit-build',
  },
  {
    name: 'FOOT.print',
    image: foot_print,
    tags: ['Python', 'Gemini', 'Twelve Labs', 'YOLOv8', 'Blender'],
    description:
      'AI pipeline that processes a video of a room to extract object positions, estimates depth and dimensions, and generates a validated, feng shui–optimized 3D room layout rendered in Blender.',
    devpost: 'https://devpost.com/software/foot-print',
  },
  {
    name: 'Breast Cancer Prediction Model',
    image: prediction,
    alt: 'Prediction Model',
    tags: ['Python', 'PyTorch', 'Machine Learning', 'Neural Networks'],
    description:
      'Neural network built in PyTorch classified breast cancer tumors with 96% accuracy, optimized using binary cross-entropy loss and the Adam optimizer.',
    github: 'https://github.com/jasmehar-k/breast-cancer-prediction',
  },
  {
    name: 'Road Traffic Simulation',
    image: intersection,
    alt: 'Traffic Simulation',
    tags: ['Java', 'OOP', 'Multi-threading', 'AWT Graphics'],
    description:
      'Multi-threaded simulator for a 4-way intersection, optimizing traffic light durations with realistic driver behaviors modeled from real-world data.',
    github: 'https://github.com/jasmehar-k/traffic-simulation',
  },
  {
    name: 'Recipe Finder',
    image: recipeFinder,
    tags: ['Python', 'Web Scraping', 'webbrowser', 'googlesearch', 'Beautiful-Soup'],
    description:
      'Web app that finds recipes based on user input by scraping and filtering online sources for relevant ingredient and instruction data.',
    devpost: 'https://devpost.com/software/recipe-finder-xed0oz',
  },
  {
    name: 'Portfolio Website (this site!)',
    image: portfolio,
    alt: 'Portfolio',
    tags: ['React.js', 'styled-components', 'Web Design', 'Framer Motion'],
    description:
      'Portfolio featuring intuitive section navigation and fully responsive layouts, ensuring a consistent user experience across all devices.',
    github: 'https://github.com/jasmehar-k/jasmehar-k.github.io',
  },
];

// Moss columns live in the empty margin at the left of a slot, never behind a
// card, so they add level structure without ever boxing mario in against one.
const COLUMNS = [
  { slot: 0, h: 144 },
  { slot: 2, h: 96 },
  { slot: 3, h: 192 },
  { slot: 5, h: 120 },
  { slot: 6, h: 168 },
  { slot: 8, h: 96 },
  { slot: 9, h: 144 },
  { slot: 11, h: 120 },
];

const CORALS = [
  { at: 0.09, w: 60, h: 110, dur: 5.2 },
  { at: 0.22, w: 44, h: 84, dur: 6.1 },
  { at: 0.37, w: 70, h: 130, dur: 4.6 },
  { at: 0.52, w: 50, h: 96, dur: 5.8 },
  { at: 0.66, w: 64, h: 118, dur: 5.0 },
  { at: 0.79, w: 46, h: 88, dur: 6.4 },
  { at: 0.92, w: 68, h: 124, dur: 4.9 },
];

const BLOOPERS = [
  { at: 0.18, top: '30%', dur: 4.2 },
  { at: 0.49, top: '24%', dur: 5.1 },
  { at: 0.81, top: '34%', dur: 4.7 },
];

const CHEEPS = [
  { at: 0.11, top: '58%', dur: 3.6 },
  { at: 0.34, top: '68%', dur: 4.4 },
  { at: 0.63, top: '54%', dur: 3.9 },
  { at: 0.88, top: '64%', dur: 4.8 },
];

// two drifts of bubbles at different depths, offset from each other so the
// water never looks like it is rising in a single sheet
const bubbleField = (count, seed) =>
  Array.from({ length: count }, (_, i) => ({
    at: (i + seed) / count,
    size: 6 + ((i * 7 + seed * 5) % 15),
    dur: 10 + ((i * 3 + seed) % 12),
    delay: (i * 1.7 + seed * 2.3) % 13,
  }));

const BUBBLES_BACK = bubbleField(42, 0.5);
const BUBBLES_FRONT = bubbleField(24, 0.18);

const TRAIL = [
  { size: 8, dur: 1.1, delay: 0 },
  { size: 6, dur: 1.4, delay: 0.35 },
  { size: 5, dur: 1.7, delay: 0.7 },
];

// memoised: the level re-renders as the HUD ticks, but card content never changes
const CardFace = React.memo(({ project }) => (
  <>
    {project.award && (
      <AwardBadge aria-label={`${project.name} award`}>
        <FaAward />
        <AwardTooltip>{project.award}</AwardTooltip>
      </AwardBadge>
    )}
    <LinkIcons>
      {project.github && (
        <ProjectLinkIcon
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} GitHub repository`}
        >
          <FaGithub />
        </ProjectLinkIcon>
      )}
      {project.devpost && (
        <ProjectLinkIcon
          href={project.devpost}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} Devpost page`}
        >
          <Icon icon="simple-icons:devpost" />
        </ProjectLinkIcon>
      )}
    </LinkIcons>
    <ProjectName>{project.name}</ProjectName>
    <CardRow>
      <CardMedia>
        <img src={project.image} alt={project.alt || project.name} loading="lazy" />
      </CardMedia>
      <CardBody>
        <SkillTags>
          {project.tags.map((tag) => (
            <SkillTag key={tag}>{tag}</SkillTag>
          ))}
        </SkillTags>
        <Description>{project.description}</Description>
      </CardBody>
    </CardRow>
  </>
));
CardFace.displayName = 'CardFace';

const ProjectsSection = () => {
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const marioRef = useRef(null);
  const slotRefs = useRef([]);
  const columnRefs = useRef([]);
  const moveTimer = useRef(null);

  // level obstacles in track coordinates, and the swim path derived from them
  const obstaclesRef = useRef([]);
  const pathRef = useRef([]);
  const pathKeyRef = useRef('');

  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState(1);
  const [started, setStarted] = useState(false);

  // Reduced motion opts out of the pinned level; so does a viewport too short to
  // fit a card between the waterline and the seabed (landscape phones, stubby
  // windows), where there would be no lane for mario to swim through at all.
  const query = '(prefers-reduced-motion: reduce), (max-height: 700px)';
  const [plain, setPlain] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches
  );

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = (e) => setPlain(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  // Measure what mario has to swim around. Cards are absolutely positioned in
  // the track, so their box relative to the track/stage is pan-independent and
  // only needs re-reading when the layout or image sizes change.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const sr = stage.getBoundingClientRect();
    const tr = track.getBoundingClientRect();
    const list = [];

    // measured on the slot wrapper, not the card: the card carries a reveal
    // transform that would skew the box, and the wrapper covers the platform too
    slotRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      list.push({
        x: r.left - tr.left + r.width / 2,
        half: r.width / 2,
        top: r.top - sr.top,
        bottom: r.bottom - sr.top,
      });
    });

    columnRefs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      list.push({
        x: r.left - tr.left + r.width / 2,
        half: r.width / 2,
        top: r.top - sr.top,
        bottom: sr.height,
      });
    });

    list.sort((a, b) => a.x - b.x);
    obstaclesRef.current = list;
    pathKeyRef.current = '';
  }, []);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (track && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(track);
      window.addEventListener('resize', measure);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', measure);
      };
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const onProgress = useCallback(
    (p, { el: section, delta, vw, vh, visible }) => {
      const track = trackRef.current;
      if (!section || !track) return;

      section.style.setProperty('--p', p);
      if (!visible) return;

      const trackW = track.getBoundingClientRect().width;
      const pan = Math.max(0, trackW - vw);
      const slot = readVar(section, '--slot');
      const outro = readVar(section, '--outro');

      // where mario is in the level's own coordinate space
      const worldX = p * pan + MARIO_X * vw;

      // Rebuild the route only when the level's dimensions actually change.
      const key = `${trackW}|${vw}|${vh}|${obstaclesRef.current.length}`;
      if (pathKeyRef.current !== key) {
        const obs = obstaclesRef.current;
        pathRef.current = buildSwimPath(obs, swimOpts(obs, trackW, vw, vh, slot, outro));
        pathKeyRef.current = key;
      }

      const y = swimPathAt(pathRef.current, worldX);
      const bob = Math.sin(worldX / 120) * 6;

      if (marioRef.current) {
        marioRef.current.style.transform = `translate3d(0, ${y + bob}px, 0)`;
      }

      if (Math.abs(delta) > 0.00002) {
        const dir = delta >= 0 ? 1 : -1;
        setFacing((f) => (f === dir ? f : dir));
      }

      setStarted((s) => s || p > 0.04);

      setMoving(true);
      clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => setMoving(false), 220);
    },
    []
  );

  const { sectionRef } = useScrollProgress(plain ? () => {} : onProgress);

  useEffect(() => () => clearTimeout(moveTimer.current), []);

  if (plain) {
    return (
      <PlainSection id="projects">
        <PlainTitle>Projects</PlainTitle>
        <PlainGrid>
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name}>
              <CardFace project={project} />
            </ProjectCard>
          ))}
        </PlainGrid>
      </PlainSection>
    );
  }

  return (
    <Section id="projects" ref={sectionRef}>
      <Stage ref={stageRef}>
        <Sky />
        <Waterline />

        <BackLayer $depth={0.8}>
          {BUBBLES_BACK.map((b) => (
            <Bubble
              key={b.at}
              style={{ left: `${b.at * 100}%` }}
              $size={b.size}
              $dur={b.dur}
              $delay={b.delay}
            />
          ))}
        </BackLayer>

        <Track ref={trackRef} $depth={1}>
          <LevelTitle>
            <TitleText>PROJECTS</TitleText>
            <TitleSub>12 BUILDS · SWIM RIGHT TO EXPLORE</TitleSub>
          </LevelTitle>

          {COLUMNS.map((c, i) => (
            <Column
              key={c.slot}
              ref={(el) => {
                columnRefs.current[i] = el;
              }}
              style={{
                left: `calc(var(--lead) + ${c.slot} * var(--slot) + 12px)`,
                height: `${c.h}px`,
              }}
            />
          ))}
          {CORALS.map((c) => (
            <Coral
              key={c.at}
              style={{
                left: `${c.at * 100}%`,
                bottom: `${FLOOR_H}px`,
                width: `${c.w}px`,
                height: `${c.h}px`,
              }}
              $dur={c.dur}
            />
          ))}
          {BLOOPERS.map((b) => (
            <Blooper key={b.at} style={{ left: `${b.at * 100}%`, top: b.top }} $dur={b.dur} />
          ))}
          {CHEEPS.map((c) => (
            <Cheep key={c.at} style={{ left: `${c.at * 100}%`, top: c.top }} $dur={c.dur} />
          ))}

          {PROJECTS.map((project, i) => (
            <Slot
              key={project.name}
              style={{ left: `calc(var(--lead) + ${i} * var(--slot))` }}
            >
              <SlotInner
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                $zig={zigOf(i)}
              >
                <ProjectCard>
                  <CardFace project={project} />
                </ProjectCard>
                <Platform />
              </SlotInner>
            </Slot>
          ))}

        </Track>

        <Seabed />

        <Mario ref={marioRef} aria-hidden="true">
          <SpriteWrap style={{ transform: `scaleX(${facing})` }}>
            <Sprite src={marioSwim} alt="" />
            {TRAIL.map((t) => (
              <TrailBubble key={t.delay} $size={t.size} $dur={t.dur} $delay={t.delay} $on={moving} />
            ))}
          </SpriteWrap>
        </Mario>

        <FrontLayer $depth={1.12}>
          {BUBBLES_FRONT.map((b) => (
            <Bubble
              key={b.at}
              style={{ left: `${b.at * 100}%`, opacity: 0.75 }}
              $size={b.size}
              $dur={b.dur}
              $delay={b.delay}
            />
          ))}
        </FrontLayer>

        <FrontLayer $depth={1}>
          <PipeExit
            to="skills"
            smooth
            duration={700}
            offset={-90}
            /* mario's travel ends at --exit, so pulling the pipe left of that
               carries him past the mouth and down into the body */
            style={{ left: 'calc(var(--exit) - 88px)' }}
            aria-label="Exit the water level and go to skills"
          >
            <PipeLabel>SKILLS &gt;&gt;</PipeLabel>
            <PipeMouth />
            <PipeBody />
          </PipeExit>
        </FrontLayer>


        <ScrollHint $show={!started}>SCROLL DOWN TO SWIM RIGHT</ScrollHint>
      </Stage>
    </Section>
  );
};

export default ProjectsSection;
