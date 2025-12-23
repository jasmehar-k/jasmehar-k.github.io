import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import flag from '../assets/flag.png'; 
import marioSlide from '../assets/mario_slide.png'; 

const ExperienceSection = styled.section`
  background-color: #3b9aff;
  padding: 5rem 2rem;
  font-family: 'Press Start 2P', cursive;
  position: relative;
  border-bottom: 4px solid #2f2f2f;

`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 8rem;
  color: #2f2f2f;
`;

const Timeline = styled.div`
  position: absolute;
  top: 10rem;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  background-color: #2f2f2f;
  @media (max-width: 600px) {
    display: none;
  }

`;

const Flag = styled.img`
  position: absolute;
  top: 10rem;
  left: calc(50%);
  width: 150px;
  image-rendering: pixelated;
  @media (max-width: 600px) {
    display: none;
  }

`;

const ExperienceItem = styled.div`
  position: relative;
  width: 50%;
  padding: 1rem 2rem;
  box-sizing: border-box;
  left: ${({ align }) => (align === 'left' ? '0' : '50%')};
  text-align: ${({ align }) => (align === 'left' ? 'right' : 'left')};

  &:not(:last-child) {
    margin-bottom: 4rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    text-align: left;
  }

  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none; /* Disable transform on hover for small screens */
    }
`;

const Connector = styled.div`
  position: absolute;
  top: 1rem;
  width: 20px;
  height: 20px;
  background-color: #ffcc00;
  border: 4px solid #2f2f2f;
  border-radius: 50%;
  left: ${({ align }) => (align === 'left' ? 'calc(100% - 10px)' : '-10px')};
  @media (max-width: 600px) {
    display: none;
  }

`;

const Card = styled.div`
  background-color: #fffab8;
  padding: 1rem 1.5rem;
  border: 4px solid #2f2f2f;
  box-shadow: inset -4px -4px 0 rgba(0, 0, 0, 0.2);
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const JobTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #2f2f2f;
`;

const Company = styled.div`
  font-weight: bold;
  font-size: 0.75rem;
  color: #444;
`;

const Duration = styled.div`
  font-size: 0.65rem;
  color: #666;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px dashed #2f2f2f;
  margin: 0.5rem 0;
`;

const DescriptionList = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  list-style-type: "-> ";
  line-height: 1.5;
  color: #333;
`;

const DescriptionItem = styled.li`
  margin-bottom: 0.5rem;
`;

const MarioSlide = styled.img`
  position: absolute;
  left: calc(50% - 30px);
  width: 50px;
  image-rendering: pixelated;
  transition: top 0.1s ease-out, opacity 0.3s;
  opacity: ${({ $animate }) => ($animate ? 1 : 0)};
  top: ${({ $top }) => `${$top}px`};
  z-index: 10;
  @media (max-width: 600px) {
    display: none;
  }
`;


const ExperienceData = [
  {
    title: 'Full-Stack and Machine Learning Developer Intern',
    company: 'Nokia',
    duration: 'April 2025 – Aug 2025',
    description: ['Built an LLM system to automate 5G alarm resolution',
      ' Leveraged vector-based RAG for high-relevance retrieval.',
      
      'Engineered and optimized a hybrid (dense + sparse) RAG pipeline in OpenSearch with multi-pass retrieval, boosting precision by 65% and recall by 58%.',
      
      'Developed scalable backend services with FastAPI and integrated semantic, lexical, and hybrid search for high-performance data retrieval.',
      
      'Designed and Developed interactive React frontends with modular components and dynamic theming.'],
    align: 'left',
  },
  {
    title: 'Software Developer Intern',
    company: 'Trexo Robotics',
    duration: 'July 2022 – Sep 2022',
    description: [
        'Designed and developed 3 production-deployed web apps to streamline database changes',
        'Saved the Customer Success team significant hours originally spent on manual edits' ,
        'Enhanced efficiency by automating manual processes involving multiple Postman requests',
        'Mitigated errors by providing a controlled interface for database changes',
        'Improved data traceability through logging mechanisms' 
        
    ],
    align: 'right',
  },
  {
    title: 'Head of Strategy and Scouting',
    company: 'Absolute Robotics',
    duration: '2022 – 2024',
    description: [
        'Led the team’s strategy development and robot design process',
        'Taught new members about app development, robot mechanics, and strategy development', 
        'Designed and built a user-friendly mobile app to collect data and track teams’ performances',
        'Developed a web-based app to collect and analyze scouting data through QR code scanning', 
        'Implemented data processing for scoring and strategy analysis'  
    ],
    align: 'left',
  }
];

const ExperienceTimeline = () => {
    const sectionRef = useRef(null);
    const [animateMario, setAnimateMario] = useState(false);
    const [marioTop, setMarioTop] = useState(160); // Start 10rem = 160px
    const marioRef = useRef();
    
    useEffect(() => {
        const handleScroll = () => {
          if (!sectionRef.current) return;
      
          const sectionTop = sectionRef.current.offsetTop;
          const sectionHeight = sectionRef.current.offsetHeight;
          const scrollY = window.scrollY + window.innerHeight / 2;
      
          // Show Mario if scrolled past the section top
          if (window.scrollY >= sectionTop) {
            setAnimateMario(true);
      
            // Calculate Mario's vertical position relative to the section top
            const relativeScroll = window.scrollY - sectionTop + 180; // 160 = 10rem offset
      
            // Clamp Mario's top so he stays within the section
            const maxTop = sectionHeight - 90; // 60 = Mario's height approx
            const newMarioTop = Math.min(relativeScroll, maxTop);
      
            setMarioTop(newMarioTop);
          } else {
            // Before scrolling to section, hide Mario or set initial position
            setAnimateMario(true);
            setMarioTop(180);
          }
        };
      
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call on mount
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);
      
      

  return (
    <ExperienceSection id="experience" ref={sectionRef}>
      <SectionTitle>Experience</SectionTitle>
      <Flag src={flag} alt="flag" />
      <Timeline />
      <MarioSlide src={marioSlide} ref={marioRef} $animate={animateMario} $top={marioTop}/>
      {ExperienceData.map((exp, index) => (
        <ExperienceItem key={index} align={exp.align}>
          <Connector align={exp.align} />
          <Card>
            <JobTitle>{exp.title}</JobTitle>
            <Company>{exp.company}</Company>
            <Duration>{exp.duration}</Duration>
            <Divider />
            <DescriptionList>
              {exp.description.map((item, idx) => (
                <DescriptionItem key={idx}>{item}</DescriptionItem>
              ))}
            </DescriptionList>
          </Card>
        </ExperienceItem>
      ))}
    </ExperienceSection>
  );
};

export default ExperienceTimeline;
