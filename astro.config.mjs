import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// El sitio vive en el apex: www ya devuelve 301 hacia aca. El canonical
// historico apuntaba a www, o sea a una URL que redirige a otra parte.
export default defineConfig({
  site: 'https://wbserviceinformatica.com.ar',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      // El sitemap le dice a Google que existe; el buscador decide cuando
      // pasar. Poner fechas o prioridades inventadas no acelera nada.
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
