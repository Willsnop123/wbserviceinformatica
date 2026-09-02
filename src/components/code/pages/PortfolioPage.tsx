import CodeChrome from '@/components/code/CodeChrome';
import Portfolio from '@/components/code/sections/Portfolio';
import Technologies from '@/components/code/sections/Technologies';

export default function PortfolioPage() {
  return (
    <CodeChrome active="/code/portfolio/">
      <Portfolio comoH1 />
      <Technologies />
    </CodeChrome>
  );
}
