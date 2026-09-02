import { useEffect, useRef } from 'react';
import { Rocket, Globe, ShoppingCart, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';
import HolographicCard from '@/components/code/effects/HolographicCard';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Rocket,
    title: 'Landing Pages',
    description:
      'Páginas diseñadas para convertir visitantes en clientes. Rápidas, atractivas y enfocadas en resultados.',
    features: [
      'Diseño responsive',
      'Optimización SEO',
      'Call-to-action efectivos',
      'Carga ultrarápida',
    ],
    orbitRadius: '120px',
    orbitDuration: '35s',
  },
  {
    icon: Globe,
    title: 'Sitios Web',
    description:
      'Presencia web completa para tu marca. Desde sitios corporativos hasta plataformas interactivas.',
    features: [
      'Diseño personalizado',
      'CMS integrado',
      'Multidispositivo',
      'Escalable',
    ],
    orbitRadius: '150px',
    orbitDuration: '45s',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce',
    description:
      'Tiendas online que venden. Integración de pagos, catálogos y gestión de inventario.',
    features: [
      'Pasarela de pagos',
      'Carrito de compras',
      'Gestión de productos',
      'Seguridad SSL',
    ],
    orbitRadius: '100px',
    orbitDuration: '30s',
  },
];

export default function Services() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.15 });
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView || !cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.service-card');
    
    gsap.fromTo(
      cards,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );
  }, [isInView]);

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="relative min-h-screen py-32 px-6"
    >
      {/* Section atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orbit ring decorations top-right */}
        <div className="absolute rounded-full" style={{ width: 480, height: 480, top: '-120px', right: '-120px', border: '1px solid rgba(108,99,255,0.12)' }} />
        <div className="absolute rounded-full" style={{ width: 310, height: 310, top: '-60px', right: '-60px', border: '1px solid rgba(108,99,255,0.08)' }} />
        {/* HUD corner brackets */}
        <div className="absolute top-8 left-8 w-8 h-8" style={{ borderLeft: '2px solid rgba(108,99,255,0.28)', borderTop: '2px solid rgba(108,99,255,0.28)' }} />
        <div className="absolute top-8 right-8 w-8 h-8" style={{ borderRight: '2px solid rgba(108,99,255,0.28)', borderTop: '2px solid rgba(108,99,255,0.28)' }} />
        <div className="absolute bottom-8 left-8 w-8 h-8" style={{ borderLeft: '2px solid rgba(108,99,255,0.28)', borderBottom: '2px solid rgba(108,99,255,0.28)' }} />
        <div className="absolute bottom-8 right-8 w-8 h-8" style={{ borderRight: '2px solid rgba(108,99,255,0.28)', borderBottom: '2px solid rgba(108,99,255,0.28)' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-6"
              style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}>
            <RevealText text="SERVICIOS" />
          </h2>
          <p
            className={`text-lg text-space-text-secondary max-w-2xl mx-auto transition-all duration-1000 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Soluciones digitales que impulsan tu presencia online
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <div
              key={service.title}
              className="service-card opacity-0"
              style={{
                animation: isInView
                  ? `float ${service.orbitDuration} ease-in-out infinite`
                  : 'none',
                animationDelay: `${index * 2}s`,
              }}
            >
              <HolographicCard className="h-full">
                <div className="relative glass rounded-2xl p-8 md:p-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-space-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-space-text mb-4">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-space-text-secondary mb-6 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-space-text-secondary"
                      >
                        <Check className="w-4 h-4 text-space-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </HolographicCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

