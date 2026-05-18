// SkillsSection.jsx
import React from 'react';
import styled from 'styled-components';
import { FaPython, FaProjectDiagram, FaJs, FaReact, FaGitAlt, FaDocker, FaDatabase, FaBrain, FaLaptopCode, FaCode, FaJava } from 'react-icons/fa';
import { SiTypescript, SiCplusplus, SiHtml5, SiCss3, SiMongodb, SiPostman, SiTensorflow, SiVite, SiPytorch, SiFastapi, SiNodedotjs, SiTailwindcss, SiLangchain, SiGnubash, SiC, SiAmazonwebservices, SiApachekafka, SiKubernetes, SiHelm, SiOpensearch, SiRaspberrypi, SiScikitlearn, SiAngular, SiGo } from 'react-icons/si';
import { Icon } from '@iconify/react';
import block from '../assets/yellow_block.png'; 


const SkillsWrapper = styled.section`
  background-color: #3b9aff;
  padding: 4rem 2rem;
  font-family: 'Press Start 2P', cursive;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #2f2f2f;
  margin-bottom: 2rem;
`;

const Category = styled.div`
  margin-bottom: 3rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  color: #ffffff;
  border-left: 4px solid #c62828;
  padding-left: 1rem;
  margin-bottom: 1.5rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  text-align: center;
`;

const SkillCard = styled.div`
  width: 150px;
  height: 120px;
  background-image: url(${block});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  image-rendering: pixelated;

  border-radius: 12px;
  transition: transform 0.2s ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: 'Press Start 2P', cursive;
  color: #2f2f2f;
  text-align: center;
  padding: 1.3rem;

  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none;
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const SkillName = styled.div`
  font-size: 0.55rem;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: center;
  padding: 0 0.3rem;
`;

const CertSection = styled.section`
  background-color: #3b9aff;
  padding: 0rem 0rem;
  font-family: 'Press Start 2P', cursive;
  color: #2f2f2f;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const CertCard = styled.div`
  background-color: #fffacd;
  border: 4px solid #2f2f2f;
  box-shadow: 4px 4px 0 #000;
  padding: 1.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 6px 6px 0 #000;
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none;
    }
  }
`;

const CertTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const CertOrg = styled.p`
  font-size: 0.7rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const CertBlurb = styled.p`
  font-size: 0.6rem;
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

const SkillsSection = () => {
  return (
    <SkillsWrapper id="skills">
      <Title>Skills</Title>

      <Category>
        <CategoryTitle>Domains</CategoryTitle>
        <SkillsGrid>
          <SkillCard><IconWrapper><FaBrain /></IconWrapper><SkillName>Machine Learning</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaLaptopCode /></IconWrapper><SkillName>Full Stack Dev</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaProjectDiagram /></IconWrapper><SkillName>Agentic Systems</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaDatabase /></IconWrapper><SkillName>RAG & Search</SkillName></SkillCard>
        </SkillsGrid>
      </Category>

      <Category>
        <CategoryTitle>Languages</CategoryTitle>
        <SkillsGrid>
          <SkillCard><IconWrapper><FaPython /></IconWrapper><SkillName>Python</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaJava /></IconWrapper><SkillName>Java</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiGo /></IconWrapper><SkillName>Go</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiCplusplus /></IconWrapper><SkillName>C++</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiC /></IconWrapper><SkillName>C</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaJs /></IconWrapper><SkillName>JavaScript</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiTypescript /></IconWrapper><SkillName>TypeScript</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaDatabase /></IconWrapper><SkillName>SQL</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiHtml5 /></IconWrapper><SkillName>HTML5</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiCss3 /></IconWrapper><SkillName>CSS3</SkillName></SkillCard>
        </SkillsGrid>
      </Category>

      <Category>
        <CategoryTitle>Frameworks & Libraries</CategoryTitle>
        <SkillsGrid>
          <SkillCard><IconWrapper><SiPytorch /></IconWrapper><SkillName>PyTorch</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiScikitlearn /></IconWrapper><SkillName>Scikit-learn</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiLangchain /></IconWrapper><SkillName>LangChain</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaProjectDiagram /></IconWrapper><SkillName>LangGraph</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiApachekafka /></IconWrapper><SkillName>Apache Kafka</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiFastapi /></IconWrapper><SkillName>FastAPI</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaCode /></IconWrapper><SkillName>Flask</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaReact /></IconWrapper><SkillName>React</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaReact /></IconWrapper><SkillName>React Native</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiAngular /></IconWrapper><SkillName>Angular</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiNodedotjs /></IconWrapper><SkillName>Node.js</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiTailwindcss /></IconWrapper><SkillName>TailwindCSS</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaDocker /></IconWrapper><SkillName>Docker</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiKubernetes /></IconWrapper><SkillName>Kubernetes</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiHelm /></IconWrapper><SkillName>Helm</SkillName></SkillCard>
        </SkillsGrid>
      </Category>

      <Category>
        <CategoryTitle>Tools & Infrastructure</CategoryTitle>
        <SkillsGrid>
          <SkillCard><IconWrapper><FaGitAlt /></IconWrapper><SkillName>Git / GitHub</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiAmazonwebservices /></IconWrapper><SkillName>AWS</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiOpensearch /></IconWrapper><SkillName>OpenSearch</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiPostman /></IconWrapper><SkillName>Postman</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiGnubash /></IconWrapper><SkillName>Bash</SkillName></SkillCard>
          <SkillCard><IconWrapper><SiRaspberrypi /></IconWrapper><SkillName>Raspberry Pi</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaCode /></IconWrapper><SkillName>REST APIs</SkillName></SkillCard>
          <SkillCard><IconWrapper><FaDatabase /></IconWrapper><SkillName>WebSocket</SkillName></SkillCard>
        </SkillsGrid>
      </Category>

      <CertSection id="certifications">
        <CategoryTitle>Certifications</CategoryTitle>
        <Grid>
          {certifications.map((cert, index) => (
            <CertCard key={index}>
              <CertTitle>{cert.title}</CertTitle>
              <CertOrg>{cert.org}</CertOrg>
              <CertBlurb>{cert.blurb}</CertBlurb>
            </CertCard>
          ))}
        </Grid>
      </CertSection>
    </SkillsWrapper>
  );
};

export default SkillsSection;