// import React from 'react';
// import styled, { keyframes } from 'styled-components';
// import { Link } from 'react-scroll';

// import bg from '../assets/hero_bg.png'; 
// import cloud from '../assets/cloud.png';
// import piranha_plant from '../assets/piranha_plant.png';
// import short_pipe from '../assets/short_pipe.png';

// const bounceIn = keyframes`
//   0% {
//     transform: translateY(-200%);
//     opacity: 0;
//   }
//   60% {
//     transform: translateY(20%);
//     opacity: 1;
//   }
//   80% {
//     transform: translateY(-10%);
//   }
//   100% {
//     transform: translateY(0);
//   }
// `;

// const float = keyframes`
//   0% { transform: translateY(0); }
//   50% { transform: translateY(-4px); }
//   100% { transform: translateY(0); }
// `;

// const typing = keyframes`
//   from { width: 0 }
//   to { width: 100% }
// `;

// // Blinking cursor animation
// const blink = keyframes`
//   0% { border-right-color: rgba(0, 0, 0, 0.3); }
//   50% { border-right-color: transparent; }
//   100% { border-right-color: rgba(0, 0, 0, 0.3); }
// `;


// const driftLeftToRight = keyframes`
//   0% {
//     left: -500px;
//   }
//   100% {
//     left: 110%;
//   }
// `;

// const driftRightToLeft = keyframes`
//   0% {
//     right: -1px;
//   }
//   100% {
//     right: 110%;
//   }
// `;

// const driftFromCenterToRight = keyframes`
//   0% {
//     left: calc(50% - 250px); /* center the 500px wide cloud */
//   }
//   100% {
//     left: 110%;
//   }
// `;

// const riseFromBottom = keyframes`
//     0% {
//         bottom: 110px;
//     }
//     100% {
//         bottom: 190;
//     }
// `;


// const HeroContainer = styled.div`
//     position: relative;
//     background-image: url(${bg});
//     background-size: cover;
//     background-color: #5dc3ff;
//     width: 100vw;
//     height: 100vh;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     font-family: 'Press Start 2P', cursive;
//     position: relative;
//     overflow: hidden;
// `;


// const MessageBox = styled.div`
//   background-color: #7bb662;
//   border: 8px solid #2f2f2f;
//   padding: 2rem 4rem;
//   font-size: 1.5rem;
//   color: white;
//   margin-bottom: 2rem;
//   margin-top: 10rem;
//   box-shadow: 0 0 0 8px #b6e67d;
//   z-index: 2;
// `;

// const TypingTitle = styled.h1`
//   color: white;
//   font-size: 2rem;
//   white-space: nowrap;
//   overflow: hidden;
//   border-right: 2px solid rgba(0, 0, 0, 0.3);
//   width: 0;
//   animation: ${typing} 3.5s steps(25, end) forwards, ${blink} 0.75s step-end infinite;
//   margin-bottom: 2rem;
// `;

// const Title = styled.h1`
//   color: white; /* Coin gold */
//   font-size: 2rem;
//   text-align: center;
//   margin-bottom: 2rem;
//   animation: ${bounceIn} 1s ease-out, ${float} 2.5s ease-in-out infinite;
// `;



// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
// `;

// const PixelButton = styled.button`
//   background-color: ${({ color }) => color || '#fff'};
//   color: white;
//   border: none;
//   padding: 0.75rem 1.5rem;
//   font-size: 1rem;
//   cursor: pointer;
//   border: 4px solid #2f2f2f;
//   box-shadow: inset -4px -4px 0px rgba(0,0,0,0.3);
//   font-family: 'Press Start 2P', cursive;

//   &:hover {
//     filter: brightness(1.1);
//   }
// `;

// const HUD = styled.div`
//   position: absolute;
//   top: 20px;
//   left: 50%;
//   transform: translateX(-50%);
//   display: flex;
//   align-items: center;
// `;

// const HeartBar = styled.div`
//   background: gray;
//   width: 200px;
//   height: 20px;
//   border: 4px solid #2f2f2f;
//   position: relative;
//   margin-left: 10px;
// `;

// const HeartFill = styled.div`
//   background: red;
//   width: 40%; /* Example: 40% filled */
//   height: 100%;
// `;

// const SceneImage = styled.img`
//   position: absolute;
//   z-index: 1;
// `;

// const CloudLeftToRight = styled.img`
//   position: absolute;
//   top: 50px;
//   width: 500px;
//   animation: ${driftLeftToRight} 120s linear infinite;
//   image-rendering: pixelated;
//   z-index: 0;
// `;

// const CloudRightToLeft = styled.img`
//   position: absolute;
//   top: 100px;
//   right: -500px;
//   width: 500px;
//   animation: ${driftRightToLeft} 120s lineaxr infinite;
//   image-rendering: pixelated;
//   z-index: 0;
// `;
// const CloudCenterToRight = styled.img`
//   position: absolute;
//   top: 90px;
//   width: 400px;
//   animation: ${driftFromCenterToRight} 60s linear forwards;
//   image-rendering: pixelated;
//   z-index: 0;
// `;

// const PiranhaPlant = styled.img`
//     position: absolute;
//     bottom: 0;
//     right: 10;
//     width: 200px;
//     animation: ${riseFromBottom} 10s ease-in-out infinite alternate;
// `;

// const ShortPipe = styled.img`
//     position: absolute;
//     bottom: 100px;
//     width: 100px;
// `;

// // const ScrollButton = styled.button`
// //   margin-top: 3rem;
// //   padding: 16px 24px;
// //   font-size: 0.7rem;
// //   font-family: 'Press Start 2P', cursive;
// //   background-color: #ffcc00; /* Coin gold */
// //   color: #000;
// //   border: 4px solid #000;
// //   border-radius: 0;
// //   cursor: pointer;
// //   box-shadow: 4px 4px 0 #000;
// //   transition: all 0.2s ease;

// //   &:hover {
// //     background-color: #ffe066;
// //     transform: translateY(-2px);
// //     box-shadow: 6px 6px 0 #000;
// //   }

// //   &:active {
// //     transform: translateY(2px);
// //     box-shadow: 2px 2px 0 #000;
// //   }
// // `;

// const ScrollButton = styled(Link)`
//   background-color: ${({ color }) => color || '#fff'};
//   color: white;
//   border: none;
//   margin-top: ${({ marginTop }) => marginTop || '0'};
//   padding: 0.75rem 1.5rem;
//   font-size: 1rem;
//   cursor: pointer;
//   border: 4px solid #2f2f2f;
//   box-shadow: inset -4px -4px 0px rgba(0,0,0,0.3);
//   font-family: 'Press Start 2P', cursive;
//   text-decoration: none;
//   display: inline-block;
//   transition: all 0.2s ease;

//   &:hover {
//     filter: brightness(1.1);
//   }

//   &:active {
//     transform: translateY(2px);
//     box-shadow: inset -2px -2px 0px rgba(0,0,0,0.3);
//   }
// `;



// const HeroSection = () => {
//   return (
//     <HeroContainer>
//         <CloudLeftToRight src={cloud} style={{ top: '30px', left: '-500px', animationDuration: '100s',animationDelay: '25s'}} />
//         <CloudLeftToRight src={cloud} style={{ top: '120px', left: '100px', animationDuration: '70s'}} />
//         <CloudCenterToRight src={cloud} style={{ top: '90px', left: '100px', animationDuration: '60s'}} />



//         <MessageBox>
//             <TypingTitle>HI! I'M JASMEHAR</TypingTitle>
//         </MessageBox>

//         <ButtonGroup>
//             <ScrollButton to="projects" smooth={true} duration={500}color="#5fbb5a">PROJECTS</ScrollButton>
//             <ScrollButton to="skills" smooth={true} duration={500} color="#fbbc04">SKILLS</ScrollButton>
//             <ScrollButton to="experience" smooth={true} duration={500}color="#ea4335">EXPERIENCE</ScrollButton>
//         </ButtonGroup>
//             <ScrollButton to="about" smooth={true} duration={500} color="#727678" marginTop="2rem">↓ About Me</ScrollButton>

//             <PiranhaPlant src={piranha_plant} style={{ right: '50px', bottom: '370px', width: '250px' }} />
//             <ShortPipe src={short_pipe} style={{ right: '-100px', bottom: '100px', width: '400px' }} />
//     </HeroContainer>
//   );
// };

// export default HeroSection;


import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-scroll';

import bg from '../assets/hero_bg.png'; 
import cloud from '../assets/cloud.png';
import piranha_plant from '../assets/piranha_plant.png';
import short_pipe from '../assets/short_pipe.png';

const bounceIn = keyframes`
  0% {
    transform: translateY(-200%);
    opacity: 0;
  }
  60% {
    transform: translateY(20%);
    opacity: 1;
  }
  80% {
    transform: translateY(-10%);
  }
  100% {
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

// Blinking cursor animation
const blink = keyframes`
  0% { border-right-color: rgba(0, 0, 0, 0.3); }
  50% { border-right-color: transparent; }
  100% { border-right-color: rgba(0, 0, 0, 0.3); }
`;


const driftLeftToRight = keyframes`
  0% {
    left: -500px;
  }
  100% {
    left: 110%;
  }
`;

const driftRightToLeft = keyframes`
  0% {
    right: -1px;
  }
  100% {
    right: 110%;
  }
`;

const driftFromCenterToRight = keyframes`
  0% {
    left: calc(50% - 250px); /* center the 500px wide cloud */
  }
  100% {
    left: 110%;
  }
`;

const riseFromBottom = keyframes`
    0% {
        bottom: 110px;
    }
    100% {
        bottom: 190;
    }
`;


const HeroContainer = styled.div`
    position: relative;
    background-image: url(${bg});
    background-size: cover;
    background-color: #5dc3ff;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Press Start 2P', cursive;
    position: relative;
    overflow: hidden;
    padding: 2rem;
    @media (max-width: 768px) {
        padding: 1rem;
  }
`;


const MessageBox = styled.div`
  background-color: #7bb662;
  border: 8px solid #2f2f2f;
  padding: 2rem 4rem;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 2rem;
  margin-top: 10rem;
  box-shadow: 0 0 0 8px #b6e67d;
  z-index: 2;
    font-size: 1.2rem;
  padding: 1.5rem 2rem;
  margin: 4rem 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 1rem 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 0.8rem 1rem;
  }
`;

const TypingTitle = styled.h1`
  color: white;
  font-size: 2rem;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid rgba(0, 0, 0, 0.3);
  width: 0;
  animation: ${typing} 3.5s steps(25, end) forwards, ${blink} 0.75s step-end infinite;
  margin-bottom: 2rem;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Title = styled.h1`
  color: white; /* Coin gold */
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  animation: ${bounceIn} 1s ease-out, ${float} 2.5s ease-in-out infinite;
`;



const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const PixelButton = styled.button`
  background-color: ${({ color }) => color || '#fff'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border: 4px solid #2f2f2f;
  box-shadow: inset -4px -4px 0px rgba(0,0,0,0.3);
  font-family: 'Press Start 2P', cursive;

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 0.4rem 0.8rem;
  }

  &:hover {
    filter: brightness(1.1);
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none; /* Disable transform on hover for small screens */
    }
`;

const HUD = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
`;

const HeartBar = styled.div`
  background: gray;
  width: 200px;
  height: 20px;
  border: 4px solid #2f2f2f;
  position: relative;
  margin-left: 10px;
`;

const HeartFill = styled.div`
  background: red;
  width: 40%; /* Example: 40% filled */
  height: 100%;
`;

const SceneImage = styled.img`
  position: absolute;
  z-index: 1;
`;

const CloudLeftToRight = styled.img`
  position: absolute;
  top: 50px;
  width: 500px;
  animation: ${driftLeftToRight} 120s linear infinite;
  image-rendering: pixelated;
  z-index: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;

const CloudRightToLeft = styled.img`
  position: absolute;
  top: 100px;
  right: -500px;
  width: 500px;
  animation: ${driftRightToLeft} 120s lineaxr infinite;
  image-rendering: pixelated;
  z-index: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;
const CloudCenterToRight = styled.img`
  position: absolute;
  top: 90px;
  width: 400px;
  animation: ${driftFromCenterToRight} 60s linear forwards;
  image-rendering: pixelated;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const PiranhaPlant = styled.img`
    position: absolute;
    bottom: 0;
    right: 12;
    width: 150px;
    animation: ${riseFromBottom} 10s ease-in-out infinite alternate;
    @media (max-width: 1110px) {
        display: none;
  }
`;

const ShortPipe = styled.img`
    position: absolute;
    bottom: 100px;
    width: 400px;
    @media (max-width: 768px) {
        width: 150px;
    }

  @media (max-width: 1110px) {
    display: none;
  }
`;

// const ScrollButton = styled.button`
//   margin-top: 3rem;
//   padding: 16px 24px;
//   font-size: 0.7rem;
//   font-family: 'Press Start 2P', cursive;
//   background-color: #ffcc00; /* Coin gold */
//   color: #000;
//   border: 4px solid #000;
//   border-radius: 0;
//   cursor: pointer;
//   box-shadow: 4px 4px 0 #000;
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

const ScrollButton = styled(Link)`
  background-color: ${({ color }) => color || '#fff'};
  color: white;
  border: none;
  margin-top: ${({ marginTop }) => marginTop || '0'};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border: 4px solid #2f2f2f;
  box-shadow: inset -4px -4px 0px rgba(0,0,0,0.3);
  font-family: 'Press Start 2P', cursive;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }
  @media (max-width: 600px) {
    &:hover {
      transform: none; /* Disable transform on hover for small screens */
    }

  &:active {
    transform: translateY(2px);
    box-shadow: inset -2px -2px 0px rgba(0,0,0,0.3);
  }
`;



const HeroSection = () => {
  return (
    <HeroContainer>
        <CloudLeftToRight src={cloud} style={{ top: '30px', left: '-500px', animationDuration: '100s',animationDelay: '25s'}} />
        <CloudLeftToRight src={cloud} style={{ top: '120px', left: '100px', animationDuration: '70s'}} />
        <CloudCenterToRight src={cloud} style={{ top: '90px', left: '100px', animationDuration: '60s'}} />



        <MessageBox>
            <TypingTitle>HI! I'M JASMEHAR</TypingTitle>
        </MessageBox>

        <ButtonGroup>
            <ScrollButton to="skills" smooth={true} duration={500} color="#fbbc04">SKILLS</ScrollButton>
            <ScrollButton to="experience" smooth={true} duration={500}color="#ea4335">EXPERIENCE</ScrollButton>
            <ScrollButton to="projects" smooth={true} duration={500}color="#5fbb5a">PROJECTS</ScrollButton>
        </ButtonGroup>
            <ScrollButton to="about" smooth={true} duration={500} color="#727678" marginTop="2rem">↓ About Me</ScrollButton>

            <PiranhaPlant src={piranha_plant} style={{ right: '50px', bottom: '370px', width: '250px' }} />
            <ShortPipe src={short_pipe} style={{ right: '-115px', bottom: '100px', width: '415px' }} />
    </HeroContainer>
  );
};

export default HeroSection;
