import { useCallback, useEffect, useRef } from 'react';

// Drives a pinned ("sticky") section: converts vertical page scroll into a 0..1
// progress value across the section's scrollable range.
//
// A section is laid out taller than the viewport and pins a viewport-sized stage
// inside it. Progress is 0 the moment the stage locks to the top and 1 when the
// section's bottom reaches the bottom of the viewport.
//
// onProgress(p, meta) runs inside requestAnimationFrame — write to the DOM
// directly from it rather than calling setState, or scrolling will crawl.
export function useScrollProgress(onProgress) {
  const sectionRef = useRef(null);
  const rafRef = useRef(0);
  const lastRef = useRef(-1);
  const cbRef = useRef(onProgress);

  cbRef.current = onProgress;

  const read = useCallback(() => {
    rafRef.current = 0;
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // total distance the page scrolls while the stage stays pinned
    const range = rect.height - vh;
    const p = range <= 0 ? 0 : Math.max(0, Math.min(-rect.top / range, 1));

    const prev = lastRef.current;
    lastRef.current = p;

    cbRef.current(p, {
      el,
      delta: prev < 0 ? 0 : p - prev,
      vw: window.innerWidth || 1,
      vh,
      // pinned while any part of the stage is on screen
      active: rect.top <= 0 && rect.bottom >= vh,
      visible: rect.bottom > 0 && rect.top < vh,
    });
  }, []);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(read);
  }, [read]);

  useEffect(() => {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    read();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [read, schedule]);

  return { sectionRef, refresh: schedule };
}

export default useScrollProgress;
