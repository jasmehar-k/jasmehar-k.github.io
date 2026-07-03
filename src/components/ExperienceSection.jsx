// ExperienceSection.jsx — world 1-4, castle
import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import marioSlide from '../assets/mario_slide.png';
import WorldPlaque from './WorldPlaque';

const flicker = keyframes`
  0%, 100% { box-shadow: 0 0 14px 4px rgba(255, 123, 61, 0.55); }
  50%      { box-shadow: 0 0 22px 7px rgba(255, 123, 61, 0.8); }
`;

const SectionWrapper = styled.section`
  position: relative;
  padding: 5rem 2rem 6rem;
  border-bottom: 4px solid #000;
  /* castle brickwork */
  background:
    repeating-linear-gradient(90deg, transparent 0 74px, rgba(0, 0, 0, 0.5) 74px 78px),
    repeating-linear-gradient(0deg, transparent 0 33px, rgba(0, 0, 0, 0.5) 33px 37px),
    linear-gradient(180deg, #26262e 0%, var(--castle-bg) 100%);
`;

const Timeline = styled.div`
  position: absolute;
  top: 14rem;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  background: #3c3c46;
  border: 3px solid #000;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ExperienceItem = styled.div`
  position: relative;
  width: 50%;
  padding: 1rem 2.4rem;
  box-sizing: border-box;
  left: ${({ align }) => (align === 'left' ? '0' : '50%')};

  &:not(:last-child) {
    margin-bottom: 3.4rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    padding: 1rem 0;
  }
`;

/* wall torch marking each checkpoint */
const Torch = styled.div`
  position: absolute;
  top: 1.4rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #ffd265, var(--castle-glow));
  border: 3px solid #000;
  animation: ${flicker} 1.6s ease-in-out infinite;
  left: ${({ align }) => (align === 'left' ? 'calc(100% - 12px)' : '-12px')};

  @media (max-width: 768px) {
    display: none;
  }
`;

const Card = styled.div`
  background: #2b2b35;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.55), inset 3px 3px 0 rgba(255, 255, 255, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-align: left;
`;

const IncomingTag = styled.span`
  align-self: flex-start;
  background: var(--pipe);
  color: #fff;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  padding: 0.3rem 0.5rem;
  font-family: var(--font-pixel);
  font-size: 0.5rem;
  letter-spacing: 1px;
`;

const JobTitle = styled.h3`
  margin: 0;
  font-family: var(--font-pixel);
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--gold);
`;

const Company = styled.div`
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  color: #fffef7;
`;

const Duration = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--castle-stone);
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px dashed #4a4a56;
  margin: 0.5rem 0;
  width: 100%;
`;

const SlideArea = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
`;

const ArrowButton = styled.button`
  font-family: var(--font-pixel);
  background: var(--mario-red);
  color: #fff;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  cursor: pointer;
  padding: 0 0.6rem;
  font-size: 0.7rem;
  line-height: 1;
  flex-shrink: 0;

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 #000;
  }

  &:disabled {
    background: #4a4a56;
    opacity: 0.55;
    cursor: default;
    transform: none;
    box-shadow: 3px 3px 0 #000;
  }
`;

const SlideText = styled.p`
  margin: 0;
  flex: 1;
  min-height: 5rem;
  display: flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgba(255, 254, 247, 0.88);
`;

const SlideFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  padding: 0;
  border: 2px solid #000;
  background: ${({ $active }) => ($active ? 'var(--mario-red)' : '#4a4a56')};
  cursor: pointer;
`;

const MarioSlideImg = styled.img`
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
    upcoming: true,
    title: 'Software Development Engineer Intern',
    company: 'Amazon Web Services',
    duration: 'Sep 2026 - Dec 2026',
    description: [
      'Joining the Aurora open source control plane team as a Software Development Engineer Intern.',
    ],
    align: 'left',
  },
  {
    title: 'Software Developer',
    company: 'Royal Bank of Canada',
    duration: 'Jan 2026 – May 2026',
    description: [
      'Built a Kafka producer in Java to stream household portfolio data for 4 million clients to downstream teams, enabling real-time cross-team data access at scale.',
      'Designed and implemented backend features integrating with Microsoft SQL Server, supporting relational workflows processing 50 thousand records per transaction cycle.',
      'Optimized SQL queries, joins, and stored procedures to reduce query latency by 37%, resolving multi-threaded service bottlenecks across normalized schemas.',
      'Resolved 30+ dependency CVEs surfaced by Aqua and Snyk, and built DAST and SAST test pipelines from scratch, reducing security exposure across the portfolio modelling application.',
    ],
    align: 'right',
  },
  {
    title: 'Full-Stack and Machine Learning Developer Intern',
    company: 'Nokia',
    duration: 'April 2025 – Aug 2025',
    description: [
      'Built an LLM system to automate 5G alarm resolution, leveraging vector-based RAG for high-relevance retrieval.',
      'Engineered and optimized a hybrid (dense + sparse) RAG pipeline in OpenSearch with multi-pass retrieval, boosting precision by 65% and recall by 58%.',
      'Developed scalable backend services with FastAPI and integrated semantic, lexical, and hybrid search for high-performance data retrieval.',
      'Designed and developed interactive React frontends with modular components and dynamic theming.',
    ],
    align: 'left',
  },
  {
    title: 'Software Developer Intern',
    company: 'Trexo Robotics',
    duration: 'July 2022 – Sep 2022',
    description: [
      'Designed and developed 3 production-deployed web apps to streamline database changes.',
      'Saved the Customer Success team significant hours originally spent on manual edits.',
      'Enhanced efficiency by automating manual processes involving multiple Postman requests.',
      'Mitigated errors by providing a controlled interface for database changes.',
      'Improved data traceability through logging mechanisms.',
    ],
    align: 'right',
  },
  {
    title: 'Head of Strategy and Scouting',
    company: 'Absolute Robotics',
    duration: '2022 – 2024',
    description: [
      'Led the team’s strategy development and robot design process.',
      'Taught new members about app development, robot mechanics, and strategy development.',
      'Designed and built a user-friendly mobile app to collect data and track teams’ performances.',
      'Developed a web-based app to collect and analyze scouting data through QR code scanning.',
      'Implemented data processing for scoring and strategy analysis.',
    ],
    align: 'left',
  },
];

const ExperienceCard = ({ exp }) => {
  const [slide, setSlide] = useState(0);
  const total = exp.description.length;

  const prev = () => setSlide((s) => Math.max(0, s - 1));
  const next = () => setSlide((s) => Math.min(total - 1, s + 1));

  return (
    <Card>
      {exp.upcoming && <IncomingTag>INCOMING</IncomingTag>}
      <JobTitle>{exp.title}</JobTitle>
      <Company>{exp.company}</Company>
      <Duration>{exp.duration}</Duration>
      <Divider />
      <SlideArea>
        <ArrowButton onClick={prev} disabled={slide === 0} aria-label="previous">
          {'<'}
        </ArrowButton>
        <SlideText>{exp.description[slide].trim()}</SlideText>
        <ArrowButton onClick={next} disabled={slide === total - 1} aria-label="next">
          {'>'}
        </ArrowButton>
      </SlideArea>
      <SlideFooter>
        {exp.description.map((_, i) => (
          <Dot key={i} $active={i === slide} onClick={() => setSlide(i)} aria-label={`slide ${i + 1}`} />
        ))}
      </SlideFooter>
    </Card>
  );
};

const ExperienceTimeline = () => {
  const sectionRef = useRef(null);
  const [animateMario, setAnimateMario] = useState(false);
  const [marioTop, setMarioTop] = useState(180);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;

      if (window.scrollY >= sectionTop) {
        setAnimateMario(true);
        const relativeScroll = window.scrollY - sectionTop + 180;
        const maxTop = sectionHeight - 90;
        setMarioTop(Math.min(relativeScroll, maxTop));
      } else {
        setAnimateMario(true);
        setMarioTop(180);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SectionWrapper id="experience" ref={sectionRef}>
      <WorldPlaque world="1-4" name="EXPERIENCE" light />
      <Timeline />
      <MarioSlideImg src={marioSlide} $animate={animateMario} $top={marioTop} alt="" />
      {ExperienceData.map((exp, index) => (
        <ExperienceItem key={index} align={exp.align}>
          <Torch align={exp.align} />
          <ExperienceCard exp={exp} />
        </ExperienceItem>
      ))}
    </SectionWrapper>
  );
};

export default ExperienceTimeline;
