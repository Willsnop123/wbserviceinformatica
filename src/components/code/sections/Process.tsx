import { useEffect, useRef } from 'react';
import { Telescope, Sparkles, Code2, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';

const steps = [
  { number: '01', title: 'Descubrimiento',  description: 'Analizamos tu negocio, objetivos y audiencia para entender tu universo digital.', icon: Telescope, color: '#6C63FF', moonDur: '6s' },
  { number: '02', title: 'Diseño',            description: 'Creamos prototipos visuales y experiencias de usuario que conectan con tu marca.',   icon: Sparkles,  color: '#FF6B9D', moonDur: '8s' },
  { number: '03', title: 'Desarrollo',       description: 'Transformamos el diseño en código. Cada línea es una estrella en tu galaxia digital.', icon: Code2,     color: '#4A90FF', moonDur: '5s' },
  { number: '04', title: 'Lanzamiento',      description: 'Despegamos tu sitio al universo digital con optimización y monitoreo continuo.',      icon: Rocket,    color: '#38E8B0', moonDur: '7s' },
];

function Planet({ color, size = 52, moonDur = '7s', icon: Icon }: {
  color: string; size?: number; moonDur?: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size * 2.4, height: size * 2.4 }}>
      {/* Orbit ring visual */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 2.2, height: size * 2.2,
          border: `1px dashed ${color}30`,
        }}
      />
      {/* Planet body */}
      <div
        className="relative z-10 rounded-full flex items-center justify-center"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle at 35% 30%, ${color}55, ${color}18)`,
          border: `1.5px solid ${color}60`,
          boxShadow: `0 0 18px ${color}35, 0 0 40px ${color}15, inset 0 0 12px ${color}15`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      {/* Moon orbiting */}
      <div
        className="absolute"
        style={{
          width: size * 2.2, height: size * 2.2,
          animation: `orbit-cw ${moonDur} linear infinite`,
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            top: 0, left: '50%',
            transform: 'translate(-50%, -50%)',
            background: color,
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

export default function Process() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.12 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !timelineRef.current) return;
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 2.2, ease: 'power2.out', transformOrigin: 'top' });
    }
    const items = timelineRef.current.querySelectorAll('.process-step');
    items.forEach((item, i) => {
      gsap.fromTo(item.querySelector('.planet-wrap'),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.0, delay: i * 0.50, ease: 'back.out(1.5)' }
      );
      gsap.fromTo(item.querySelector('.step-content'),
        { x: i % 2 === 0 ? 60 : -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, delay: i * 0.50 + 0.25, ease: 'power3.out' }
      );
    });
  }, [isInView]);

  return (
    <>
      <style>{`
        @keyframes orbit-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cometSlide { 0% { top:0%; opacity:0; } 5% { opacity:1; } 93% { opacity:0.6; } 100% { top:100%; opacity:0; } }
      `}</style>

      <section id="proceso" ref={sectionRef} className="relative min-h-[80vh] py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-space-bg via-space-bg-secondary to-space-bg pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-4"
                style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}>
              <RevealText text="PROCESO DE TRABAJO" />
            </h2>
            <p className={`text-space-text-secondary transition-all duration-700 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
              Cada misión sigue una trayectoria probada
            </p>
          </div>

          <div ref={timelineRef} className="relative">
            {/* Vertical orbit path — desktop only */}
            <div
              ref={lineRef}
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{
                background: 'linear-gradient(to bottom, rgba(108,99,255,0.7) 0%, rgba(74,144,255,0.5) 55%, transparent 100%)',
                transformOrigin: 'top',
                boxShadow: '0 0 8px rgba(108,99,255,0.25)',
              }}
            />
            {/* Comet traveling down the timeline */}
            {isInView && (
              <div
                className="hidden md:block absolute left-1/2 -translate-x-1/2 z-20 rounded-full"
                style={{
                  width: 7, height: 7,
                  background: '#ffffff',
                  boxShadow: '0 0 10px rgba(108,99,255,1), 0 0 28px rgba(108,99,255,0.6), 0 0 50px rgba(74,144,255,0.3)',
                  animation: 'cometSlide 2.8s ease-in-out 0.4s forwards',
                  top: 0,
                  opacity: 0,
                  position: 'absolute',
                }}
              />
            )}

            <div className="space-y-10 md:space-y-20">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`process-step relative flex items-center gap-0
                    flex-col md:flex-row md:items-center
                    ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Planet â€" static on mobile, absolute on desktop */}
                  <div className="planet-wrap md:absolute md:left-1/2 md:-translate-x-1/2 z-10 opacity-0 mb-2 md:mb-0">
                    <Planet color={step.color} moonDur={step.moonDur} icon={step.icon} />
                  </div>

                  {/* Content card */}
                  <div
                    className={`step-content opacity-0 w-full md:w-5/12 text-center
                      ${index % 2 === 0 ? 'md:pr-24 md:text-right' : 'md:pl-24 md:ml-auto md:text-left'}`}
                  >
                    <div className="glass rounded-2xl p-5 md:p-6 border border-white/5 hover:border-white/10 transition-colors duration-300">
                      <div className={`flex items-center gap-2 mb-3 justify-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        <span className="text-xs tracking-[0.2em] font-mono" style={{ color: step.color }}>
                          {step.number}
                        </span>
                        <span className="text-xs text-space-text-muted">â€"</span>
                        <span className="text-xs tracking-widest text-space-text-muted uppercase">FASE</span>
                      </div>
                      <h3 className="text-xl font-bold text-space-text mb-2">{step.title}</h3>
                      <p className="text-sm text-space-text-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>

                  {/* Spacer â€" desktop only */}
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

