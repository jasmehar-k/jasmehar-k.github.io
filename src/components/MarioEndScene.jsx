import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import mario from '../assets/mario_run.gif';
import castle from '../assets/castle.png';
import ground from '../assets/ground.png';
import webring from '../assets/webring.png';

const walk = keyframes`
  0% {
    left: -60px;
  }
  100% {
    left: calc(100% - 160px);
  }
`;

const SceneWrapper = styled.section`
  width: 100%;
  background-color: #3b9aff;
  position: absolute;
  overflow: visible;
  // border-top: 4px solid #2f2f2f;
  min-height: 80%;
  // padding-bottom: 160px;
`;
const LeftContentColumn = styled.div`
  position: absolute;
  bottom: 300px;
  left: 0;
  width: calc(100% - 500px); /* assuming castle is ~250–300px wide */
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Press Start 2P', cursive;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 1rem;
    top: 100px;
  }
`;


const FinalMessage = styled.div`
  text-align: center;
  font-size: 0.65rem;
  color: #fff;
  line-height: 1.8;
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;



const ContactItem = styled.div`
  margin-top: 0.5rem;
  word-break: break-word;
`;

const IconButtonRow = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;

const IconButton = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: transform 0.2s;
  text-decoration: none;

  &:hover {
    transform: scale(1.3);
    color: #ffd700;
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none; /* Disable transform on hover for small screens */
    }
`;


const Ground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-image: url(${ground});
  background-repeat: repeat-x;
  background-size: contain;
`;

const Mario = styled.img`
  position: absolute;
  bottom: 40px;
  left: 5%;
  width: 60px;
  height: auto;
  image-rendering: pixelated;

  ${({ animate }) =>
    animate
      ? css`
          animation: ${walk} 5s linear forwards;
        `
      : css`
          left: -60px;
        `}
`;

const Castle = styled.img`
  position: absolute;
  bottom: 40px;
  right: 5%;
  height: 500px;
  image-rendering: pixelated;

  @media (max-width: 1024px) {
    height: 400px;
  }

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;


const MarioEndScene = () => {
  const sectionRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset animation
          setAnimate(false);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setAnimate(true), 100); // small delay to retrigger
        } else {
          setAnimate(false); // reset when out of view
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <SceneWrapper ref={sectionRef}>
    <LeftContentColumn>
      <FinalMessage>
        Thanks for visiting my portfolio! <br />
        Feel free to reach out to me at jasmehar.kr@gmail.com <br />
      </FinalMessage>
      <IconButtonRow>
        <IconButton
          href="/resume.pdf"
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
      </IconButtonRow>
      <IconButton 
        href="https://se-webring.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SE Webring"
      >
        <img src={webring} alt="SE Webring" style={{ width: '25px', height: 'auto', marginTop: '1.5rem'}} />
      </IconButton>
    </LeftContentColumn>
  
    <Mario src={mario} alt="Mario walking" animate={animate} />
    <Castle src={castle} alt="Castle" />
    <Ground />
  </SceneWrapper>
  
  );
};

export default MarioEndScene;
