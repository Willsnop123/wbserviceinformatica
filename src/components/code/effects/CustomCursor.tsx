import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
    };

    // Lagging ring
    let raf: number;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.11;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.11;
      gsap.set(ringRef.current, { x: ring.current.x, y: ring.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });

    // Expand ring over interactive elements
    const grow = () => gsap.to(ringRef.current, {
      scale: 2.2, borderColor: 'rgba(108,99,255,0.9)',
      boxShadow: '0 0 14px rgba(108,99,255,0.5)', duration: 0.25,
    });
    const shrink = () => gsap.to(ringRef.current, {
      scale: 1, borderColor: 'rgba(108,99,255,0.45)',
      boxShadow: '0 0 8px rgba(108,99,255,0.15)', duration: 0.25,
    });

    const targets = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
    targets.forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      targets.forEach(el => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 6, height: 6, background: 'white', boxShadow: '0 0 8px 2px rgba(108,99,255,0.7)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 30, height: 30,
          border: '1px solid rgba(108,99,255,0.45)',
          boxShadow: '0 0 8px rgba(108,99,255,0.15)',
        }}
      />
    </>
  );
}
