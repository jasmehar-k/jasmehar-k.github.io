import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-scroll';
import { FaLinkedin, FaGithub, FaEnvelope, FaFilePdf, FaFileAlt } from 'react-icons/fa';


const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background: #5b5b5b;
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;       // ✅ allow wrapping of navbar sections
  font-family: 'Press Start 2P', cursive;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;  // ✅ prevent cutting from padding
  overflow-x: auto;        // ✅ optional: horizontal scroll instead of cutting off
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }
`;


const NavSection = styled.div`
  display: flex;
  flex-wrap: wrap;       
  gap: 12px;
  justify-content: center;
`;



const PixelButton = styled.a`
  background-color: #ffcc00;
  color: #000;
  padding: 10px 16px;
  font-size: 0.6rem;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  text-decoration: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ffe066;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 #000;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 2px 2px 0 #000;
  }
`;

// const ScrollLink = styled(Link).attrs({
//   smooth: true,
//   duration: 500,
//   offset: -80, // account for navbar height
// })`
//   background-color: #ffcc00;
//   color: #000;
//   padding: 10px 16px;
//   font-size: 0.6rem;
//   border: 3px solid #000;
//   box-shadow: 4px 4px 0 #000;
//   text-decoration: none;
//   border-radius: 0;
//   cursor: pointer;
//   transition: all 0.2s ease;

//   &:hover {
//     background-color: #ffe066;
//     transform: translateY(-2px);
//     box-shadow: 6px 6px 0 #000;
//   }

//   &:active {
//     transform: translateY(2px);
//     box-shadow: 2px 2px 0 #000;
//   }
// `;


const IconButton = styled.a`
  background-color: #ffcc00;
  color: #000;
  padding: 10px 14px;
  font-size: 1.2rem;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  text-decoration: none;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ffe066;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 #000;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 2px 2px 0 #000;
  }
`;

const ScrollLink = styled(Link).attrs({
    smooth: true,
    duration: 500,
    offset: -80, 
})`
  background-color: #ffcc00;
  
  color: black;
  border: none;
  margin-top: ${({ marginTop }) => marginTop || '0'};
  padding: 0.75rem 1.5rem;
  font-size: 0.6rem;
  cursor: pointer;
  border: 4px solid #2f2f2f;
  box-shadow: inset -4px -4px 0px rgba(0,0,0,0.3);
  font-family: 'Press Start 2P', cursive;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: 6px 6px 0 #000;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: inset -2px -2px 0px rgba(0,0,0,0.3);
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <NavSection>
        <IconButton
          href="https://www.linkedin.com/in/jasmehar-kaur"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <FaLinkedin />
        </IconButton>
        <IconButton
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Resume"
          title="Resume"
        >
          <FaFileAlt />
        </IconButton>
        <IconButton
          href="mailto:jasmehar.kr@gmail.com"
          aria-label="Email"
          title="Email"
        >
          <FaEnvelope />
        </IconButton>
        <IconButton
          href="https://github.com/jasmehar-k"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <FaGithub />
        </IconButton>
      </NavSection>

      <NavSection>
        <ScrollLink to="skills" color="#ffcc00">Skills</ScrollLink>
        <ScrollLink to="experience" color="#ffcc00">Experience</ScrollLink>
        <ScrollLink to="projects" color="#ffcc00">Projects</ScrollLink>
      </NavSection>
    </Nav>
  );
};

export default Navbar;
