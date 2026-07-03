import styled from 'styled-components';

const PlaqueWrapper = styled.div`
  text-align: center;
  font-family: var(--font-pixel);
  margin-bottom: 3rem;
`;

const WorldLabel = styled.div`
  display: inline-block;
  padding: 0.45rem 0.9rem;
  background: var(--ink);
  color: var(--gold);
  border: 3px solid ${({ $light }) => ($light ? 'rgba(255,255,255,0.35)' : '#2f2f2f')};
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.35);
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  margin-bottom: 1.1rem;
`;

const SectionName = styled.h2`
  margin: 0;
  font-size: clamp(1.05rem, 2.4vw, 1.6rem);
  color: ${({ $light }) => ($light ? '#fffef7' : '#2f2f2f')};
  text-shadow: ${({ $light }) => ($light ? '3px 3px 0 rgba(0,0,0,0.55)' : '3px 3px 0 rgba(255,255,255,0.35)')};
`;

export default function WorldPlaque({ world, name, light = false }) {
  return (
    <PlaqueWrapper>
      <WorldLabel $light={light}>WORLD {world}</WorldLabel>
      <SectionName $light={light}>{name}</SectionName>
    </PlaqueWrapper>
  );
}
