import { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';

const projects = [
  {
    title: 'Konig',
    tag: 'Sitio Web',
    description: 'Identidad digital para cervecería artesanal. Diseño inmersivo que transmite la esencia de cada estilo.',
    url: '#',
    desktopImg: '/code/portfolio/escritorio1.webp',
    mobileImg:  '/code/portfolio/movil1.webp',
  },
  {
    title: 'Martín González Cueros',
    tag: 'Sitio Web',
    description: 'Presencia online para marroquinería artesanal. Catálogo elegante con foco en la calidad del producto.',
    url: '#',
    desktopImg: '/code/portfolio/escritorio2.webp',
    mobileImg:  '/code/portfolio/movil2.webp',
  },
  {
    title: 'WB Service Informática',
    tag: 'Sitio Web',
    description: 'Sitio institucional para servicio técnico. Claro, rápido y optimizado para captar clientes locales.',
    url: '#',
    desktopImg: '/code/portfolio/escritorio3.webp',
    mobileImg:  '/code/portfolio/movil3.webp',
  },
];

const TAG_COLORS: Record<string, string> = {
  'E-commerce': '#38E8B0',
  'Sitio Web': '#6C63FF',
  'Landing Page': '#4A90FF',
};

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const t = pos[0] === 't';
  const l = pos[1] === 'l';
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: 14, height: 14,
        top: t ? 0 : 'auto', bottom: t ? 'auto' : 0,
        left: l ? 0 : 'auto', right: l ? 'auto' : 0,
        borderTop: t ? '2px solid rgba(108,99,255,0.9)' : 'none',
        borderBottom: t ? 'none' : '2px solid rgba(108,99,255,0.9)',
        borderLeft: l ? '2px solid rgba(108,99,255,0.9)' : 'none',
        borderRight: l ? 'none' : '2px solid rgba(108,99,255,0.9)',
      }}
    />
  );
}

function SpaceMonitor({ imgSrc }: { imgSrc: string }) {
  return (
    <div className="relative flex flex-col items-center select-none flex-shrink-0">
      {/* Monitor frame */}
      <div
        className="relative rounded-xl"
        style={{
          width: 500,
          background: 'linear-gradient(145deg, #0c0c22, #07070f)',
          border: '1.5px solid rgba(108,99,255,0.28)',
          boxShadow: '0 0 40px rgba(108,99,255,0.10), 0 0 80px rgba(74,144,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Top HUD bar */}
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-xl"
          style={{ borderBottom: '1px solid rgba(108,99,255,0.14)' }}
        >
          <div className="flex items-center gap-2">
            <span className="block w-2 h-2 rounded-full" style={{ background: '#6C63FF', boxShadow: '0 0 6px #6C63FF' }} />
            <span className="font-mono text-[8px] tracking-[0.22em] opacity-50" style={{ color: '#a0a8ff' }}>RENDER.DISPLAY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] tracking-widest opacity-30" style={{ color: '#a0a8ff' }}>1920×1080</span>
            <span className="block w-6 h-px opacity-20" style={{ background: '#6C63FF' }} />
          </div>
        </div>

        {/* Screen */}
        <div className="relative overflow-hidden" style={{ height: 281, background: '#020210' }}>
          <img
            key={imgSrc}
            src={imgSrc}
            alt="portfolio preview"
            className="w-full h-full object-cover object-top"
            style={{ animation: 'fadeInDevice 0.7s ease forwards' }}
          />
          {/* Subtle scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)',
            }}
          />
          {/* Edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 45%, rgba(4,4,20,0.5) 100%)' }}
          />
        </div>

        {/* Bottom HUD bar */}
        <div
          className="flex items-center justify-between px-4 py-2 rounded-b-xl"
          style={{ borderTop: '1px solid rgba(108,99,255,0.10)' }}
        >
          <span className="font-mono text-[7px] tracking-widest opacity-25" style={{ color: '#a0a8ff' }}>WBCODE.SYS</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className="block rounded-full" style={{ width: 3, height: 3, background: i < 2 ? '#6C63FF' : 'rgba(108,99,255,0.22)', boxShadow: i < 2 ? '0 0 4px #6C63FF' : 'none' }} />
            ))}
          </div>
          <span className="font-mono text-[7px] tracking-widest opacity-25" style={{ color: '#4A90FF' }}>SIGNAL OK</span>
        </div>

        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
      </div>

      {/* Stand neck */}
      <div style={{ width: 68, height: 16, background: 'linear-gradient(to bottom, rgba(108,99,255,0.14), rgba(74,144,255,0.06))', borderLeft: '1px solid rgba(108,99,255,0.16)', borderRight: '1px solid rgba(108,99,255,0.16)' }} />
      {/* Stand base */}
      <div style={{ width: 140, height: 4, borderRadius: 4, background: 'linear-gradient(to right, transparent, rgba(108,99,255,0.35), rgba(74,144,255,0.25), transparent)', boxShadow: '0 0 18px rgba(108,99,255,0.28)' }} />
    </div>
  );
}

function SpacePhone({ imgSrc }: { imgSrc: string }) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: 136, height: 272 }}
    >
      {/* Outer frame */}
      <div
        className="absolute inset-0 rounded-[28px] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0e0e26, #07070f)',
          border: '1.5px solid rgba(108,99,255,0.30)',
          boxShadow: '0 0 28px rgba(108,99,255,0.15), 0 0 55px rgba(74,144,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Camera notch */}
        <div className="flex items-center justify-center py-2.5" style={{ borderBottom: '1px solid rgba(108,99,255,0.10)' }}>
          <span className="block w-2 h-2 rounded-full" style={{ background: '#050514', border: '1px solid rgba(108,99,255,0.5)', boxShadow: '0 0 5px rgba(108,99,255,0.4)' }} />
        </div>

        {/* Screen */}
        <div className="relative overflow-hidden" style={{ height: 210, background: '#020210' }}>
          <img
            key={imgSrc}
            src={imgSrc}
            alt="portfolio mobile"
            className="w-full h-full object-cover object-top"
            style={{ animation: 'fadeInDevice 0.7s ease forwards' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)' }}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center flex-1 py-3">
          <span className="block w-10 h-1 rounded-full" style={{ background: 'rgba(108,99,255,0.45)', boxShadow: '0 0 8px rgba(108,99,255,0.35)' }} />
        </div>
      </div>

      {/* Side power button */}
      <div
        className="absolute rounded-l"
        style={{ right: -2, top: 68, width: 3, height: 32, background: 'rgba(108,99,255,0.45)', boxShadow: '-2px 0 8px rgba(108,99,255,0.3)', borderRadius: '2px 0 0 2px' }}
      />
      {/* Volume buttons */}
      <div
        className="absolute"
        style={{ left: -2, top: 58, width: 3, height: 22, background: 'rgba(108,99,255,0.30)', borderRadius: '0 2px 2px 0' }}
      />
      <div
        className="absolute"
        style={{ left: -2, top: 86, width: 3, height: 22, background: 'rgba(108,99,255,0.30)', borderRadius: '0 2px 2px 0' }}
      />
    </div>
  );
}

export default function Portfolio() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const [active, setActive] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = projects.length;

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setActive(a => (a + 1) % n), 4500);
  };

  useEffect(() => {
    if (!isInView) return;
    resetAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [isInView]);

  const proj = projects[active];

  return (
    <section id="portfolio" ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      <style>{`
        @keyframes fadeInDevice { from { opacity: 0; } to { opacity: 1; } }
      `}</style>


      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-4"
              style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}>
            <RevealText text="TRABAJOS RECIENTES" />
          </h2>
          <p className={`text-space-text-secondary transition-all duration-700 delay-300 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
            Misiones completadas con éxito
          </p>
        </div>

        {/* Mockup display */}
        <div className={`transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Devices row */}
          <div className="flex items-end justify-center">
            {/* Monitor â€" hidden on mobile */}
            <div className="hidden md:block">
              <SpaceMonitor imgSrc={proj.desktopImg} />
            </div>
            {/* Phone â€" overlaps monitor on desktop, centered on mobile */}
            <div className="relative md:-ml-10 z-10" style={{ marginBottom: 20 }}>
              <SpacePhone imgSrc={proj.mobileImg} />
            </div>
          </div>

          {/* Project info */}
          <div className="text-center mt-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  background: `${TAG_COLORS[proj.tag]}18`,
                  border: `1px solid ${TAG_COLORS[proj.tag]}50`,
                  color: TAG_COLORS[proj.tag],
                }}
              >
                {proj.tag}
              </span>
              <h3 className="text-xl font-bold text-space-text font-display tracking-wide">{proj.title}</h3>
              {proj.url !== '#' && (
                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-space-accent hover:opacity-70 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-space-text-secondary text-sm max-w-sm mx-auto">{proj.description}</p>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); resetAuto(); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  background: i === active ? '#6C63FF' : 'rgba(255,255,255,0.18)',
                  boxShadow: i === active ? '0 0 12px rgba(108,99,255,0.6)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

