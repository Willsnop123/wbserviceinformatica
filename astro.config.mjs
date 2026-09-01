import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// El sitio se sirve en el apex sin www (ver public/CNAME), pero el canonical
// historico apunta a www. Se unifica en la fase 5 junto con las redirecciones.
export default defineConfig({
  site: 'https://www.wbserviceinformatica.com.ar',
  integrations: [react(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
