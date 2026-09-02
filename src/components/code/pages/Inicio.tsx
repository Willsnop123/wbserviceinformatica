import CodeChrome from '@/components/code/CodeChrome';
import Hero from '@/components/code/sections/Hero';
import Services from '@/components/code/sections/Services';
import Technologies from '@/components/code/sections/Technologies';

export default function Inicio() {
  return (
    <CodeChrome>
      <Hero />
      <Services />
      <Technologies />
    </CodeChrome>
  );
}
