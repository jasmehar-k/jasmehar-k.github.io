import React from 'react';
import styled from 'styled-components';
import myPhoto from '../assets/photo.png';
import WorldPlaque from './WorldPlaque';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { tiles } from '../utils/pixelArt';

const AboutWrapper = styled.section`
  position: relative;
  background: var(--sky);
  padding: 6rem 2rem 12rem;
  min-height: 60vh;
  overflow: hidden;
`;

const Scenery = styled.img`
  position: absolute;
  bottom: 96px;
  image-rendering: pixelated;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const GroundStrip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 96px;
  background-repeat: repeat;
  background-size: 48px 48px;
  image-rendering: pixelated;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
  max-width: 1100px;
  margin: 0 auto;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? 0 : '28px')});
  transition: opacity 0.7s ease, transform 0.7s ease;
`;

const PhotoFrame = styled.div`
  position: relative;
  flex-shrink: 0;
  padding: 8px;
  background: #fcfcfc;
  border: 4px solid #000;
`;

const Photo = styled.div`
  width: 270px;
  height: 270px;
  background-image: url(${myPhoto});
  background-size: cover;
  background-position: center 80%;
`;

const FrameTag = styled.div`
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.35rem 0.7rem;
  background: var(--mario-red);
  color: #fff;
  border: 3px solid #000;
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  white-space: nowrap;
`;

/* white game text straight on the sky, like the game's story screens */
const DialogueBody = styled.div`
  max-width: 620px;
  font-family: var(--font-pixel);
  font-size: 0.62rem;
  line-height: 2.2;
  color: #fcfcfc;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);

  p {
    margin: 0 0 1.3rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--gold);
    font-weight: normal;
  }
`;

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const T = tiles();

  return (
    <AboutWrapper id="about">
      <WorldPlaque world="1-1" name="ABOUT ME" />
      <Content ref={ref} $visible={isVisible}>
        <PhotoFrame>
          <Photo />
          <FrameTag>PLAYER 1</FrameTag>
        </PhotoFrame>
        <DialogueBody>
          <p>
            HELLO! I&apos;M JASMEHAR, A 2ND YEAR <strong>SOFTWARE ENGINEERING</strong> STUDENT AT THE
            UNIVERSITY OF WATERLOO.
          </p>
          <p>
            MY INTERESTS LIE AT THE INTERSECTION OF <strong>ARTIFICIAL INTELLIGENCE</strong>, SOFTWARE
            DEVELOPMENT, AND REAL-WORLD PROBLEM SOLVING. I&apos;VE BUILT NEURAL NETWORKS IN PYTORCH, WORKED ON
            COMPUTER VISION, AND EXPLORED RETRIEVAL SYSTEMS USING LANGGRAPH AND OPENSEARCH.
          </p>
          <p>
            I ENJOY BUILDING END-TO-END SOLUTIONS THAT BLEND INTELLIGENT SYSTEMS WITH CLEAN, MAINTAINABLE
            CODE.
          </p>
        </DialogueBody>
      </Content>

      <Scenery src={T.bush} style={{ left: '4%', width: '150px' }} alt="" />
      <Scenery src={T.hill} style={{ right: '-1%', width: '260px' }} alt="" />
      <GroundStrip style={{ backgroundImage: `url(${T.ground})` }} />
    </AboutWrapper>
  );
};

export default AboutSection;
