export default function WhatsAppButton() {
  return (
    <>
      <style>{`
        @keyframes wa-ring {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        .wa-ring-1 { animation: wa-ring 2.2s ease-out infinite; }
        .wa-ring-2 { animation: wa-ring 2.2s ease-out infinite 1.1s; }
        .wa-btn:hover .wa-tooltip { opacity: 1; transform: translateX(0); pointer-events: auto; }
        .wa-btn:hover { transform: scale(1.10); }
      `}</style>

      <a
        href="https://wa.me/5493444569948"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="wa-btn fixed bottom-7 right-7 z-50 flex items-center justify-center transition-transform duration-300"
        style={{ width: 58, height: 58 }}
      >
        {/* Pulse rings */}
        <span
          className="wa-ring-1 absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'rgba(108,99,255,0.35)' }}
        />
        <span
          className="wa-ring-2 absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'rgba(74,144,255,0.28)' }}
        />

        {/* Button body */}
        <span
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 58, height: 58,
            background: 'linear-gradient(135deg, #6C63FF 0%, #4A90FF 100%)',
            boxShadow: '0 0 22px rgba(108,99,255,0.55), 0 0 44px rgba(74,144,255,0.25), 0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          {/* Nebula shimmer overlay */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 65%)',
            }}
          />
          {/* WhatsApp icon */}
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="relative z-10"
            style={{ width: 28, height: 28 }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </span>

        {/* Tooltip */}
        <span
          className="wa-tooltip absolute right-16 whitespace-nowrap pointer-events-none"
          style={{
            opacity: 0,
            transform: 'translateX(8px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            background: 'rgba(8,8,20,0.92)',
            border: '1px solid rgba(108,99,255,0.35)',
            boxShadow: '0 0 16px rgba(108,99,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            color: '#f0f0f8',
            letterSpacing: '0.02em',
          }}
        >
          ¡Hablemos por WhatsApp!
        </span>
      </a>
    </>
  );
}
