import GlobalStyle from './components/GlobalStyle'; 
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import MarioEndScene from './components/MarioEndScene';

function App() {
  return (
    <>
      <GlobalStyle />
      <Navbar />
      <HeroSection />
      <AboutSection id="about" />
      <SkillsSection id="skills" />
      <ExperienceSection id="experience" />
      <ProjectsSection id="projects" />
      <MarioEndScene />

    </>
  );
}

export default App;
