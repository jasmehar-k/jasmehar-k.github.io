import GlobalStyle from './components/GlobalStyle';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import MarioEndScene from './components/MarioEndScene';
import IntroGate from './components/IntroGate';

function PortfolioContent() {
  return (
    <>
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

function App() {
  return (
    <>
      <GlobalStyle />
      <IntroGate>
        <PortfolioContent />
      </IntroGate>
    </>
  );
}

export default App;
