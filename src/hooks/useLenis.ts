import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    // Quien pidio menos movimiento no quiere que le secuestren el scroll.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // La referencia se guarda: pasarle una funcion nueva a ticker.remove no
    // quita nada, y el callback seguiria corriendo despues de desmontar.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);
}
