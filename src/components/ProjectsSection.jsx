// ProjectsSection.jsx — world 2-2, underwater
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaAward, FaGithub } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import WorldPlaque from './WorldPlaque';

import project_recipeFinder from '../assets/recipe_finder.png';
import intersection from '../assets/intersection.png';
import foot_print from '../assets/foot_print.png';
import braillinator from '../assets/braillinator.png';
import portfolio from '../assets/portfolio.png';
import prediction from '../assets/prediction.png';
import iclick from '../assets/iclick.JPG';
import breadboard from '../assets/breadboard.png';
import visionCAD from '../assets/visionCAD.png';
import dill_pkl from '../assets/dill_pkl.png';
import pelican from '../assets/pelican.png';

const rise = keyframes`
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.5; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-105vh) translateX(24px); opacity: 0; }
`;

const ProjectsContainer = styled.section`
  position: relative;
  background: linear-gradient(180deg, var(--water) 0%, var(--water-deep) 100%);
  padding: 5rem 2rem 6rem;
  overflow: hidden;
`;

const Bubble = styled.div`
  position: absolute;
  bottom: -40px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.55);
  background: radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.06));
  animation: ${rise} ${({ $duration }) => $duration}s linear ${({ $delay }) => $delay}s infinite;
  pointer-events: none;
  z-index: 0;
`;

const ProjectGrid = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 2.2rem;
  justify-content: center;
  max-width: 1300px;
  margin: 0 auto;
`;

const ProjectCard = styled.div`
  background: #fffef7;
  border: 4px solid #10102a;
  width: 310px;
  padding: 0 0 1.2rem;
  position: relative;
  transition: transform 0.25s ease;
  box-shadow: 8px 8px 0 rgba(6, 20, 60, 0.65);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
  }

  @media (max-width: 600px) {
    &:hover {
      transform: none;
    }
  }
`;

const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  background: var(--gold);
  border-bottom: 4px solid #10102a;
`;

const LevelChip = styled.span`
  font-family: var(--font-pixel);
  font-size: 0.42rem;
  background: #10102a;
  color: var(--gold);
  padding: 0.3rem 0.4rem;
  white-space: nowrap;
`;

const ProjectName = styled.h3`
  margin: 0;
  font-family: var(--font-pixel);
  font-size: 0.62rem;
  line-height: 1.5;
  color: #10102a;
  flex: 1;
`;

const CardBody = styled.div`
  padding: 1rem 1rem 0;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const SkillTag = styled.span`
  background: #e6f2ff;
  color: #10306a;
  padding: 0.28rem 0.45rem;
  font-family: var(--font-pixel);
  font-size: 0.42rem;
  border: 2px solid #10306a;
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid #10102a;

  img {
    width: 100%;
    display: block;
    object-fit: cover;
  }
`;

const Description = styled.p`
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.6;
  color: #26263a;
`;

const LinkIcons = styled.div`
  display: flex;
  gap: 0.55rem;
`;

const ProjectLinkIcon = styled.a`
  color: #10102a;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: var(--mario-red);
  }
`;

const AwardBadge = styled.div`
  position: absolute;
  top: -14px;
  left: -14px;
  z-index: 2;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 999px;
  background: var(--gold);
  border: 3px solid #10102a;
  box-shadow: 3px 3px 0 #10102a;
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
  min-width: 170px;
  max-width: 230px;
  padding: 0.6rem 0.7rem;
  background: #fffef7;
  color: #10102a;
  border: 2px solid #10102a;
  box-shadow: 4px 4px 0 #10102a;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.72rem;
  line-height: 1.45;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
  z-index: 3;
`;

const BUBBLES = [
  { left: '6%', size: 18, duration: 13, delay: 0 },
  { left: '16%', size: 10, duration: 17, delay: 4 },
  { left: '28%', size: 14, duration: 15, delay: 8 },
  { left: '44%', size: 9, duration: 19, delay: 2 },
  { left: '58%', size: 16, duration: 14, delay: 6 },
  { left: '72%', size: 11, duration: 18, delay: 1 },
  { left: '84%', size: 20, duration: 12, delay: 9 },
  { left: '93%', size: 12, duration: 16, delay: 5 },
];

const PROJECTS = [
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
    tags: ['Python', 'PyTorch', 'Machine Learning', 'Neural Networks'],
    description:
      'Neural network built in PyTorch classified breast cancer tumors with 96% accuracy, optimized using binary cross-entropy loss and the Adam optimizer.',
    github: 'https://github.com/jasmehar-k/breast-cancer-prediction',
  },
  {
    name: 'Road Traffic Simulation',
    image: intersection,
    tags: ['Java', 'OOP', 'Multi-threading', 'AWT Graphics'],
    description:
      'Multi-threaded simulator for a 4-way intersection, optimizing traffic light durations with realistic driver behaviors modeled from real-world data.',
    github: 'https://github.com/jasmehar-k/traffic-simulation',
  },
  {
    name: 'Recipe Finder',
    image: project_recipeFinder,
    tags: ['Python', 'Web Scraping', 'webbrowser', 'googlesearch', 'Beautiful-Soup'],
    description:
      'Web app that finds recipes based on user input by scraping and filtering online sources for relevant ingredient and instruction data.',
    devpost: 'https://devpost.com/software/recipe-finder-xed0oz',
  },
  {
    name: 'Portfolio Website (this site!)',
    image: portfolio,
    tags: ['React.js', 'styled-components', 'Three.js', 'Web Design'],
    description:
      'Super Mario Bros themed portfolio with a 3D arcade intro, a playable hero level, and world-themed sections, built with React, three.js, and styled-components.',
    github: 'https://github.com/jasmehar-k/jasmehar-k.github.io',
  },
];

const ProjectsSection = () => {
  return (
    <ProjectsContainer id="projects">
      {BUBBLES.map((bubble, i) => (
        <Bubble
          key={i}
          style={{ left: bubble.left }}
          $size={bubble.size}
          $duration={bubble.duration}
          $delay={bubble.delay}
        />
      ))}

      <WorldPlaque world="2-2" name="PROJECTS" light />

      <ProjectGrid>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.name}>
            {project.award && (
              <AwardBadge aria-label={`${project.name} award`}>
                <FaAward />
                <AwardTooltip>{project.award}</AwardTooltip>
              </AwardBadge>
            )}
            <LevelHeader>
              <LevelChip>{`LV ${index + 1}`}</LevelChip>
              <ProjectName>{project.name}</ProjectName>
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
            </LevelHeader>
            <CardBody>
              <ImageWrapper>
                <img src={project.image} alt={project.name} />
              </ImageWrapper>
              <SkillTags>
                {project.tags.map((tag) => (
                  <SkillTag key={tag}>{tag}</SkillTag>
                ))}
              </SkillTags>
              <Description>{project.description}</Description>
            </CardBody>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </ProjectsContainer>
  );
};

export default ProjectsSection;
