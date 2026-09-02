import { useState, useEffect, useRef } from 'react';
import { Mail, Globe, Clock, Send, Loader2, MessageCircle, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '@/hooks/useInView';
import RevealText from '@/components/code/effects/RevealText';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.15 });
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<'idle' | 'sending'>('idle');
  const [selectedProject, setSelectedProject] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const projectOptions = [
    { value: 'landing', label: 'Landing Page' },
    { value: 'sitio', label: 'Sitio Web' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'otro', label: 'Otro' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isInView || !formRef.current) return;

    const fields = formRef.current.querySelectorAll('.form-field');

    gsap.fromTo(
      fields,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      }
    );
  }, [isInView]);

  // Hasta que la fase 5 conecte un backend, el formulario arma el mensaje y
  // abre WhatsApp. Es lo unico honesto que se puede hacer sin servidor: antes
  // simulaba el envio con un setTimeout y mostraba "MENSAJE ENVIADO" sin que
  // nada saliera a ningun lado.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');

    const tipo = projectOptions.find((o) => o.value === selectedProject)?.label ?? 'Sin especificar';
    const texto = [
      'Hola! Quiero consultar por un proyecto web.',
      '',
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `Tipo de proyecto: ${tipo}`,
      '',
      mensaje,
    ].join('\n');

    window.open(`https://wa.me/5493444569948?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    setFormState('idle');
  };

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="relative min-h-[80vh] py-32 px-6"
    >
      {/* Section atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* HUD corner brackets */}
        <div className="absolute top-8 left-8 w-8 h-8" style={{ borderLeft: '2px solid rgba(108,99,255,0.28)', borderTop: '2px solid rgba(108,99,255,0.28)' }} />
        <div className="absolute top-8 right-8 w-8 h-8" style={{ borderRight: '2px solid rgba(108,99,255,0.28)', borderTop: '2px solid rgba(108,99,255,0.28)' }} />
        <div className="absolute bottom-8 left-8 w-8 h-8" style={{ borderLeft: '2px solid rgba(108,99,255,0.28)', borderBottom: '2px solid rgba(108,99,255,0.28)' }} />
        <div className="absolute bottom-8 right-8 w-8 h-8" style={{ borderRight: '2px solid rgba(108,99,255,0.28)', borderBottom: '2px solid rgba(108,99,255,0.28)' }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-wider text-space-text mb-6"
              style={{ filter: 'drop-shadow(0 0 32px rgba(108,99,255,0.45))' }}>
            <RevealText text="HABLEMOS" />
          </h2>
          <p
            className={`text-lg text-space-text-secondary max-w-2xl mx-auto transition-all duration-1000 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Inicia tu viaje espacial. Cuentanos sobre tu proyecto y te responderemos en orbita.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-200 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <Mail className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">Email</p>
                <a
                  href="mailto:hola@wbserviceinformatica.com.ar"
                  className="text-space-text hover:text-space-accent transition-colors"
                >
                  hola@wbserviceinformatica.com.ar
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">WhatsApp</p>
                <a
                  href="https://wa.me/5493444569948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-space-text hover:text-space-accent transition-colors"
                >
                  +54 9 3444 569948
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <Globe className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">Ubicación</p>
                <p className="text-space-text">Gualeguay, Entre Ríos, Argentina</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-space-accent/10 border border-space-accent/20 flex items-center justify-center group-hover:bg-space-accent/20 transition-colors">
                <Clock className="w-5 h-5 text-space-accent" />
              </div>
              <div>
                <p className="text-sm text-space-text-muted">Horario</p>
                <p className="text-space-text">Lun-Vie, 8:00-12:00 / 16:00-20:00 ART</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <p className="text-space-text-muted italic text-sm">
                "Cada gran viaje comienza con una transmision."
              </p>

              {/* HUD mission coordinates */}
              <div className="mt-6 font-mono leading-relaxed select-none"
                style={{ color: 'rgba(160,168,255,0.38)', fontSize: '10px', letterSpacing: '0.18em' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-4 h-px" style={{ background: 'rgba(108,99,255,0.45)' }} />
                  COORDENADAS DE MISION
                </div>
                <div>LAT 33°09&apos;S &nbsp;·&nbsp; LON 059°21&apos;W</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: '#38E8B0', boxShadow: '0 0 7px rgba(56,232,176,0.8)' }} />
                  SEÑAL ESTABLE &nbsp;·&nbsp; ONLINE
                </div>
                <div className="mt-1">SYS.STATUS: OPERACIONAL</div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-field opacity-0">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text placeholder:text-space-text-muted outline-none transition-colors"
              />
            </div>

            <div className="form-field opacity-0">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text placeholder:text-space-text-muted outline-none transition-colors"
              />
            </div>

            <div className="form-field opacity-0" ref={dropdownRef} style={{ position: 'relative', zIndex: 30 }}>
              <input type="hidden" name="proyecto" value={selectedProject} required />
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className={`w-full flex items-center justify-between border-b py-3 outline-none transition-colors duration-200 ${
                  dropdownOpen ? 'border-space-accent' : 'border-space-text-muted'
                }`}
              >
                <span className={selectedProject ? 'text-space-text' : 'text-space-text-muted'}>
                  {selectedProject
                    ? projectOptions.find(o => o.value === selectedProject)?.label
                    : 'Tipo de proyecto'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-space-text-muted transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="relative z-50">
                  <div
                    className="absolute top-1 left-0 right-0 rounded-xl overflow-hidden"
                    style={{
                      background: 'rgba(10,10,18,0.95)',
                      border: '1px solid rgba(108,99,255,0.25)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(108,99,255,0.08)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {projectOptions.map((option, i) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => { setSelectedProject(option.value); setDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3 text-sm transition-all duration-150 group flex items-center gap-3"
                        style={{
                          borderBottom: i < projectOptions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          color: selectedProject === option.value ? '#6C63FF' : 'rgba(240,240,245,0.7)',
                          background: selectedProject === option.value ? 'rgba(108,99,255,0.08)' : 'transparent',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.12)')}
                        onMouseLeave={e => (e.currentTarget.style.background = selectedProject === option.value ? 'rgba(108,99,255,0.08)' : 'transparent')}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: selectedProject === option.value ? '#6C63FF' : 'rgba(255,255,255,0.2)' }}
                        />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-field opacity-0">
              <textarea
                placeholder="Mensaje"
                rows={4}
                required
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full bg-transparent border-b border-space-text-muted focus:border-space-accent py-3 text-space-text placeholder:text-space-text-muted outline-none transition-colors resize-none"
              />
            </div>

            <div className="form-field opacity-0 pt-4">
              <button
                type="submit"
                disabled={formState !== 'idle'}
                className={`w-full py-4 px-6 rounded-full font-medium tracking-wider transition-all duration-500 flex items-center justify-center gap-2 ${
                  'bg-space-accent text-white hover:bg-space-accent/90 hover:shadow-glow'
                } ${formState === 'sending' ? 'opacity-70' : ''}`}
              >
                {formState === 'idle' ? (
                  <>
                    <Send className="w-4 h-4" />
                    ENVIAR POR WHATSAPP
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ABRIENDO WHATSAPP...
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

