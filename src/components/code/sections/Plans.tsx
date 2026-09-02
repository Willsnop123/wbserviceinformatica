import { useEffect, useRef } from 'react';
import { Check, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';
import HolographicCard from '@/components/code/effects/HolographicCard';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Orbita Baja',
    subtitle: 'Landing Page',
    price: 'Desde $350.000 ARS',
    features: [
      'Diseño de una página',
      'Hasta 5 secciones',
      'Responsive design',
      'Formulario de contacto',
      'Optimización básica SEO',
    ],
    highlighted: false,
    cta: 'CONSULTAR',
  },
  {
    name: 'Orbita Media',
    subtitle: 'Sitio Web',
    price: 'Desde $550.000 ARS',
    features: [
      'Hasta 5 páginas',
      'CMS integrado',
      'Blog / Noticias',
      'Galerías y multimedia',
      'SEO avanzado',
      'Analytics integrado',
    ],
    highlighted: true,
    cta: 'CONSULTAR',
    badge: 'RECOMENDADO',
  },
  {
    name: 'Orbita Alta',
    subtitle: 'E-commerce',
    price: 'Desde $900.000 ARS',
    features: [
      'Todo lo del plan Sitio Web',
      'Catálogo de productos',
      'Carrito de compras',
      'Pasarela de pagos',
      'Gestión de inventario',
      'Panel de administración',
    ],
    highlighted: false,
    cta: 'CONSULTAR',
  },
];

interface Props {
  /** true cuando esta seccion encabeza la pagina: su titulo pasa a ser el h1. */
  comoH1?: boolean;
}

export default function Plans({ comoH1 = false }: Props) {
  const Titulo = comoH1 ? 'h1' : 'h2';
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.plan-card');

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: {
          each: 0.2,
          from: 'center',
        },
        ease: 'back.out(1.4)',
      }
    );
  }, [isInView]);

  return (
    <>
    <style>{`
      @keyframes scanShimmer {
        0%   { transform: translateX(-160%); }
        100% { transform: translateX(260%); }
      }
    `}</style>
    <section
      id="planes"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6"
    >

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <Titulo className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-6"
              style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}>
            <RevealText text="PLANES" />
          </Titulo>
          <p
            className={`text-lg text-space-text-secondary max-w-2xl mx-auto transition-all duration-1000 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Elige tu nivel de presencia en el universo digital
          </p>
        </div>

        {/* Plans Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card opacity-0 ${
                plan.highlighted ? 'md:scale-105 md:z-10' : ''
              }`}
            >
              <HolographicCard className="h-full">
                <div
                  className={`relative rounded-2xl p-8 md:p-10 h-full flex flex-col ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-space-accent/10 to-space-bg-tertiary/80 border-2 border-space-accent shadow-glow-lg'
                      : 'glass border border-white/5'
                  }`}
                >
                  {/* Highlighted card animated accents */}
                  {plan.highlighted && (
                    <>
                      {/* Shimmer scan line at top */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden rounded-t-2xl pointer-events-none">
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to right, transparent 0%, rgba(200,190,255,0.9) 50%, transparent 100%)',
                          animation: 'scanShimmer 2.8s ease-in-out infinite',
                        }} />
                      </div>
                      {/* Corner glow dots */}
                      <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full pointer-events-none" style={{ background: '#6C63FF', boxShadow: '0 0 10px rgba(108,99,255,0.9)' }} />
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full pointer-events-none" style={{ background: '#6C63FF', boxShadow: '0 0 10px rgba(108,99,255,0.9)' }} />
                      <span className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full pointer-events-none" style={{ background: 'rgba(108,99,255,0.45)', boxShadow: '0 0 6px rgba(108,99,255,0.5)' }} />
                      <span className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full pointer-events-none" style={{ background: 'rgba(108,99,255,0.45)', boxShadow: '0 0 6px rgba(108,99,255,0.5)' }} />
                    </>
                  )}

                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 right-6">
                      <span className="flex items-center gap-1 px-3 py-1 bg-space-accent text-white text-xs font-medium rounded-full">
                        <Star className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="mb-6">
                    <h3 className="text-sm text-space-accent tracking-wider uppercase mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xl font-bold text-space-text">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-2xl md:text-3xl font-bold text-space-text">
                      {plan.price}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-space-text-secondary"
                      >
                        <Check className="w-4 h-4 text-space-accent mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="/code/contacto/"
                    className={`block text-center w-full py-3 px-6 rounded-full text-sm font-medium tracking-wider transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-space-accent text-white hover:bg-space-accent/90 hover:shadow-glow'
                        : 'border border-space-accent text-space-text hover:bg-space-accent/10'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </HolographicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

