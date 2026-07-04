// MarioEndScene.jsx — end of level: run in, grab the pole, flag slides, walk into the castle
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import marioRun from '../assets/mario_run.gif';
import marioIdle from '../assets/mario_slide.png';
import castle from '../assets/castle.png';
import cloud from '../assets/cloud.png';
import webring from '../assets/webring.png';
import { sfx } from '../hooks/useSound';
import { tiles } from '../utils/pixelArt';

const GROUND_H = 96;
const POLE_H = 320;
const POLE_RIGHT = 430;      // pole distance from right edge
const MARIO_AT_POLE = 462;   // mario stops just left of the pole
const MARIO_DOOR = 200;      // castle door position
const GRAB_BOTTOM = GROUND_H + 195;

// phase timings (ms)
const SEQUENCE = [
  ['run', 2400],
  ['grab', 350],
  ['slide', 1300],
  ['pause', 420],
  ['walk', 1500],
  ['in', 450],
];

const burst = keyframes`
  0%   { transform: scale(0.1); opacity: 0; }
  8%   { opacity: 1; }
  70%  { transform: scale(1); opacity: 0.9; }
  100% { transform: scale(1.3); opacity: 0; }
`;

const SceneWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 92vh;
  overflow: hidden;
  background: var(--sky);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloudImg = styled.img`
  position: absolute;
  image-rendering: pixelated;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Scenery = styled.img`
  position: absolute;
  bottom: ${GROUND_H}px;
  image-rendering: pixelated;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentColumn = styled.div`
  position: relative;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem 11rem;
  max-width: 600px;
  margin-right: min(30vw, 480px);

  @media (max-width: 900px) {
    margin-right: 0;
  }
`;

const BigTitle = styled.h2`
  margin: 0 0 1.4rem;
  font-family: var(--font-pixel);
  font-size: clamp(1rem, 2.6vw, 1.6rem);
  color: #fffef7;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.55);
`;

const FinalMessage = styled.p`
  margin: 0 0 1.8rem;
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  line-height: 2.3;
  color: #fcfcfc;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.35);

  a {
    color: var(--gold);
  }
`;

const IconButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 2rem;
`;

const IconButton = styled.a`
  color: #fffef7;
  font-size: 1.6rem;
  transition: transform 0.2s, color 0.2s;
  filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.4));

  &:hover {
    transform: scale(1.25);
    color: var(--gold);
  }
`;

const ReplayButton = styled.button`
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  padding: 0.9rem 1.1rem;
  background: var(--gold);
  color: #17120b;
  border: 3px solid #000;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.45);
  cursor: pointer;
  text-transform: uppercase;

  &:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
  }
`;

const Firework = styled.div`
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px dotted #fffef7;
  opacity: 0;
  z-index: 2;

  ${({ $animate, $delay }) =>
    $animate &&
    css`
      animation: ${burst} 1.7s ease-out ${$delay}s infinite;
    `}

  @media (max-width: 900px) {
    display: none;
  }
`;

const FlagPole = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  right: ${POLE_RIGHT}px;
  width: 10px;
  height: ${POLE_H}px;
  background: #80d010;
  border: 2px solid #000;
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #80d010;
    border: 3px solid #000;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const FlagImg = styled.img`
  position: absolute;
  bottom: ${GROUND_H}px;
  right: ${POLE_RIGHT + 8}px;
  width: 56px;
  image-rendering: pixelated;
  z-index: 3;

  @media (max-width: 900px) {
    display: none;
  }
`;

const GroundStrip = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${GROUND_H}px;
  background-repeat: repeat;
  background-size: 48px 48px;
  image-rendering: pixelated;
  z-index: 4;
`;

const MarioImg = styled.img`
  position: absolute;
  width: 58px;
  height: auto;
  image-rendering: pixelated;
  z-index: 4;

  @media (max-width: 900px) {
    display: none;
  }
`;

const CastleImg = styled.img`
  position: absolute;
  bottom: ${GROUND_H}px;
  right: 40px;
  height: 320px;
  image-rendering: pixelated;
  z-index: 5;

  @media (max-width: 1024px) {
    height: 260px;
  }

  @media (max-width: 900px) {
    height: 220px;
    right: 50%;
    transform: translateX(50%);
    opacity: 0.6;
  }
`;

function marioStyleFor(phase) {
  const atPole = `calc(100% - ${MARIO_AT_POLE}px)`;
  const atDoor = `calc(100% - ${MARIO_DOOR}px)`;
  switch (phase) {
    case 'run':
      return { left: atPole, bottom: GROUND_H, transition: 'left 2.4s linear' };
    case 'grab':
      return { left: atPole, bottom: GRAB_BOTTOM, transition: 'bottom 0.3s ease-out' };
    case 'slide':
      return { left: atPole, bottom: GROUND_H, transition: 'bottom 1.25s linear' };
    case 'pause':
      return { left: atPole, bottom: GROUND_H, transition: 'none' };
    case 'walk':
      return { left: atDoor, bottom: GROUND_H, transition: 'left 1.5s linear' };
    case 'in':
    case 'done':
      return { left: atDoor, bottom: GROUND_H, opacity: 0, transition: 'opacity 0.45s ease' };
    default:
      return { left: '-70px', bottom: GROUND_H, transition: 'none' };
  }
}

const MarioEndScene = () => {
  const sectionRef = useRef(null);
  const timersRef = useRef([]);
  const [phase, setPhase] = useState('idle');
  const T = tiles();

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const playSequence = () => {
    clearTimers();
    setPhase('idle');
    let elapsed = 150; // brief reset frame before running
    SEQUENCE.forEach(([name, duration]) => {
      timersRef.current.push(
        setTimeout(() => {
          setPhase(name);
          if (name === 'slide') sfx.flag();
        }, elapsed),
      );
      elapsed += duration;
    });
    timersRef.current.push(setTimeout(() => setPhase('done'), elapsed));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playSequence();
        } else {
          clearTimers();
          setPhase('idle');
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replayIntro = () => {
    try {
      sessionStorage.removeItem('arcadeSeen');
    } catch {
      /* private mode */
    }
    window.scrollTo(0, 0);
    window.location.reload();
  };

  const flagDown = ['slide', 'pause', 'walk', 'in', 'done'].includes(phase);
  const celebrating = ['in', 'done'].includes(phase);
  const running = phase === 'run' || phase === 'walk';

  return (
    <SceneWrapper ref={sectionRef} id="end">
      <CloudImg src={cloud} style={{ top: '48px', left: '8%', width: '300px' }} alt="" />
      <CloudImg src={cloud} style={{ top: '120px', right: '30%', width: '220px' }} alt="" />
      <Scenery src={T.bush} style={{ left: '6%', width: '150px' }} alt="" />

      <Firework style={{ right: '16%', top: '12%' }} $animate={celebrating} $delay={0} />
      <Firework style={{ right: '30%', top: '24%' }} $animate={celebrating} $delay={0.6} />
      <Firework style={{ right: '8%', top: '30%' }} $animate={celebrating} $delay={1.2} />

      <ContentColumn>
        <BigTitle>THANK YOU FOR VISITING!</BigTitle>
        <FinalMessage>
          BUT MORE OF MY WORK IS IN ANOTHER CASTLE...
          <br />
          <br />
          REACH ME AT <a href="mailto:jasmehar.kr@gmail.com">JASMEHAR.KR@GMAIL.COM</a> TO CHAT ABOUT AI,
          SOFTWARE, OR CO-OP OPPORTUNITIES.
        </FinalMessage>
        <IconButtonRow>
          <IconButton
            href="/Jasmehar-Kaur-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume"
          >
            <FontAwesomeIcon icon={faFileAlt} />
          </IconButton>
          <IconButton
            href="https://github.com/jasmehar-k"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} />
          </IconButton>
          <IconButton
            href="https://linkedin.com/in/jasmehar-kaur"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </IconButton>
          <IconButton
            href="https://se-webring.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SE Webring"
          >
            <img src={webring} alt="SE Webring" style={{ width: '26px', height: 'auto', display: 'block' }} />
          </IconButton>
        </IconButtonRow>
        <ReplayButton type="button" onClick={replayIntro}>
          ▶ insert coin to replay intro
        </ReplayButton>
      </ContentColumn>

      <FlagImg
        src={T.flag}
        alt=""
        style={{
          bottom: flagDown ? GROUND_H + 14 : GROUND_H + POLE_H - 66,
          transition: 'bottom 1.25s linear',
        }}
      />
      <FlagPole />
      <MarioImg
        src={running ? marioRun : marioIdle}
        alt="Mario finishing the level"
        style={marioStyleFor(phase)}
      />
      <CastleImg src={castle} alt="Castle" />
      <GroundStrip style={{ backgroundImage: `url(${T.ground})` }} />
    </SceneWrapper>
  );
};

export default MarioEndScene;
