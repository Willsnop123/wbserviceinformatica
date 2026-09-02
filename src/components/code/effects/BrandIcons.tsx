/**
 * Iconos de marca en SVG propio.
 *
 * lucide-react 1.x quito Instagram y Facebook de su set. Se dibujan aca con
 * los mismos trazos que usa el ala de servicio tecnico, asi el mismo perfil
 * se ve igual en los dos mundos.
 */

interface Props {
  className?: string;
}

export function Instagram({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Facebook({ className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.5-1.5H16.5V4.2c-.3 0-1.2-.2-2.3-.2-2.3 0-3.7 1.4-3.7 3.9V10.5H8v3h2.5V21h3z" />
    </svg>
  );
}
