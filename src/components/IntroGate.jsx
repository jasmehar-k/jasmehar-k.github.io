import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ArcadeIntro from './ArcadeIntro';

const AppShell = styled.div`
  position: relative;
  min-height: 100vh;
`;

const PortfolioLayer = styled.div`
  position: relative;
  z-index: 1;
  opacity: ${({ $phase }) => ($phase === 'portfolio' ? 1 : 0)};
  visibility: ${({ $phase }) => ($phase === 'intro3d' ? 'hidden' : 'visible')};
  pointer-events: ${({ $phase }) => ($phase === 'portfolio' ? 'auto' : 'none')};
  transition: opacity 1.4s ease, visibility 1.4s ease;
`;

function alreadySeen() {
  try {
    return sessionStorage.getItem('arcadeSeen') === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem('arcadeSeen', '1');
  } catch {
    /* private mode */
  }
}

function IntroGate({ children }) {
  const [phase, setPhase] = useState(() => (alreadySeen() ? 'portfolio' : 'intro3d'));

  useEffect(() => {
    document.body.style.overflow = phase === 'portfolio' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  return (
    <AppShell>
      {phase !== 'portfolio' && (
        <ArcadeIntro
          phase={phase}
          onBeginTransition={() => setPhase('transitioning')}
          onFinishTransition={() => {
            markSeen();
            setPhase('portfolio');
          }}
          onSkip={() => {
            markSeen();
            setPhase('portfolio');
          }}
        />
      )}
      <PortfolioLayer $phase={phase}>{children}</PortfolioLayer>
    </AppShell>
  );
}

export default IntroGate;
