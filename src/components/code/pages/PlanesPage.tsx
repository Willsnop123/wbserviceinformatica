import CodeChrome from '@/components/code/CodeChrome';
import Plans from '@/components/code/sections/Plans';
import Process from '@/components/code/sections/Process';

export default function PlanesPage() {
  return (
    <CodeChrome active="/code/planes/">
      <Plans comoH1 />
      <Process />
    </CodeChrome>
  );
}
