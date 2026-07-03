import React from 'react';
import styled from 'styled-components';
import myPhoto from '../assets/photo.png';
import WorldPlaque from './WorldPlaque';
import { useScrollReveal } from '../hooks/useScrollReveal';

const AboutWrapper = styled.section`
  position: relative;
  background: var(--sky);
  padding: 6rem 2rem 7rem;
  min-height: 60vh;
  overflow: hidden;
`;

const Bush = styled.div`
  position: absolute;
  bottom: 0;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  background: var(--pipe);
  border: 4px solid #2f2f2f;
  border-bottom: none;
  border-radius: ${({ $h }) => $h}px ${({ $h }) => $h}px 0 0;
  opacity: 0.9;

  @media (max-width: 768px) {
    display: none;
  }
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
  padding: 10px;
  background: #fffef7;
  border: 4px solid #2f2f2f;
  box-shadow: 8px 8px 0 rgba(47, 47, 47, 0.45);
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
  border: 3px solid #2f2f2f;
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  white-space: nowrap;
`;

const DialogueBox = styled.div`
  max-width: 620px;
  background: #fffef7;
  border: 4px solid #2f2f2f;
  box-shadow: 8px 8px 0 rgba(47, 47, 47, 0.45);
`;

const DialogueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.2rem;
  background: var(--gold);
  border-bottom: 4px solid #2f2f2f;
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  color: #2f2f2f;
`;

const CoinDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #fffef7, #e8a000);
  border: 2px solid #b8860b;
`;

const DialogueBody = styled.div`
  padding: 1.5rem 1.6rem;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.75;
  color: #2b2b35;

  p {
    margin: 0 0 1rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--mario-red);
  }
`;

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <AboutWrapper id="about">
      <WorldPlaque world="1-1" name="ABOUT ME" />
      <Content ref={ref} $visible={isVisible}>
        <PhotoFrame>
          <Photo />
          <FrameTag>PLAYER 1</FrameTag>
        </PhotoFrame>
        <DialogueBox>
          <DialogueHeader>
            <CoinDot />
            MESSAGE FROM JASMEHAR
          </DialogueHeader>
          <DialogueBody>
            <p>
              Hello! I&apos;m Jasmehar, a 2nd year <strong>Software Engineering</strong> student at the
              University of Waterloo.
            </p>
            <p>
              My interests lie around the intersection of <strong>artificial intelligence</strong>, software
              development, and real-world problem solving. I&apos;ve built neural networks in PyTorch, worked on
              computer vision applications, and explored information retrieval systems using LangGraph and
              OpenSearch.
            </p>
            <p>
              I enjoy developing end-to-end solutions that blend intelligent systems with clean, maintainable
              code. I&apos;m excited to keep learning and applying cutting-edge technology to create meaningful
              impact.
            </p>
          </DialogueBody>
        </DialogueBox>
      </Content>

      <Bush style={{ left: '4%' }} $w={150} $h={52} />
      <Bush style={{ left: '13%' }} $w={90} $h={38} />
      <Bush style={{ right: '6%' }} $w={120} $h={46} />
    </AboutWrapper>
  );
};

export default AboutSection;
