import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
`;

const Outer = styled.div`
  position: fixed;
  top: -10px;
  left: -10px;
  z-index: 9999;
  pointer-events: none;
  perspective: 60px;
`;

const Coin = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #ffe87a, #e8a000);
  border: 2px solid #b8860b;
  box-shadow: 0 0 6px rgba(232, 160, 0, 0.6);
  animation: ${spin} 1.1s linear infinite;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
`;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function PixelCursor() {
  const posRef   = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef   = useRef(null);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only activate on pointer:fine (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Hide during arcade intro (body overflow: hidden)
    const checkVisible = () => {
      setVisible(document.body.style.overflow !== 'hidden');
    };
    checkVisible();
    const bodyObs = new MutationObserver(checkVisible);
    bodyObs.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const t = targetRef.current;
      const p = posRef.current;
      const nx = lerp(p.x, t.x, 0.16);
      const ny = lerp(p.y, t.y, 0.16);
      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      bodyObs.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <Outer style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}>
      <Coin />
    </Outer>
  );
}
