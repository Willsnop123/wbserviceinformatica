import { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import Magnetic from '@/components/code/effects/Magnetic';

const navLinks = [
  { label: 'Servicios', href: '/code/servicios/' },
  { label: 'Portfolio', href: '/code/portfolio/' },
  { label: 'Planes', href: '/code/planes/' },
  { label: 'Contacto', href: '/code/contacto/' },
];

interface Props {
  active?: string;
}

export default function Header({ active }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Con el menu abierto el fondo no debe scrollear detras del panel.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-space-bg/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <a
              href="/code/"
              aria-label="WB Code, ir al inicio"
              className="hover:opacity-80 transition-opacity"
            >
              <span
                className="marca marca-code text-2xl text-space-text"
                style={{ viewTransitionName: 'marca-wb' }}
              >
                <span className="marca-wb">WB</span>
                <span className="marca-cursor" aria-hidden="true" />
                <span className="marca-ala">Code</span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active === link.href ? 'page' : undefined}
                  className={`relative text-sm transition-colors duration-300 group ${
                    active === link.href ? 'text-space-text' : 'text-space-text-secondary hover:text-space-text'
                  }`}
                >
                  <span
                    className={`absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-space-accent transition-opacity ${
                      active === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:block">
              <Magnetic strength={0.28} radius={70}>
                <a
                  href="/code/contacto/"
                  className="flex items-center gap-2 px-5 py-2.5 border border-space-accent text-sm text-space-text hover:bg-space-accent/10 hover:shadow-glow transition-all duration-300 rounded-full"
                >
                  <Rocket className="w-4 h-4" />
                  INICIAR PROYECTO
                </a>
              </Magnetic>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="lg:hidden p-2 text-space-text hover:text-space-accent transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-space-bg/98 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="text-2xl font-display text-space-text hover:text-space-accent transition-colors"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.4s ease-out ${mobileOpen ? i * 100 : 0}ms`,
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/"
            className="mt-6 text-sm tracking-widest text-space-text-muted hover:text-space-accent transition-colors uppercase"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transition: `opacity 0.4s ease-out ${mobileOpen ? 500 : 0}ms`,
            }}
          >
            ← Ir a WB Service
          </a>
        </div>
      </div>
    </>
  );
}
