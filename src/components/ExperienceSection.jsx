import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { overworld } from '../utils/overworldArt';
import { NES } from '../utils/pixelSprite';
import { marioSprite } from '../utils/marioSprite';
import marioStand from '../assets/mario_slide.png';
import climbA from '../assets/mario_climb_a.png';
import climbB from '../assets/mario_climb_b.png';

const TILE = 40;
const GROUND_H = TILE * 2;
const VINE_W = 40;
const VINE_TOP = 210; // where the vine emerges from its block
const CHAR_H = 76;
const CHAR_W = 52;

// Two stills cut from the run gif, cropped to a shared box so he stays
// registered as the limbs change. Alternating them off scroll distance rather
// than playing the gif keeps the climb at the pace you are actually scrolling.
// The crops are 110x145 with 140px of character, hence the frame height.
const CLIMB_FRAME_H = Math.round((CHAR_H * 145) / 140);
const SWAP_PX = 22; // travel between frame swaps

// Climbing alternates two stills off scroll distance. At the foot of the vine he
// lets go and just stands there — the frame is derived from his *clamped*
// position, so once he can descend no further it stops advancing on its own and
// his legs go still however much further you scroll.
const CLIMB = { frame: CLIMB_FRAME_H, drop: 0, nudge: 0 };
const STAND = marioSprite('idle', CHAR_H);

const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

const drift = keyframes`
  from { transform: translateX(-220px); }
  to   { transform: translateX(calc(100vw + 220px)); }
`;

const ExperienceSection = styled.section`
  background-color: ${NES.sky};
  padding: 5rem 2rem ${GROUND_H + 70}px;
  font-family: 'Press Start 2P', cursive;
  position: relative;
  overflow: hidden;
`;

const Cloud = styled.div`
  position: absolute;
  /* a fraction of the section, so they carry the whole way down rather than
     bunching at the top; the lowest stops well clear of the bushes */
  top: ${({ $top }) => $top};
  width: ${({ $w }) => $w}px;
  height: ${({ $w }) => Math.round(($w * 10) / 32)}px;
  background-image: ${overworld.cloud};
  background-size: 100% 100%;
  image-rendering: pixelated;
  animation: ${drift} linear infinite;
  z-index: 0;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Ground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${GROUND_H}px;
  background-image: ${overworld.soil};
  background-size: ${TILE}px ${TILE}px;
  background-repeat: repeat;
  image-rendering: pixelated;
  z-index: 5;
`;

const Bush = styled.div`
  position: absolute;
  bottom: ${GROUND_H}px;
  width: ${({ $w }) => $w}px;
  height: ${({ $w }) => Math.round(($w * 7) / 24)}px;
  background-image: ${overworld.bush};
  background-size: 100% 100%;
  image-rendering: pixelated;
  z-index: 4;
  pointer-events: none;

  @media (max-width: 900px) {
    display: none;
  }
`;

const SectionTitle = styled.h2`
  position: relative;
  z-index: 1; /* above the clouds, which are positioned and would cover it */
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 8rem;
  color: #2f2f2f;
`;

/* The stem thins and curls over at the top, so the vine reads as a growing
   shoot rather than a bar chopped off mid-air. */
const VineTip = styled.div`
  position: absolute;
  top: ${VINE_TOP}px;
  left: 50%;
  width: ${VINE_W}px;
  height: ${VINE_W}px;
  margin-left: -${VINE_W / 2}px;
  background-image: ${overworld.vineTip};
  background-size: 100% 100%;
  image-rendering: pixelated;
  z-index: 1;

  @media (max-width: 600px) {
    display: none;
  }
`;

/* The vine tile repeats down the section, so the leaves keep alternating
   whatever the section's height turns out to be. */
const Vine = styled.div`
  position: absolute;
  top: ${VINE_TOP + VINE_W}px;
  bottom: ${GROUND_H}px;
  left: 50%;
  width: ${VINE_W}px;
  margin-left: -${VINE_W / 2}px;
  background-image: ${overworld.vine};
  background-size: ${VINE_W}px ${VINE_W}px;
  background-repeat: repeat-y;
  image-rendering: pixelated;
  z-index: 1;

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

const Card = styled.div`
  background-color: #f8b800;
  /* four corner rivets, like a ? block */
  background-image:
    linear-gradient(#2f2f2f, #2f2f2f),
    linear-gradient(#2f2f2f, #2f2f2f),
    linear-gradient(#2f2f2f, #2f2f2f),
    linear-gradient(#2f2f2f, #2f2f2f);
  background-repeat: no-repeat;
  background-size: 7px 7px;
  background-position:
    7px 7px,
    calc(100% - 7px) 7px,
    7px calc(100% - 7px),
    calc(100% - 7px) calc(100% - 7px);
  padding: 1.5rem 1.5rem;
  border: 4px solid #2f2f2f;
  box-shadow:
    6px 6px 0 #2f2f2f,
    inset 4px 4px 0 rgba(255, 255, 255, 0.4),
    inset -5px -5px 0 rgba(180, 100, 0, 0.45);
  font-size: 0.75rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  image-rendering: pixelated;
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

const SlideArea = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
`;

const ArrowButton = styled.button`
  font-family: 'Press Start 2P', cursive;
  background-color: #e52521;
  color: #fff;
  border: 3px solid #2f2f2f;
  box-shadow: 3px 3px 0 #2f2f2f;
  cursor: pointer;
  padding: 0 0.6rem;
  font-size: 0.7rem;
  line-height: 1;
  flex-shrink: 0;
  image-rendering: pixelated;

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 #2f2f2f;
  }

  &:disabled {
    background-color: #b8b8b8;
    box-shadow: 3px 3px 0 #2f2f2f;
    opacity: 0.5;
    cursor: default;
    transform: none;
  }
`;

const SlideText = styled.p`
  margin: 0;
  flex: 1;
  min-height: 5rem;
  display: flex;
  align-items: center;
  line-height: 1.7;
  color: #333;
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
  border: 2px solid #2f2f2f;
  background-color: ${({ $active }) => ($active ? '#e52521' : '#fff6da')};
  cursor: pointer;
  image-rendering: pixelated;
`;

const IncomingTag = styled.span`
  align-self: flex-start;
  background-color: #43b047;
  color: #fff;
  border: 2px solid #2f2f2f;
  box-shadow: 2px 2px 0 #2f2f2f;
  padding: 0.3rem 0.5rem;
  font-size: 0.55rem;
  letter-spacing: 1px;
`;

/* He hangs on the vine rather than beside it: the box is nudged right of centre
   so the stem runs behind his body. */
const Climber = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: ${CHAR_W}px;
  height: ${CHAR_H}px;
  margin-left: -${CHAR_W / 2 - 6}px;
  z-index: 3;
  pointer-events: none;
  will-change: transform;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ClimberSprite = styled.img`
  position: absolute;
  left: 50%;
  bottom: ${({ $drop }) => -$drop}px;
  height: ${({ $frame }) => $frame}px;
  width: auto;
  max-width: none;
  /* mirrored to face the vine while climbing, the right way round once he lets
     go and runs off */
  transform: translateX(calc(-50% - ${({ $nudge }) => $nudge}px))
    scaleX(${({ $flip }) => ($flip ? -1 : 1)});
  image-rendering: pixelated;
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
          <Dot
            key={i}
            $active={i === slide}
            onClick={() => setSlide(i)}
            aria-label={`slide ${i + 1}`}
          />
        ))}
      </SlideFooter>
    </Card>
  );
};

const CLOUDS = [
  { top: '5%', w: 170, dur: 100, delay: 0 },
  { top: '19%', w: 120, dur: 76, delay: -34 },
  { top: '33%', w: 200, dur: 124, delay: -62 },
  { top: '47%', w: 140, dur: 92, delay: -18 },
  { top: '61%', w: 180, dur: 110, delay: -80 },
  { top: '74%', w: 130, dur: 84, delay: -45 },
];

const BUSHES = [
  { left: '6%', w: 150 },
  { left: '78%', w: 120 },
];

const ExperienceTimeline = () => {
  const sectionRef = useRef(null);
  const climberRef = useRef(null);
  const rafRef = useRef(0);
  const [step, setStep] = useState(0);
  const [atFoot, setAtFoot] = useState(false);

  // Vertical position and the climb frame come out of the scroll offset. The
  // transform is written straight to the node because this runs every scroll
  // frame; the two state values only change on a frame swap or at the handoff.
  const place = useCallback(() => {
    rafRef.current = 0;
    const el = sectionRef.current;
    const climber = climberRef.current;
    if (!el || !climber) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const top = VINE_TOP + VINE_W + 8; // starts below the curled tip
    const floor = rect.height - GROUND_H - CHAR_H - 6;
    const rawY = vh * 0.45 - rect.top;
    const y = clamp(rawY, top, Math.max(top, floor));

    climber.style.transform = `translateY(${y}px)`;

    // At the foot of the vine he lets go and stands. The margin stops him
    // flicking between poses if you hover right on the boundary.
    setAtFoot((v) => {
      if (rawY >= floor) return true;
      if (rawY < floor - 40) return false;
      return v;
    });

    // frames advance with distance climbed, so the climb keeps pace with however
    // fast you scroll — and reverses when you scroll back up
    const frame = Math.floor(y / SWAP_PX) % 2;
    setStep((f) => (f === frame ? f : frame));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(place);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', place);
    place();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', place);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [place]);

  const sprite = atFoot ? STAND : CLIMB;
  const src = atFoot ? marioStand : (step === 0 ? climbA : climbB);

  return (
    <ExperienceSection id="experience" ref={sectionRef}>
      {CLOUDS.map((c) => (
        <Cloud
          key={c.top}
          $top={c.top}
          $w={c.w}
          style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
        />
      ))}

      <SectionTitle>Experience</SectionTitle>

      <VineTip />
      <Vine />

      <Climber ref={climberRef}>
        <ClimberSprite
          src={src}
          $frame={sprite.frame}
          $drop={sprite.drop}
          $nudge={atFoot ? sprite.nudge : 0}
          $flip={!atFoot}
          alt=""
          aria-hidden="true"
        />
      </Climber>

      {ExperienceData.map((exp, index) => (
        <ExperienceItem key={index} align={exp.align}>
          <ExperienceCard exp={exp} />
        </ExperienceItem>
      ))}

      {BUSHES.map((b) => (
        <Bush key={b.left} $w={b.w} style={{ left: b.left }} />
      ))}

      <Ground />
    </ExperienceSection>
  );
};

export default ExperienceTimeline;
