import React from 'react';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';

const inner = [
  { name: 'React',      color: '#61DAFB' },
  { name: 'Next.js',    color: '#ffffff' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Tailwind',   color: '#38BDF8' },
  { name: 'Node.js',    color: '#8CC84B' },
  { name: 'Figma',      color: '#F24E1E' },
];

const outer = [
  { name: 'WordPress',  color: '#21759B' },
  { name: 'Shopify',    color: '#95BF47' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'AWS',        color: '#FF9900' },
  { name: 'Vercel',     color: '#ffffff' },
  { name: 'Git',        color: '#F05032' },
];

const ICON_SVGS: Record<string, React.ReactElement> = {
  React:      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 12 12)"/></svg>,
  'Next.js':  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm3.5 13.5h-1.5L9 9.5V15H7.5V8.5H9l5 6V8.5H15.5v7Z"/></svg>,
  TypeScript: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><rect x="2" y="2" width="20" height="20" rx="2"/><path fill="#1e1e1e" d="M6 12h5v1.5H9v5H7.5v-5H6V12Zm6.5 0h4v1.5h-1.25v5H13.75v-5H12.5V12Z"/></svg>,
  Tailwind:   <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.5 6 12 6Zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.39 17.15 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.5 12 7 12Z"/></svg>,
  'Node.js':  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 2L3 7v10l9 5 9-5V7L12 2Zm-1 15L6 14v-4l5 2.5V17Zm2 0v-4.5l5-2.5v4L13 17Z"/></svg>,
  Figma:      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M8 2a4 4 0 0 0 0 8h4V2H8Zm4 0v8h4a4 4 0 0 0 0-8h-4Zm-4 8a4 4 0 0 0 0 8h4v-8H8Zm4 4a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm0 4h-4a4 4 0 0 0 0 8h4v-8Z"/></svg>,
  WordPress:  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M4 12h2m2 0 4 8m4-8-4 8M12 4l-4 8h8L12 4Z"/></svg>,
  Shopify:    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M15.5 5.5c-.5-1.5-1.8-2.5-3.2-2.5-1 0-2 .5-2.6 1.3l-.8-.2C8.2 4 7.5 4.7 7.2 5.6L5 18l9 2 5-2.5-2.5-10c.2-.5.1-1.4-1-2Zm-3.2-.5c.8 0 1.5.5 1.8 1.2l-3.6-.9c.3-.2.7-.3 1.1-.3-.2 0-.3 0-.3 0v0c.3 0 .7 0 1 0Z"/></svg>,
  PostgreSQL: <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><ellipse cx="12" cy="7" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M5 7v10a7 4 0 0 0 14 0V7" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M5 12a7 4 0 0 0 14 0" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>,
  AWS:        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M6 15.5l-3-1.5 3-1.5M18 15.5l3-1.5-3-1.5M3 14l9 5 9-5M3 10l9-5 9 5M3 10v4M21 10v4"/></svg>,
  Vercel:     <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 3L2 20h20L12 3Z"/></svg>,
  Git:        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M12 8v8" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
};

function OrbitRing({
  techs, radius, duration, reverse = false,
}: { techs: typeof inner; radius: number; duration: number; reverse?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Ring visual */}
      <div
        className="absolute rounded-full border border-white/8"
        style={{ width: radius * 2, height: radius * 2 }}
      />
      {/* Orbiting icons */}
      {techs.map((tech, i) => {
        const delay = -(duration / techs.length) * i;
        return (
          <div
            key={tech.name}
            className="absolute flex items-center justify-center"
            style={{
              width: radius * 2,
              height: radius * 2,
              animation: `${reverse ? 'orbit-ccw' : 'orbit-cw'} ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            {/* Icon positioned on ring edge, counter-rotates to stay upright */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: `translateX(-50%) translateY(-50%)`,
                animation: `${reverse ? 'orbit-cw' : 'orbit-ccw'} ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <div
                className="group flex flex-col items-center gap-1.5 pointer-events-auto cursor-default"
                title={tech.name}
              >
                <div
                  className="rounded-xl p-2.5 backdrop-blur-sm transition-all duration-300 group-hover:scale-125"
                  style={{
                    background: `${tech.color}15`,
                    border: `1px solid ${tech.color}30`,
                    color: tech.color,
                    boxShadow: `0 0 12px ${tech.color}20`,
                  }}
                >
                  {ICON_SVGS[tech.name]}
                </div>
                <span className="text-[10px] text-space-text-muted group-hover:text-space-text transition-colors whitespace-nowrap font-medium">
                  {tech.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  /** true cuando esta seccion encabeza la pagina: su titulo pasa a ser el h1. */
  comoH1?: boolean;
}

export default function Technologies({ comoH1 = false }: Props) {
  const Titulo = comoH1 ? 'h1' : 'h2';
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2 });

  return (
    <>
      {/* Inject orbit keyframes */}
      <style>{`
        @keyframes orbit-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes orbit-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
      `}</style>

      <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Titulo className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-4"
                style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}>
              <RevealText text="TECNOLOGIAS" />
            </Titulo>
            <p className={`text-space-text-secondary transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
              El stack que impulsa cada misión
            </p>
          </div>

          {/* Orbital system */}
          <div
            className="relative mx-auto"
            style={{ width: 620, height: 620, maxWidth: '100%' }}
          >
            {/* Outer ring â€" CCW */}
            <OrbitRing techs={outer} radius={290} duration={45} reverse />

            {/* Inner ring â€" CW */}
            <OrbitRing techs={inner} radius={190} duration={30} />

            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Outer slow pulse ring */}
                <div
                  className="absolute rounded-full animate-pulse"
                  style={{ width: 130, height: 130, background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', animationDuration: '3s' }}
                />
                <div
                  className="absolute rounded-full animate-pulse"
                  style={{ width: 90, height: 90, background: 'radial-gradient(circle, rgba(108,99,255,0.28) 0%, transparent 70%)', animationDuration: '2s' }}
                />
                <div
                  className="relative rounded-full flex flex-col items-center justify-center text-center"
                  style={{
                    width: 72, height: 72,
                    background: 'radial-gradient(circle at 35% 35%, rgba(108,99,255,0.3), rgba(74,144,255,0.1))',
                    border: '1px solid rgba(108,99,255,0.4)',
                    boxShadow: '0 0 20px rgba(108,99,255,0.3)',
                  }}
                >
                  <span className="text-[9px] tracking-[0.2em] text-space-accent font-display font-bold">TECH</span>
                  <span className="text-[9px] tracking-[0.2em] text-space-accent font-display font-bold">STACK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

