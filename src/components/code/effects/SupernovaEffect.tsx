import { useEffect } from 'react';
import gsap from 'gsap';

const POSITIONS = [
  { x: '7%',  y: '10%' }, { x: '88%', y: '7%'  },
  { x: '3%',  y: '68%' }, { x: '93%', y: '72%' },
  { x: '16%', y: '85%' }, { x: '80%', y: '88%' },
  { x: '95%', y: '35%' }, { x: '70%', y: '14%' },
  { x: '22%', y: '78%' }, { x: '5%',  y: '42%' },
];

function spawnSupernova() {
  const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

  const wrap = document.createElement('div');
  wrap.style.cssText = `
    position: fixed;
    left: ${pos.x};
    top: ${pos.y};
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 6;
  `;
  document.body.appendChild(wrap);

  const makeRing = (baseSize: number, color: string, dur: number, delay: number, endScale: number) => {
    const r = document.createElement('div');
    r.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: ${baseSize}px; height: ${baseSize}px;
      border-radius: 50%;
      border: 1.5px solid ${color};
      box-shadow: 0 0 6px ${color}, 0 0 14px ${color};
      opacity: 0;
    `;
    wrap.appendChild(r);
    gsap.to(r, {
      scale: endScale, opacity: 0,
      duration: dur, delay,
      ease: 'power2.out',
      onStart: () => gsap.set(r, { opacity: 1 }),
    });
  };

  // Initial pinpoint flash
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 3px; height: 3px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 5px 2px white, 0 0 18px 8px rgba(255,230,150,0.9);
  `;
  wrap.appendChild(flash);

  gsap.timeline()
    .from(flash, { scale: 0, duration: 0.06, ease: 'power4.out' })
    .to(flash,  { scale: 4, opacity: 0, duration: 0.9, ease: 'power3.in' }, 0.06);

  // Expanding rings with color evolution
  makeRing(5, 'rgba(255,250,220,0.95)', 1.0, 0.04, 10);
  makeRing(5, 'rgba(255,190,60,0.80)',  1.8, 0.18, 14);
  makeRing(5, 'rgba(255,100,30,0.60)',  2.8, 0.40, 16);
  makeRing(5, 'rgba(160,50,220,0.40)',  4.0, 0.70, 18);

  setTimeout(() => wrap.parentNode?.removeChild(wrap), 5000);
}

export default function SupernovaEffect() {
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 18000 + Math.random() * 32000; // 18-50 s
      tid = setTimeout(() => { spawnSupernova(); schedule(); }, delay);
    };

    // First one after 10-18 s so it feels natural
    tid = setTimeout(() => { spawnSupernova(); schedule(); }, 10000 + Math.random() * 8000);

    return () => clearTimeout(tid);
  }, []);

  return null;
}
