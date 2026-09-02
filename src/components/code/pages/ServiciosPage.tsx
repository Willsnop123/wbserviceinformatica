import CodeChrome from '@/components/code/CodeChrome';
import Services from '@/components/code/sections/Services';
import Process from '@/components/code/sections/Process';

export default function ServiciosPage() {
  return (
    <CodeChrome active="/code/servicios/">
      <Services />
      <Process />
    </CodeChrome>
  );
}
