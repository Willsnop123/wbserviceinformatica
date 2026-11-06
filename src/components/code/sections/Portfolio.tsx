import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';

/**
 * Trabajos de WB Code.
 *
 * La idea de fondo: un portfolio tiene que dejar VER el trabajo. Una
 * miniatura de 500 px con la portada de un sitio no muestra nada — no se lee
 * un titulo, no se entiende una grilla de productos, no se sabe si la pagina
 * sigue despues del hero.
 *
 * Por eso cada captura es de la pagina entera, seis pantallas de alto, y se
 * desplaza sola dentro del marco como si alguien la estuviera recorriendo.
 * El visitante ve el sitio completo sin salir de aca, y si algo le llama la
 * atencion pasa el puntero por encima y la animacion se detiene.
 *
 * Las capturas las genera `scripts/capturar-portfolio.mjs`.
 */

const TRABAJOS = [
  {
    slug: 'vidasana',
    titulo: 'Almacén Vida Sana',
    tag: 'Tienda online',
    dominio: 'almacenvidasana.com.ar',
    url: 'https://www.almacenvidasana.com.ar',
    descripcion:
      'Dietética de Gualeguay que ahora vende a todo el país. Catálogo por categorías, carrito, ofertas de la semana y envíos por Correo Argentino.',
  },
  {
    slug: 'konig',
    titulo: 'Cerveza König',
    tag: 'Sitio Web',
    dominio: 'cervezakonig.com.ar',
    url: 'https://www.cervezakonig.com.ar',
    descripcion:
      'Cervecería artesanal de Ciudad Larroque. Control de edad al entrar, historia de la marca, sedes propias y un canal mayorista aparte.',
  },
  {
    slug: 'dulce',
    titulo: 'Dulce Armonía',
    tag: 'Sitio Web',
    dominio: 'dulcearmonia.com.ar',
    url: 'https://www.dulcearmonia.com.ar',
    descripcion:
      'Pastelería artesanal. Tortas y tartas a medida según la cantidad de invitados, con pedido personalizado y stock del día por WhatsApp.',
  },
  {
    slug: 'martin',
    titulo: 'Martín González',
    tag: 'Catálogo',
    dominio: 'martingonzalezcueros.com.ar',
    url: 'https://martingonzalezcueros.com.ar/',
    descripcion:
      'Marroquinería y calzado de cuero hecho a mano en Gualeguay. Catálogo con talles y precios, y consulta directa por WhatsApp.',
  },
  {
    slug: 'dvc',
    titulo: 'DVC Estudio Jurídico',
    tag: 'Sitio Web',
    dominio: 'dvcestudiojuridico.com.ar',
    url: 'https://dvcestudiojuridico.com.ar/',
    descripcion:
      'Estudio jurídico con más de diez años de trayectoria. Áreas de práctica, equipo y un formulario de consulta rápida.',
  },
] as const;

const COLOR_TAG: Record<string, string> = {
  'Tienda online': '#38E8B0',
  'Sitio Web': '#6C63FF',
  'Catálogo': '#4A90FF',
};

const escritorio = (slug: string) => `/code/portfolio/${slug}-escritorio.webp`;
const movil = (slug: string) => `/code/portfolio/${slug}-movil.webp`;

/** 1440x900, la proporcion con la que se capturo el escritorio. */
const PROPORCION_MONITOR = 1440 / 900;
/** 390x844, un telefono comun. */
const PROPORCION_TELEFONO = 390 / 844;

/**
 * Cuanto tiene que recorrer una captura dentro de su marco, en porcentaje de
 * su propio alto.
 *
 * Se calcula cuando la imagen termina de cargar, a partir de su tamaño real y
 * de la proporcion del marco. En porcentaje y no en pixeles a proposito: un
 * porcentaje de translateY se mide contra el alto del propio elemento, asi
 * que el valor sigue siendo correcto cuando la pagina cambia de ancho y no
 * hay que recalcular nada al redimensionar.
 */
function medirRecorrido(img: HTMLImageElement | null, proporcionMarco: number) {
  if (!img) return;
  const { naturalWidth: w, naturalHeight: h } = img;
  if (!w || !h) return;
  const visible = w / (h * proporcionMarco); // fraccion de la imagen que entra en el marco
  const recorrido = Math.max(0, (1 - visible) * 100);
  img.style.setProperty('--recorrido', `-${recorrido.toFixed(3)}%`);
  // Recien ahora empieza a moverse. Si la animacion arrancara junto con la
  // pagina, correria con recorrido 0 — quieta — y al terminar de cargar la
  // imagen tomaria el valor nuevo en mitad del ciclo, pegando un salto hasta
  // donde le toque estar en ese instante.
  img.classList.add('lista');
}

/**
 * La captura dentro de un marco.
 *
 * El `ref` ademas del `onLoad` no sobra: si la imagen ya estaba en el cache
 * del navegador, para cuando React la monta ya termino de cargar y el evento
 * load nunca llega. Pasa siempre al volver a un proyecto ya visto.
 */
function Captura({
  slug,
  src,
  alt,
  ancho,
  alto,
  proporcionMarco,
}: {
  slug: string;
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  proporcionMarco: number;
}) {
  return (
    <img
      key={slug}
      ref={el => {
        if (el?.complete) medirRecorrido(el, proporcionMarco);
      }}
      src={src}
      alt={alt}
      width={ancho}
      height={alto}
      loading="lazy"
      decoding="async"
      onLoad={e => medirRecorrido(e.currentTarget, proporcionMarco)}
      className="absolute inset-x-0 top-0 w-full h-auto captura"
    />
  );
}

function Esquina({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const arriba = pos[0] === 't';
  const izq = pos[1] === 'l';
  const linea = '2px solid rgba(108,99,255,0.9)';
  return (
    <div
      className="absolute pointer-events-none z-20"
      style={{
        width: 14,
        height: 14,
        top: arriba ? 0 : 'auto',
        bottom: arriba ? 'auto' : 0,
        left: izq ? 0 : 'auto',
        right: izq ? 'auto' : 0,
        borderTop: arriba ? linea : 'none',
        borderBottom: arriba ? 'none' : linea,
        borderLeft: izq ? linea : 'none',
        borderRight: izq ? 'none' : linea,
      }}
    />
  );
}

function Monitor({ trabajo }: { trabajo: (typeof TRABAJOS)[number] }) {
  return (
    <div className="relative flex flex-col items-center select-none w-full">
      <a
        href={trabajo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir ${trabajo.titulo} en una pestaña nueva`}
        className="group relative block w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent focus-visible:ring-offset-4 focus-visible:ring-offset-space-bg"
        style={{
          background: 'linear-gradient(145deg, #0c0c22, #07070f)',
          border: '1.5px solid rgba(108,99,255,0.28)',
          boxShadow:
            '0 0 40px rgba(108,99,255,0.10), 0 0 80px rgba(74,144,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Barra superior */}
        <div
          className="flex items-center justify-between px-4 py-2 rounded-t-xl"
          style={{ borderBottom: '1px solid rgba(108,99,255,0.14)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="block w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#6C63FF', boxShadow: '0 0 6px #6C63FF' }}
            />
            <span className="font-mono text-[9px] tracking-[0.18em] opacity-60 truncate" style={{ color: '#a0a8ff' }}>
              {trabajo.dominio}
            </span>
          </div>
          <span className="font-mono text-[8px] tracking-widest opacity-30 flex-shrink-0" style={{ color: '#a0a8ff' }}>
            1440×900
          </span>
        </div>

        {/* Pantalla */}
        <div className="relative overflow-hidden marco-captura" style={{ aspectRatio: '1440 / 900', background: '#020210' }}>
          <Captura
            slug={trabajo.slug}
            src={escritorio(trabajo.slug)}
            alt={`Sitio de ${trabajo.titulo} visto en una pantalla de escritorio`}
            ancho={1440}
            alto={5400}
            proporcionMarco={PROPORCION_MONITOR}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 92% 86% at 50% 50%, transparent 55%, rgba(4,4,20,0.45) 100%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 p-3 flex justify-end opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{ background: 'rgba(108,99,255,0.92)', color: '#fff' }}
            >
              Abrir el sitio <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Barra inferior */}
        <div
          className="flex items-center justify-between px-4 py-2 rounded-b-xl"
          style={{ borderTop: '1px solid rgba(108,99,255,0.10)' }}
        >
          <span className="font-mono text-[7px] tracking-widest opacity-25" style={{ color: '#a0a8ff' }}>
            WBCODE.SYS
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  background: i < 2 ? '#6C63FF' : 'rgba(108,99,255,0.22)',
                  boxShadow: i < 2 ? '0 0 4px #6C63FF' : 'none',
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[7px] tracking-widest opacity-25" style={{ color: '#4A90FF' }}>
            SIGNAL OK
          </span>
        </div>

        <Esquina pos="tl" />
        <Esquina pos="tr" />
        <Esquina pos="bl" />
        <Esquina pos="br" />
      </a>

      {/* Pie del monitor */}
      <div
        style={{
          width: 68,
          height: 16,
          background: 'linear-gradient(to bottom, rgba(108,99,255,0.14), rgba(74,144,255,0.06))',
          borderLeft: '1px solid rgba(108,99,255,0.16)',
          borderRight: '1px solid rgba(108,99,255,0.16)',
        }}
      />
      <div
        style={{
          width: 140,
          height: 4,
          borderRadius: 4,
          background: 'linear-gradient(to right, transparent, rgba(108,99,255,0.35), rgba(74,144,255,0.25), transparent)',
          boxShadow: '0 0 18px rgba(108,99,255,0.28)',
        }}
      />
    </div>
  );
}

function Telefono({ trabajo }: { trabajo: (typeof TRABAJOS)[number] }) {
  return (
    <div className="relative select-none w-full">
      <div
        className="relative rounded-[26px] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0e0e26, #07070f)',
          border: '1.5px solid rgba(108,99,255,0.30)',
          boxShadow:
            '0 0 28px rgba(108,99,255,0.15), 0 0 55px rgba(74,144,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: 6,
        }}
      >
        <div className="flex items-center justify-center py-1.5">
          <span
            className="block rounded-full"
            style={{
              width: 7,
              height: 7,
              background: '#050514',
              border: '1px solid rgba(108,99,255,0.5)',
              boxShadow: '0 0 5px rgba(108,99,255,0.4)',
            }}
          />
        </div>

        <div className="relative overflow-hidden rounded-[18px] marco-captura" style={{ aspectRatio: '390 / 844', background: '#020210' }}>
          <Captura
            slug={trabajo.slug}
            src={movil(trabajo.slug)}
            alt={`Sitio de ${trabajo.titulo} visto en un teléfono`}
            ancho={620}
            alto={8050}
            proporcionMarco={PROPORCION_TELEFONO}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
            }}
          />
        </div>

        <div className="flex items-center justify-center py-2">
          <span
            className="block rounded-full"
            style={{ width: 38, height: 4, background: 'rgba(108,99,255,0.45)', boxShadow: '0 0 8px rgba(108,99,255,0.35)' }}
          />
        </div>
      </div>

      <div
        className="absolute"
        style={{ right: -2, top: '22%', width: 3, height: 34, background: 'rgba(108,99,255,0.45)', boxShadow: '-2px 0 8px rgba(108,99,255,0.3)', borderRadius: '2px 0 0 2px' }}
      />
      <div
        className="absolute"
        style={{ left: -2, top: '18%', width: 3, height: 22, background: 'rgba(108,99,255,0.30)', borderRadius: '0 2px 2px 0' }}
      />
      <div
        className="absolute"
        style={{ left: -2, top: '27%', width: 3, height: 22, background: 'rgba(108,99,255,0.30)', borderRadius: '0 2px 2px 0' }}
      />
    </div>
  );
}

interface Props {
  /** true cuando esta seccion encabeza la pagina: su titulo pasa a ser el h1. */
  comoH1?: boolean;
}

export default function Portfolio({ comoH1 = false }: Props) {
  const Titulo = comoH1 ? 'h1' : 'h2';
  const { ref: seccionRef, isInView } = useInView({ threshold: 0.1 });
  const [activo, setActivo] = useState(0);
  const trabajo = TRABAJOS[activo];

  // Adelantar las capturas del siguiente para que el cambio sea instantaneo.
  // Son archivos grandes: pedidas recien al hacer clic, se ve el marco vacio
  // un segundo.
  const yaPedidas = useRef(new Set<string>());
  useEffect(() => {
    const siguiente = TRABAJOS[(activo + 1) % TRABAJOS.length].slug;
    if (yaPedidas.current.has(siguiente)) return;
    yaPedidas.current.add(siguiente);
    new Image().src = escritorio(siguiente);
    new Image().src = movil(siguiente);
  }, [activo]);

  return (
    <section id="portfolio" ref={seccionRef} className="relative py-24 md:py-32 px-6 overflow-hidden">
      <style>{`
        /* El recorrido lo mide el componente cuando la imagen termina de
           cargar, y recien ahi le pone la clase que la hace moverse. */
        .captura { --recorrido: 0%; }
        .captura.lista {
          animation: recorrerSitio 26s cubic-bezier(.45,0,.55,1) .9s infinite;
        }
        /* Frenar al pasar el puntero: si algo llama la atencion, se puede
           mirar tranquilo en vez de perseguirlo.
           El hover va sobre el grupo y no sobre cada marco: frenando uno
           solo, el monitor y el telefono quedaban en puntos distintos de la
           pagina y la desincronizacion parecia un error. */
        .grupo-capturas:hover .captura,
        .grupo-capturas:focus-within .captura { animation-play-state: paused; }

        @keyframes recorrerSitio {
          0%,  6%  { transform: translateY(0); }
          62%, 72% { transform: translateY(var(--recorrido)); }
          100%     { transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .captura { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <Titulo
            className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-4"
            style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}
          >
            <RevealText text="TRABAJOS RECIENTES" />
          </Titulo>
          <p
            className={`text-space-text-secondary transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Cinco sitios en el aire. Cada uno se recorre solo — pasá el puntero para frenarlo.
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
            {/* Lista y ficha */}
            <div className="order-2 lg:order-1">
              <span className="font-mono text-[10px] tracking-[0.28em] text-space-text-muted">
                [ {String(activo + 1).padStart(2, '0')} / {String(TRABAJOS.length).padStart(2, '0')} ]
              </span>

              <ul className="mt-4 border-t" style={{ borderColor: 'rgba(108,99,255,0.16)' }}>
                {TRABAJOS.map((t, i) => {
                  const esActivo = i === activo;
                  return (
                    <li key={t.slug} className="border-b" style={{ borderColor: 'rgba(108,99,255,0.16)' }}>
                      <button
                        type="button"
                        onClick={() => setActivo(i)}
                        aria-current={esActivo ? 'true' : undefined}
                        className="w-full text-left py-3.5 flex items-center gap-3 group/item"
                      >
                        <span
                          className="block flex-shrink-0 rounded-full transition-all duration-300"
                          style={{
                            width: esActivo ? 22 : 6,
                            height: 6,
                            background: esActivo ? COLOR_TAG[t.tag] : 'rgba(255,255,255,0.18)',
                            boxShadow: esActivo ? `0 0 12px ${COLOR_TAG[t.tag]}` : 'none',
                          }}
                        />
                        <span
                          className={`font-display text-sm tracking-wide transition-colors ${
                            esActivo ? 'text-space-text' : 'text-space-text-secondary group-hover/item:text-space-text'
                          }`}
                        >
                          {t.titulo}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7">
                <span
                  className="inline-block px-3 py-1 text-[11px] font-semibold rounded-full"
                  style={{
                    background: `${COLOR_TAG[trabajo.tag]}18`,
                    border: `1px solid ${COLOR_TAG[trabajo.tag]}50`,
                    color: COLOR_TAG[trabajo.tag],
                  }}
                >
                  {trabajo.tag}
                </span>
                <p className="mt-4 text-space-text-secondary text-sm leading-relaxed">{trabajo.descripcion}</p>
                <a
                  href={trabajo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-space-accent hover:gap-3 transition-all"
                >
                  {trabajo.dominio}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Los equipos.
                En pantallas chicas el telefono se apoya ENCIMA del monitor,
                en su esquina. Uno al lado del otro, en 375 px de ancho, el
                monitor se quedaba con 255 px y el telefono con 80: ninguno
                de los dos se leia. Superpuesto, el monitor usa todo el ancho
                y el telefono igual se ve, que es lo que importa — quien
                quiera el detalle toca y abre el sitio de verdad. */}
            <div className="order-1 lg:order-2 relative flex items-end sm:gap-5 grupo-capturas">
              <div className="w-full sm:flex-1 sm:min-w-0">
                <Monitor trabajo={trabajo} />
              </div>
              <div className="absolute right-0 -bottom-1 w-[30%] max-w-[120px] z-10 sm:static sm:w-[22%] sm:max-w-[170px] sm:mb-[26px] sm:flex-shrink-0">
                <Telefono trabajo={trabajo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
