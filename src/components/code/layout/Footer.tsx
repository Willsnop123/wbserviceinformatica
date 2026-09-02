import { Heart } from 'lucide-react';
import { Instagram, Facebook } from '@/components/code/effects/BrandIcons';
import WbCodeIcon from '@/components/code/effects/WbCodeIcon';

const navLinks = [
  { label: 'Servicios', href: '/code/servicios/' },
  { label: 'Portfolio', href: '/code/portfolio/' },
  { label: 'Planes', href: '/code/planes/' },
  { label: 'Contacto', href: '/code/contacto/' },
];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/wbservice.informatica/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61588118462692&locale=es_LA', label: 'Facebook' },
  { icon: WhatsAppIcon, href: 'https://wa.me/5493444569948', label: 'WhatsApp' },
];

/**
 * Las estrellas se calculan una sola vez con una secuencia determinista.
 *
 * Antes salian de Math.random() en pleno render: con la pagina pre-renderizada
 * el servidor y el navegador generaban posiciones distintas y React tiraba un
 * error de hidratacion en cada carga. En la SPA original no pasaba porque no
 * habia render en servidor con el cual discrepar.
 */
const STARS = (() => {
  let semilla = 20260901;
  const rnd = () => {
    semilla = (semilla * 1664525 + 1013904223) % 4294967296;
    return semilla / 4294967296;
  };
  return Array.from({ length: 20 }, () => ({
    left: `${(rnd() * 100).toFixed(3)}%`,
    top: `${(rnd() * 100).toFixed(3)}%`,
    delay: `${(rnd() * 5).toFixed(3)}s`,
    duration: `${(2 + rnd() * 4).toFixed(3)}s`,
  }));
})();

export default function Footer() {

  return (
    <footer className="relative py-20 px-6 border-t border-white/5">
      {/* Twinkling stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full animate-twinkle"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <a
            href="/code/"
            className="flex flex-col items-center gap-3 mx-auto w-fit hover:opacity-80 transition-opacity"
          >
            <WbCodeIcon size={80} />
            <span className="font-display text-2xl font-bold text-space-text tracking-wider">WB CODE</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-space-text-secondary hover:text-space-text transition-colors group"
            >
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-space-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-space-text-muted flex items-center justify-center text-space-text-muted hover:text-white hover:bg-space-accent hover:border-space-accent transition-all duration-300"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-space-text-muted text-sm">
          <p>© 2026 WB Code · una unidad de WB Service. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-space-accent fill-space-accent" /> entre las estrellas
          </p>
        </div>
      </div>
    </footer>
  );
}
