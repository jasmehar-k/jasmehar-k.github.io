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

function IntroGate({ children }) {
  const [phase, setPhase] = useState('intro3d');

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
          onFinishTransition={() => setPhase('portfolio')}
        />
      )}
      <PortfolioLayer $phase={phase}>
        {children}
      </PortfolioLayer>
    </AppShell>
  );
}

export default IntroGate;
