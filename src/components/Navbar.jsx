// The SMB status bar, standing in for a nav bar. The readouts are live: the
// score ticks up as you scroll, coins count the sections you've reached, and
// WORLD tracks whichever section you're currently in.
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { NES } from '../utils/pixelSprite';

// Each section gets a world number, the way the game labels its levels, plus
// the colour of the section itself so the bar melts into whatever is under it
// instead of sitting on the page as a black slab.
const WORLDS = [
  { id: 'hero', world: '1-1', bg: NES.sky },
  { id: 'about', world: '1-2', bg: '#3b9aff' },
  { id: 'experience', world: '1-3', bg: '#3b9aff' },
  { id: 'projects', world: '2-2', bg: NES.water },
  { id: 'skills', world: '1-4', bg: '#3b9aff' },
];

const START_TIME = 400;

const Bar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${({ $bg }) => $bg};
  color: ${NES.white};
  font-family: 'Press Start 2P', cursive;
  padding: 0.85rem 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  /* the HUD is unboxed like the game's, so the type needs its own contrast */
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.45);
  transition: background 0.45s ease;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 0.9rem;
    padding: 0.7rem 1rem;
  }
`;

const Stats = styled.div`
  display: flex;
  align-items: flex-start;
  gap: clamp(1rem, 3.5vw, 3rem);
`;

const Stat = styled.div`
  font-size: 0.6rem;
  line-height: 1.9;
  letter-spacing: 0.06em;
  white-space: nowrap;

  @media (max-width: 900px) {
    font-size: 0.5rem;
  }
`;

const Coin = styled.span`
  display: inline-block;
  width: 9px;
  height: 11px;
  margin-right: 6px;
  vertical-align: -1px;
  background: ${NES.qMid};
  box-shadow: inset 0 0 0 2px #fbd000, 0 0 0 2px ${NES.black};
`;

const Blink = styled.span`
  /* the game blinks the coin marker between frames */
  animation: coinBlink 0.8s steps(1) infinite;

  @keyframes coinBlink {
    50% {
      opacity: 0.35;
    }
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.7rem, 2vw, 1.6rem);
  flex-wrap: wrap;
  justify-content: center;
`;

/* The bar sits on a different blue in every section, so hover is an underline
   rather than a tint — any colour would have to read against all of them. */
const NavLink = styled(Link).attrs({ smooth: true, duration: 600, offset: -90 })`
  color: ${NES.white};
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  cursor: pointer;
  padding: 0.2rem 0;
  border-bottom: 3px solid transparent;
  transition: border-color 0.15s ease;

  /* colour is restated here on purpose: index.css still carries Vite's stock
     "a:hover { color: #535bf2 }", which outranks a plain styled class and
     would otherwise recolour the link on hover */
  &:hover,
  &.active {
    color: ${NES.white};
    border-bottom-color: ${NES.white};
  }

  @media (max-width: 900px) {
    font-size: 0.48rem;
  }
`;

const IconLink = styled.a`
  color: ${NES.white};
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  padding-bottom: 0.2rem;
  border-bottom: 3px solid transparent;
  transition: border-color 0.15s ease;

  &:hover {
    color: ${NES.white};
    border-bottom-color: ${NES.white};
  }
`;

const pad = (n, len) => String(Math.max(0, Math.floor(n))).padStart(len, '0');

const Navbar = () => {
  const [score, setScore] = useState(0);
  const [world, setWorld] = useState(0);
  // score and coins are winnings, not a scroll position: they only ever go up,
  // so backtracking doesn't take them away again
  const [coins, setCoins] = useState(0);
  const [time, setTime] = useState(START_TIME);
  const rafRef = useRef(0);

  useEffect(() => {
    const read = () => {
      rafRef.current = 0;
      const y = window.scrollY;
      setScore((s) => Math.max(s, Math.floor(y / 6)));

      // the current level is the last section whose top has passed the upper
      // third of the viewport
      const mark = window.innerHeight * 0.35;
      let current = 0;
      WORLDS.forEach((w, i) => {
        const el = document.getElementById(w.id);
        if (el && el.getBoundingClientRect().top <= mark) current = i;
      });
      // WORLD follows you back up the page; coins are banked
      setWorld((w) => (w === current ? w : current));
      setCoins((c) => Math.max(c, current));
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(read);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    read();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // the game's clock runs faster than real time
  useEffect(() => {
    const id = setInterval(() => setTime((t) => (t > 0 ? t - 1 : 0)), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <Bar $bg={WORLDS[world].bg}>
      <Stats>
        <Stat>
          MARIO
          <br />
          {pad(score, 6)}
        </Stat>
        <Stat>
          <Blink>
            <Coin />
          </Blink>
          x{pad(coins, 2)}
        </Stat>
        <Stat>
          WORLD
          <br />
          {WORLDS[world].world}
        </Stat>
        <Stat>
          TIME
          <br />
          {pad(time, 3)}
        </Stat>
      </Stats>

      <Links>
        <NavLink to="about">ABOUT</NavLink>
        <NavLink to="experience">EXPERIENCE</NavLink>
        <NavLink to="projects">PROJECTS</NavLink>
        <NavLink to="skills">SKILLS</NavLink>

        <IconLink
          href="https://www.linkedin.com/in/jasmehar-kaur"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <FaLinkedin />
        </IconLink>
        <IconLink
          href="/Jasmehar-Kaur-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Resume"
          title="Resume"
        >
          <FaFileAlt />
        </IconLink>
        <IconLink href="mailto:jasmehar.kr@gmail.com" aria-label="Email" title="Email">
          <FaEnvelope />
        </IconLink>
        <IconLink
          href="https://github.com/jasmehar-k"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <FaGithub />
        </IconLink>
      </Links>
    </Bar>
  );
};

export default Navbar;
