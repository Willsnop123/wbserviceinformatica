import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Devuelve la URL de un archivo de `public/` con un sufijo que cambia cuando
 * cambia su contenido.
 *
 * Por qué hace falta: los archivos que empaqueta Astro llevan un hash en el
 * nombre, así que al cambiar cambian de URL y el navegador los vuelve a
 * pedir solo. Los de `public/` no — `wb-script.js` se llama siempre igual.
 * Cloudflare Pages les pone cuatro horas de caché, y durante esas cuatro
 * horas quien ya visitó el sitio sigue usando su copia vieja sin preguntar:
 * queda con el HTML nuevo y el JavaScript viejo.
 *
 * Lo intenté primero con `public/_headers`. No sirve: medido el 2026-11-04
 * contra producción, con `cf-cache-status: MISS` — o sea, respuesta del
 * origen, sin caché del borde de por medio — la cabecera declarada ahí no
 * llegaba a la respuesta. Cloudflare Pages maneja el caché de sus estáticos
 * por su cuenta.
 *
 * Esto se resuelve en el build, no en el navegador: si el archivo no cambió,
 * la URL es la misma y el caché sigue sirviendo.
 */
const cache = new Map<string, string>();

export function versionado(rutaPublica: string): string {
  const yaEsta = cache.get(rutaPublica);
  if (yaEsta) return yaEsta;

  // Se resuelve contra la raíz del proyecto. `import.meta.url` no sirve acá:
  // en el build apunta al chunk compilado dentro de dist/, no al fuente.
  const absoluta = join(process.cwd(), 'public', rutaPublica);
  const hash = createHash('sha1').update(readFileSync(absoluta)).digest('hex').slice(0, 8);
  const url = `${rutaPublica}?v=${hash}`;
  cache.set(rutaPublica, url);
  return url;
}
