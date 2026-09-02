import { useRef, useCallback, type ReactNode } from 'react';

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function HolographicCard({
  children,
  className = '',
  glowColor = 'rgba(108, 99, 255, 0.15)',
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
      card.style.setProperty('--rotate-x', `${rotateX}deg`);
      card.style.setProperty('--rotate-y', `${rotateY}deg`);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: 'rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 50%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          boxShadow: '0 0 30px rgba(108, 99, 255, 0.2)',
        }}
      />
      {children}
    </div>
  );
}
