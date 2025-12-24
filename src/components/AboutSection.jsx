import React from 'react';
import styled from 'styled-components';
import myPhoto from '../assets/photo.png'; 

const AboutWrapper = styled.section`
  background-color: #3b9aff;
  padding: 5rem 2rem;
  font-family: 'Press Start 2P', cursive;
  min-height: 50vh;
  color: #2e1b5b;
  border-top: 4px solid #2f2f2f;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #2f2f2f;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
`;

const PhotoWrapper = styled.div`
  width: 200px;
  height: 200px;
  border: 4px solid #2f2f2f;
  background-color: #fff;
  background-image: url(${myPhoto});
  background-size: cover;
  background-position: center 80%;
  border-radius: 12px;
  box-shadow: inset -4px -4px 0 rgba(0, 0, 0, 0.2);
  image-rendering: pixelated;
`;

const Bio = styled.div`
  max-width: 800px;
  background-color: #ffcc00;
  border: 4px solid #2f2f2f;
  padding: 1.5rem;
  box-shadow: inset -4px -4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  font-size: 0.65rem;
  line-height: 1.8;
`;

const AboutSection = () => {
  return (
    <AboutWrapper id="about">
      <SectionTitle>About Me</SectionTitle>
      <Content>
        <PhotoWrapper />
        <Bio>
          Hello! I'm Jasmehar Kaur, a Software Engineering student at the University of Waterloo. I am in my second year and am set to graduate in May 2029.<br /><br />
          My interests lie around the intersection of machine learning, software development, and real-world problem solving. I’ve built neural networks in PyTorch, worked on computer vision applications, and explored information retrieval systems using LangGraph and OpenSearch.<br /><br />
          I enjoy developing end-to-end solutions that blend intelligent systems with clean, maintainable code. I'm excited to keep learning and applying cutting-edge technology to create meaningful impact.
        </Bio>
      </Content>
    </AboutWrapper>
  );
};

export default AboutSection;
