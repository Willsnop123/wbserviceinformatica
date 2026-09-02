import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
}

/**
 * Splits text into characters and reveals them from below on scroll.
 * Classic Awwwards clip-reveal effect — no external isInView needed.
 */
export default function RevealText({
  text,
  className = '',
  delay = 0,
  stagger = 0.042,
  start = 'top 85%',
}: RevealTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLElement>('.rv-char');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start,
        once: true,
      },
    });

    tl.fromTo(
      chars,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.80,
        stagger,
        ease: 'power4.out',
        delay,
      }
    );

    return () => {
      tl.kill();
    };
  }, [text, delay, stagger, start]);

  const words = text.split(' ');

  return (
    <span
      ref={containerRef}
      className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex">
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className="inline-block overflow-hidden"
              style={{ lineHeight: 1.15 }}
            >
              <span className="rv-char inline-block">
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
