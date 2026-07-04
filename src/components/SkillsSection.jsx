// SkillsSection.jsx — world 1-2, underground
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPython, FaProjectDiagram, FaJs, FaReact, FaGitAlt, FaDocker, FaDatabase, FaBrain, FaLaptopCode, FaCode, FaJava } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiHtml5, SiCss3, SiPostman, SiPytorch, SiFastapi, SiNodedotjs, SiTailwindcss, SiLangchain, SiGnubash, SiC, SiAmazonwebservices, SiApachekafka, SiKubernetes, SiHelm, SiOpensearch, SiRaspberrypi, SiScikitlearn, SiAngular, SiGo } from 'react-icons/si';
import WorldPlaque from './WorldPlaque';
import { sfx } from '../hooks/useSound';
import { tiles } from '../utils/pixelArt';

const bump = keyframes`
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const SkillsWrapper = styled.section`
  position: relative;
  background: #000;
  padding: 0 2rem 10rem;
  overflow: hidden;
`;

/* underground teal brick ceiling, side walls and floor — world 1-2 */
const BrickCeiling = styled.div`
  height: 96px;
  margin: 0 -2rem 4rem;
  background-repeat: repeat;
  background-size: 48px 48px;
  image-rendering: pixelated;
`;

const SideWall = styled.div`
  position: absolute;
  top: 96px;
  bottom: 0;
  width: 48px;
  background-repeat: repeat;
  background-size: 48px 48px;
  image-rendering: pixelated;

  @media (max-width: 900px) {
    display: none;
  }
`;

const FloorStrip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 96px;
  background-repeat: repeat;
  background-size: 48px 48px;
  image-rendering: pixelated;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Category = styled.div`
  margin-bottom: 3.4rem;
`;

const CategoryTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: var(--font-pixel);
  font-size: 0.85rem;
  color: #fcfcfc;
  margin: 0 0 1.6rem;
`;

const CoinDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #ffe87a, #e8a000);
  border: 2px solid #7a5a08;
  flex-shrink: 0;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 1.1rem;
`;

const SkillBlock = styled.button`
  height: 128px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.8rem 0.4rem;
  background-color: transparent;
  background-size: 100% 100%;
  image-rendering: pixelated;
  border: none;
  font-family: var(--font-pixel);
  color: #4a1d00;
  cursor: pointer;

  &:hover {
    animation: ${bump} 0.25s ease;
    filter: brightness(1.06);
  }

  @media (max-width: 600px) {
    &:hover {
      animation: none;
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 1.9rem;
  line-height: 1;
`;

const SkillName = styled.div`
  font-size: 0.5rem;
  max-width: 100%;
  word-wrap: break-word;
  text-align: center;
  line-height: 1.5;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.6rem;
`;

const CertCard = styled.div`
  background: #000;
  border: 4px solid #fcfcfc;
  padding: 1.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 600px) {
    &:hover {
      transform: none;
    }
  }
`;

const CertTitle = styled.h3`
  font-family: var(--font-pixel);
  font-size: 0.65rem;
  line-height: 1.7;
  color: #fcfcfc;
  margin: 0 0 0.7rem;
`;

const CertOrg = styled.p`
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  color: var(--gold);
  margin: 0 0 0.8rem;
`;

const CertBlurb = styled.p`
  font-family: var(--font-pixel);
  font-size: 0.45rem;
  line-height: 2;
  color: #fcfcfc;
  margin: 0;
`;

const certifications = [
  {
    title: 'AWS Cloud Technical Essentials',
    org: 'Amazon Web Services',
    blurb: 'Covered core AWS services including compute, storage, networking, and databases, with hands-on experience deploying and managing cloud infrastructure.'
  },
  {
    title: 'Building AI Agents with LangGraph',
    org: "O'Reilly",
    blurb: 'Learned how to structure multi-step, stateful AI workflows using LangGraph to build agentic applications.'
  },
  {
    title: 'Introduction to LangGraph',
    org: 'LangChain',
    blurb: "Gained hands-on experience building graph-based AI agents using LangChain's LangGraph framework, understanding how to manage control flow in complex chains."
  },
  {
    title: 'Docker Foundations Professional Certificate',
    org: 'LinkedIn Learning',
    blurb: 'Learned how to simplify application deployment using Docker by building and managing containers with Dockerfiles, working with images and registries, and using Docker Compose to efficiently configure and run multi-service applications.'
  },
  {
    title: 'Learning Kubernetes',
    org: 'LinkedIn Learning',
    blurb: 'Gained hands-on experience with Kubernetes by learning how to create clusters with Minikube, deploying and managing containerized applications, writing YAML manifests, and applying core cloud-native and security concepts.'
  },
  {
    title: 'Artificial Intelligence Fundamentals',
    org: 'IBM',
    blurb: 'Built a solid understanding of core AI concepts including machine learning, neural networks, and ethical considerations in AI development.'
  },
];

const CATEGORIES = [
  {
    title: 'DOMAINS',
    skills: [
      { icon: <FaBrain />, name: 'Machine Learning' },
      { icon: <FaLaptopCode />, name: 'Full Stack Dev' },
      { icon: <FaProjectDiagram />, name: 'Agentic Systems' },
      { icon: <FaDatabase />, name: 'RAG & Search' },
    ],
  },
  {
    title: 'LANGUAGES',
    skills: [
      { icon: <FaPython />, name: 'Python' },
      { icon: <FaJava />, name: 'Java' },
      { icon: <SiGo />, name: 'Go' },
      { icon: <SiCplusplus />, name: 'C++' },
      { icon: <SiC />, name: 'C' },
      { icon: <FaJs />, name: 'JavaScript' },
      { icon: <SiTypescript />, name: 'TypeScript' },
      { icon: <FaDatabase />, name: 'SQL' },
      { icon: <SiHtml5 />, name: 'HTML5' },
      { icon: <SiCss3 />, name: 'CSS3' },
    ],
  },
  {
    title: 'FRAMEWORKS & LIBRARIES',
    skills: [
      { icon: <SiPytorch />, name: 'PyTorch' },
      { icon: <SiScikitlearn />, name: 'Scikit-learn' },
      { icon: <SiLangchain />, name: 'LangChain' },
      { icon: <FaProjectDiagram />, name: 'LangGraph' },
      { icon: <SiApachekafka />, name: 'Apache Kafka' },
      { icon: <SiFastapi />, name: 'FastAPI' },
      { icon: <FaCode />, name: 'Flask' },
      { icon: <FaReact />, name: 'React' },
      { icon: <FaReact />, name: 'React Native' },
      { icon: <SiAngular />, name: 'Angular' },
      { icon: <SiNodedotjs />, name: 'Node.js' },
      { icon: <SiTailwindcss />, name: 'TailwindCSS' },
      { icon: <FaDocker />, name: 'Docker' },
      { icon: <SiKubernetes />, name: 'Kubernetes' },
      { icon: <SiHelm />, name: 'Helm' },
    ],
  },
  {
    title: 'TOOLS & INFRASTRUCTURE',
    skills: [
      { icon: <FaGitAlt />, name: 'Git / GitHub' },
      { icon: <SiAmazonwebservices />, name: 'AWS' },
      { icon: <SiOpensearch />, name: 'OpenSearch' },
      { icon: <SiPostman />, name: 'Postman' },
      { icon: <SiGnubash />, name: 'Bash' },
      { icon: <SiRaspberrypi />, name: 'Raspberry Pi' },
      { icon: <FaCode />, name: 'REST APIs' },
      { icon: <FaDatabase />, name: 'WebSocket' },
    ],
  },
];

const bumpBlock = () => {
  sfx.bump();
};

const SkillsSection = () => {
  const T = tiles();

  return (
    <SkillsWrapper id="skills">
      <BrickCeiling style={{ backgroundImage: `url(${T.tealBrick})` }} />
      <SideWall style={{ left: 0, backgroundImage: `url(${T.tealBrick})` }} />
      <SideWall style={{ right: 0, backgroundImage: `url(${T.tealBrick})` }} />
      <WorldPlaque world="1-2" name="SKILLS" light />
      <Inner>
        {CATEGORIES.map((category) => (
          <Category key={category.title}>
            <CategoryTitle>
              <CoinDot />
              {category.title}
              <CoinDot />
            </CategoryTitle>
            <SkillsGrid>
              {category.skills.map((skill) => (
                <SkillBlock
                  key={skill.name}
                  type="button"
                  onClick={bumpBlock}
                  aria-label={skill.name}
                  style={{ backgroundImage: `url(${T.qBlockPlain})` }}
                >
                  <IconWrapper>{skill.icon}</IconWrapper>
                  <SkillName>{skill.name}</SkillName>
                </SkillBlock>
              ))}
            </SkillsGrid>
          </Category>
        ))}

        <Category id="certifications">
          <CategoryTitle>
            <CoinDot />
            CERTIFICATIONS
            <CoinDot />
          </CategoryTitle>
          <Grid>
            {certifications.map((cert, index) => (
              <CertCard key={index}>
                <CertTitle>{cert.title}</CertTitle>
                <CertOrg>{cert.org}</CertOrg>
                <CertBlurb>{cert.blurb}</CertBlurb>
              </CertCard>
            ))}
          </Grid>
        </Category>
      </Inner>
      <FloorStrip style={{ backgroundImage: `url(${T.tealBrick})` }} />
    </SkillsWrapper>
  );
};

export default SkillsSection;
