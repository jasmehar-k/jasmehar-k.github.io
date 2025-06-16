// import React from 'react';
// import styled from 'styled-components';
// import bg from '../assets/about_bg.png'; 

// const Section = styled.section`
//   background-color: #3b9aff;
//   background-size: cover;
//   color: #333;
//   padding: 100px 20px;
//   font-family: 'Press Start 2P', cursive;
//   text-align: center;
// //   background-image: url(${bg});
// `;

// const Title = styled.h2`
//   margin-top: 10rem;
//   color: #d35400;
//   margin-bottom: 2rem;
// `;

// const Text = styled.p`
//   max-width: 600px;
//   margin: 0 auto;
//   line-height: 2;
// `;

// const ProjectsSection = () => {
//   return (
//     <Section id="projects">
//       <Title>About Me</Title>
//       <Text>
//         I'm Jasmehar, a software engineer who loves building creative things —
//         especially if they're playful, animated, or Mario-themed! I enjoy working
//         with React, APIs, and anything that makes users smile.
//       </Text>
//     </Section>
//   );
// };

// export default ProjectsSection;


import React from 'react';
import styled from 'styled-components';
import project1 from '../assets/project1.png'; 
import project2 from '../assets/project2.png';
import recipeFinder from '../assets/recipe_finder.png'; 
import intersection from '../assets/intersection.png';
import braillinator from '../assets/braillinator.png'; 
import portfolio from '../assets/portfolio.png'; 
import prediction from '../assets/prediction.png';

const ProjectsContainer = styled.section`
  background-color: #cceeff;
  padding: 5rem 2rem;
  font-family: 'Press Start 2P', cursive;
  background-color: #3b9aff;

`;

const Title = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 4rem;
  color: #2f2f2f;
`;

const ProjectGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: left;
`;

const ProjectCard = styled.div`
  background-color: #fff;
  border: 4px solid #2f2f2f;
  width: 300px;
  padding: 1rem;
  position: relative;
  transition: transform 0.3s ease;
  box-shadow: 8px 8px 0 #2f2f2f;

  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none; /* Disable transform on hover for small screens */
    }
`;
const ProjectName = styled.h3`
  font-size: 0.75rem;
  color: #2f2f2f;
  margin-bottom: 0.75rem;
  text-align: center;
  background-color: #ffd700;
  padding: 0.25rem;
  border: 2px solid #2f2f2f;
  box-shadow: 4px 4px 0 #b8860b;
`;
const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SkillTag = styled.span`
  background-color: #ffcc00;
  color: #000;
  padding: 0.25rem 0.5rem;
  font-size: 0.5rem;
  border: 2px solid #2f2f2f;
`;

const ImageWrapper = styled.div`
  height: 150px;
  overflow: hidden;
  margin-bottom: 1rem;

  img {
    width: 100%;
    object-fit: cover;
    image-rendering: pixelated;
  }
`;

const Description = styled.p`
  font-size: 0.6rem;
  color: #2f2f2f;
`;

const LevelBadge = styled.span`
  display: inline-block;
  background-color: #ffcc00;
  color: #2f2f2f;
  border: 2px solid #2f2f2f;
  padding: 0.2rem 0.4rem;
  margin-right: 0.5rem;
  font-size: 0.75rem;
  font-family: 'Press Start 2P', cursive;
  box-shadow: 2px 2px 0 #b8860b;
`;

const ProjectsSection = () => {
  return (
    <ProjectsContainer id="projects">
      <Title>Projects</Title>
      <ProjectGrid>
        <ProjectCard>
            <ProjectName>Braillinator</ProjectName>
                <SkillTags>
                    <SkillTag>Python</SkillTag>
                    <SkillTag>OCR</SkillTag>
                    <SkillTag>WebSocket</SkillTag>
                    <SkillTag>Raspberry Pi</SkillTag>
                    <SkillTag>React Native</SkillTag>
                </SkillTags>
                <ImageWrapper>
                    <img src={braillinator} alt="Braillinator" />
                </ImageWrapper>
                <Description>
                Real-time text-to-Braille system that uses a mobile app and Raspberry Pi to convert captured images into tactile Braille.
                </Description>
                </ProjectCard>

                <ProjectCard>
                <ProjectName>Breast Cancer Prediction Model</ProjectName>
                <SkillTags>
                    <SkillTag>Python</SkillTag>
                    <SkillTag>PyTorch</SkillTag>
                    <SkillTag>Machine Learning</SkillTag>
                    <SkillTag>Neural Networks</SkillTag>
                </SkillTags>
                <ImageWrapper>
                    <img src={prediction} alt="Prediction Model" />
                </ImageWrapper>
                <Description>
                Neural network built in PyTorch classified breast cancer tumors with 96% accuracy, optimized using binary cross-entropy loss and the Adam optimizer.                </Description>
        </ProjectCard>
        <ProjectCard>
                <ProjectName>Road Traffic Simulation</ProjectName>
                <SkillTags>
                    <SkillTag>Java</SkillTag>
                    <SkillTag>OOP</SkillTag>
                    <SkillTag>Multi-threading</SkillTag>
                    <SkillTag>AWT Graphics</SkillTag>
                </SkillTags>
                <ImageWrapper>
                    <img src={intersection} alt="Traffic Simulation" />
                </ImageWrapper>
                <Description>
                Multi-threaded simulator for a 4-way intersection, optimizing traffic light durations with realistic driver behaviors modeled from real-world data.                </Description>
        </ProjectCard>
        <ProjectCard>
                <ProjectName>Recipe Finder</ProjectName>
                <SkillTags>
                    <SkillTag>Python</SkillTag>
                    <SkillTag>Web Scraping</SkillTag>
                    <SkillTag>webbrowser</SkillTag>
                    <SkillTag>googlesearch</SkillTag>
                    <SkillTag>Beautiful-Soup</SkillTag>

                </SkillTags>
                <ImageWrapper>
                    <img src={recipeFinder} alt="Recipe Finder" />
                </ImageWrapper>
                <Description>
                Web app that finds recipes based on user input by scraping and filtering online sources for relevant ingredient and instruction data. </Description>
        </ProjectCard>
        <ProjectCard>
                <ProjectName>Portfolio Website (this site!)</ProjectName>
                <SkillTags>
                    <SkillTag>React.js</SkillTag>
                    <SkillTag>styled-components</SkillTag>
                    <SkillTag>Web Design</SkillTag>
                    <SkillTag>Framer Motion</SkillTag>
                </SkillTags>
                <ImageWrapper>
                    <img src={portfolio} alt="Portfolio" />
                </ImageWrapper>
                <Description>
                Portfolio featuring intuitive section navigation and fully responsive layouts, ensuring a consistent user experience across all devices. </Description>
        </ProjectCard>
      </ProjectGrid>
    </ProjectsContainer>
  );
};

export default ProjectsSection;


