import GlobalStyle from './components/GlobalStyle';
import IntroGate from './components/IntroGate';
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
      <IntroGate>
        <Navbar />
        <HeroSection />
        <AboutSection id="about" />
        <ExperienceSection id="experience" />
        <ProjectsSection id="projects" />
        <SkillsSection id="skills" />
        <MarioEndScene />
      </IntroGate>
    </>
  );
}

export default App;
