import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaFileAlt, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { toggleMute, useMuted } from '../hooks/useSound';

const Bar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: var(--hud-h);
  padding: 0.7rem 1.4rem 0.3rem;
  background: transparent;
  font-family: var(--font-pixel);
  color: #fcfcfc;
  flex-wrap: wrap;
  pointer-events: none;

  a, button {
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    justify-content: center;
    row-gap: 0.4rem;
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.55rem;
  letter-spacing: 0.05em;
`;

const StatLabel = styled.span`
  color: var(--paper);
`;

const StatValue = styled.span`
  color: #fcfcfc;
`;

const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  @media (max-width: 900px) {
    gap: 1rem;
  }
`;

const HideOnMobile = styled.div`
  display: contents;
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const NavLink = styled(Link)`
  font-size: 0.5rem;
  color: var(--paper);
  text-decoration: none;
  cursor: pointer;
  padding: 0.35rem 0.2rem;
  border-bottom: 3px solid transparent;

  &:hover {
    color: var(--gold);
  }

  &.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }
`;

const IconLink = styled.a`
  color: var(--paper);
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: var(--gold);
  }
`;

const MuteButton = styled.button`
  background: none;
  border: none;
  color: var(--paper);
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem;

  &:hover {
    color: var(--gold);
  }
`;

const WORLD_BY_SECTION = {
  hero: '1-1',
  about: '1-1',
  skills: '1-2',
  experience: '1-4',
  projects: '2-2',
  end: '8-4',
};

const NAV_ITEMS = [
  { label: 'ABOUT', to: 'about' },
  { label: 'SKILLS', to: 'skills' },
  { label: 'EXP', to: 'experience' },
  { label: 'PROJECTS', to: 'projects' },
];

export default function StatusBar() {
  const [world, setWorld] = useState('1-1');
  const [time, setTime] = useState(999);
  const muted = useMuted();

  // classic SMB timer, counts down and just stops at zero
  useEffect(() => {
    const id = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // scrollspy: which world is on screen
  useEffect(() => {
    const sections = Object.keys(WORLD_BY_SECTION)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setWorld(WORLD_BY_SECTION[entry.target.id]);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <Bar>
      <StatGroup>
        <HideOnMobile>
          <Stat>
            <StatLabel>JASMEHAR</StatLabel>
            <StatValue>SWE @ UWATERLOO</StatValue>
          </Stat>
        </HideOnMobile>
        <Stat>
          <StatLabel>WORLD</StatLabel>
          <StatValue>{world}</StatValue>
        </Stat>
        <HideOnMobile>
          <Stat>
            <StatLabel>TIME</StatLabel>
            <StatValue>{String(time).padStart(3, '0')}</StatValue>
          </Stat>
        </HideOnMobile>
      </StatGroup>

      <NavGroup>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            smooth
            duration={500}
            offset={-56}
            spy
            activeClass="active"
          >
            {item.label}
          </NavLink>
        ))}
        <IconLink href="/Jasmehar-Kaur-Resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Resume">
          <FaFileAlt />
        </IconLink>
        <IconLink href="https://github.com/jasmehar-k" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </IconLink>
        <IconLink href="https://linkedin.com/in/jasmehar-kaur" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </IconLink>
        <MuteButton onClick={toggleMute} aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}>
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </MuteButton>
      </NavGroup>
    </Bar>
  );
}
