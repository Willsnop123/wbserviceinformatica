import { Suspense, lazy } from 'react';
import Header from '@/components/code/layout/Header';
import Footer from '@/components/code/layout/Footer';
import Redes from '@/components/code/sections/Redes';
import CustomCursor from '@/components/code/effects/CustomCursor';
import SupernovaEffect from '@/components/code/effects/SupernovaEffect';
import GrainOverlay from '@/components/code/effects/GrainOverlay';
import WhatsAppButton from '@/components/code/layout/WhatsAppButton';
import { useLenis } from '@/hooks/useLenis';

// Three.js pesa mas que todo el resto junto: se carga aparte y solo cuando
// el navegador ya pinto la pagina.
const NebulaBackground = lazy(() => import('@/components/code/effects/NebulaBackground'));

interface Props {
  active?: string;
  children?: React.ReactNode;
}

/**
 * Marco compartido del ala WB Code: cabecera, pie y las capas ambientales.
 * Las secciones se montan como hijos desde cada pagina .astro.
 */
export default function CodeChrome({ active, children }: Props) {
  useLenis();

  return (
    <>
      <CustomCursor />
      <SupernovaEffect />

      <Suspense fallback={null}>
        <NebulaBackground />
      </Suspense>

      <div className="relative z-10">
        <Header active={active} />
        <main>{children}</main>
        <Redes />
        <Footer />
      </div>

      <GrainOverlay />
      <WhatsAppButton />
    </>
  );
}
