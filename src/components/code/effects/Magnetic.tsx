import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

/**
 * Wraps any element with a magnetic attraction effect.
 * The inner element moves toward the cursor when hovering nearby,
 * and springs back elastically when the cursor leaves.
 */
export default function Magnetic({ children, strength = 0.38, radius = 80, className = '' }: MagneticProps) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const onMove = (e: MouseEvent) => {
      const rect    = wrap.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx      = e.clientX - centerX;
      const dy      = e.clientY - centerY;
      const dist    = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        gsap.to(inner, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };

    const onLeave = () => {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.35)',
      });
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, radius]);

  return (
    <div ref={wrapRef} className={`relative inline-flex ${className}`} style={{ padding: radius * 0.4 }}>
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  );
}
