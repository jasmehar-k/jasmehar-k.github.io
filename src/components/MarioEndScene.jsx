// MarioEndScene.jsx — world 8-4 finale: flagpole, fireworks, castle, contact
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import mario from '../assets/mario_run.gif';
import castle from '../assets/castle.png';
import ground from '../assets/ground.png';
import webring from '../assets/webring.png';
import { sfx } from '../hooks/useSound';

const GROUND_H = 40;
const POLE_H = 320;

const walk = keyframes`
  0%   { left: -60px; }
  100% { left: calc(100% - 430px); }
`;

const burst = keyframes`
  0%   { transform: scale(0.1); opacity: 0; }
  8%   { opacity: 1; }
  70%  { transform: scale(1); opacity: 0.9; }
  100% { transform: scale(1.3); opacity: 0; }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
`;

const SceneWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 92vh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--water-deep) 0%, #0f1440 22%, #1a2258 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Star = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fffef7;
  animation: ${twinkle} ${({ $duration }) => $duration}s ease-in-out infinite;
`;

const ContentColumn = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem 10rem;
  max-width: 620px;
`;

const BigTitle = styled.h2`
  margin: 0 0 1.4rem;
  font-family: var(--font-pixel);
  font-size: clamp(1rem, 2.6vw, 1.7rem);
  color: #fffef7;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.6);
`;

const FinalMessage = styled.p`
  margin: 0 0 1.8rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255, 254, 247, 0.9);

  a {
    color: var(--gold);
    font-weight: 600;
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
  border: 4px dotted var(--gold);
  opacity: 0;
  z-index: 2;

  ${({ $animate, $delay }) =>
    $animate &&
    css`
      animation: ${burst} 1.7s ease-out ${$delay}s infinite;
    `}

  @media (max-width: 768px) {
    display: none;
  }
`;

const FlagPole = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  right: 360px;
  width: 8px;
  height: ${POLE_H}px;
  background: #43b047;
  border: 3px solid #000;
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 38%, #ffe87a, #e8a000);
    border: 3px solid #000;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Flag = styled.div`
  position: absolute;
  right: 8px;
  top: ${({ $down }) => ($down ? POLE_H - 90 : 10)}px;
  width: 0;
  height: 0;
  border-top: 26px solid transparent;
  border-bottom: 26px solid transparent;
  border-right: 62px solid #fffef7;
  filter: drop-shadow(-2px 2px 0 rgba(0, 0, 0, 0.45));
  transition: top 1.6s ease-in;

  &::after {
    content: '';
    position: absolute;
    left: 22px;
    top: -9px;
    width: 18px;
    height: 18px;
    background: var(--mario-red);
  }
`;

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${GROUND_H}px;
  background-image: url(${ground});
  background-repeat: repeat-x;
  background-size: contain;
  z-index: 4;
`;

const Mario = styled.img`
  position: absolute;
  bottom: ${GROUND_H}px;
  width: 60px;
  height: auto;
  image-rendering: pixelated;
  z-index: 4;

  ${({ $animate }) =>
    $animate
      ? css`
          animation: ${walk} 4s linear forwards;
        `
      : css`
          left: -60px;
        `}

  @media (max-width: 900px) {
    display: none;
  }
`;

const Castle = styled.img`
  position: absolute;
  bottom: ${GROUND_H}px;
  right: 4%;
  height: 340px;
  image-rendering: pixelated;
  z-index: 3;

  @media (max-width: 1024px) {
    height: 280px;
  }

  @media (max-width: 768px) {
    height: 200px;
    right: 50%;
    transform: translateX(50%);
    opacity: 0.55;
  }
`;

const STARS = [
  { left: '8%', top: '12%', duration: 2.4 },
  { left: '22%', top: '28%', duration: 3.1 },
  { left: '35%', top: '9%', duration: 2.8 },
  { left: '52%', top: '20%', duration: 3.4 },
  { left: '67%', top: '10%', duration: 2.2 },
  { left: '78%', top: '30%', duration: 3.0 },
  { left: '90%', top: '15%', duration: 2.6 },
  { left: '14%', top: '45%', duration: 3.6 },
  { left: '60%', top: '40%', duration: 2.9 },
];

const MarioEndScene = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [flagDown, setFlagDown] = useState(false);
  const timeoutRef = useRef(null);
  const flagTimerRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(false);
          setFlagDown(false);
          clearTimeout(timeoutRef.current);
          clearTimeout(flagTimerRef.current);
          timeoutRef.current = setTimeout(() => setAnimate(true), 100);
          flagTimerRef.current = setTimeout(() => {
            setFlagDown(true);
            if (!playedRef.current) {
              playedRef.current = true;
              sfx.flag();
            }
          }, 3600);
        } else {
          setAnimate(false);
          setFlagDown(false);
          playedRef.current = false;
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutRef.current);
      clearTimeout(flagTimerRef.current);
    };
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

  return (
    <SceneWrapper ref={sectionRef} id="end">
      {STARS.map((star, i) => (
        <Star key={i} style={{ left: star.left, top: star.top }} $duration={star.duration} />
      ))}

      <Firework style={{ right: '14%', top: '14%' }} $animate={flagDown} $delay={0} />
      <Firework style={{ right: '26%', top: '26%' }} $animate={flagDown} $delay={0.6} />
      <Firework style={{ right: '7%', top: '32%' }} $animate={flagDown} $delay={1.2} />

      <ContentColumn>
        <BigTitle>THANKS FOR PLAYING!</BigTitle>
        <FinalMessage>
          Thanks for visiting my portfolio. Feel free to reach out at{' '}
          <a href="mailto:jasmehar.kr@gmail.com">jasmehar.kr@gmail.com</a> — I&apos;m always happy to chat
          about AI, software, or co-op opportunities.
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

      <FlagPole>
        <Flag $down={flagDown} />
      </FlagPole>
      <Mario src={mario} alt="Mario walking to the flagpole" $animate={animate} />
      <Castle src={castle} alt="Castle" />
      <Ground />
    </SceneWrapper>
  );
};

export default MarioEndScene;
