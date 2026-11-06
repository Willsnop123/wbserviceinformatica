import { Instagram, Facebook } from '@/components/code/effects/BrandIcons';
import { useInView } from '@/hooks/useInView';

/**
 * Redes sociales de WB Code, justo encima del pie.
 *
 * Es la misma idea que en el ala de servicio tecnico —el dibujo grande,
 * sin caja, con mucho aire alrededor— pero escrita aparte porque esa vive
 * de las variables de wb-service.css, que en /code no se cargan. Aca manda
 * la paleta espacial y la tipografia de titulos propia.
 *
 * Los dos enlaces son los mismos que ya declara el pie: es un solo perfil
 * para los dos mundos.
 */

const REDES = [
  {
    nombre: 'Instagram',
    icono: Instagram,
    href: 'https://www.instagram.com/wbservice.informatica/',
    color: '#E1306C',
  },
  {
    nombre: 'Facebook',
    icono: Facebook,
    href: 'https://www.facebook.com/profile.php?id=61588118462692&locale=es_LA',
    color: '#1877F2',
  },
];

export default function Redes() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative px-6 py-28 md:py-40 text-center overflow-hidden">
      {/* Un resplandor tenue arriba, para que la banda no sea un vacio liso. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 0%, rgba(108,99,255,0.10) 0%, transparent 65%)',
        }}
      />

      <div className={`relative transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-space-accent">
          Redes sociales
        </span>

        <h2 className="mt-5 mb-12 md:mb-16 font-display font-bold tracking-wider text-space-text text-2xl md:text-4xl">
          SEGUINOS
        </h2>

        <div className="flex items-center justify-center gap-10 sm:gap-16 md:gap-20">
          {REDES.map(r => (
            <a
              key={r.nombre}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={r.nombre}
              className="grupo-red inline-grid place-items-center rounded-xl p-2 min-w-[56px] min-h-[56px] text-space-text-secondary transition-[transform,color] duration-300 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent focus-visible:ring-offset-4 focus-visible:ring-offset-space-bg"
              style={{ ['--color-red' as string]: r.color }}
            >
              <r.icono className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16" />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        /* El color de cada marca sale de la variable que pone cada enlace,
           para no escribir una clase por red. */
        .grupo-red:hover,
        .grupo-red:focus-visible { color: var(--color-red); }

        @media (prefers-reduced-motion: reduce) {
          .grupo-red { transition: color .3s ease; }
          .grupo-red:hover,
          .grupo-red:focus-visible { transform: none; }
        }
      `}</style>
    </section>
  );
}
