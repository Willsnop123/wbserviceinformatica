/**
 * Chequeo de SEO sobre el build.
 *
 * Que compile no dice nada: un canonical apuntando a otra pagina, un title
 * duplicado o un JSON-LD mal formado pasan el build sin una sola queja y se
 * pagan meses despues en posiciones.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SITIO = 'https://wbserviceinformatica.com.ar';

const paginas = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') paginas.push(p);
  }
})(DIST);

const fallos = [];
const titles = new Map();
const descs = new Map();
let conSchema = 0;

const uno = (html, re) => (html.match(re) || [])[1];

for (const p of paginas.sort()) {
  const html = fs.readFileSync(p, 'utf8');
  const rel = path.relative(DIST, path.dirname(p)).split(path.sep).join('/');
  const ruta = rel === '' ? '/' : `/${rel}/`;
  const falla = (m) => fallos.push(`${ruta.padEnd(24)} ${m}`);

  const title = uno(html, /<title>([^<]*)<\/title>/);
  const desc = uno(html, /<meta name="description" content="([^"]*)"/);
  const canonical = uno(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = uno(html, /<meta name="robots" content="([^"]*)"/);

  if (!title) falla('sin <title>');
  else {
    if (title.length > 65) falla(`title de ${title.length} caracteres (Google corta cerca de 60)`);
    titles.set(title, (titles.get(title) || 0) + 1);
  }

  if (!desc) falla('sin meta description');
  else {
    if (desc.length > 165) falla(`description de ${desc.length} caracteres (se corta cerca de 160)`);
    descs.set(desc, (descs.get(desc) || 0) + 1);
  }

  // El canonical tiene que apuntar a la propia pagina. Uno mal puesto le dice
  // a Google que esta pagina no vale y que indexe otra en su lugar.
  const esperado = SITIO + ruta;
  if (!canonical) falla('sin canonical');
  else if (canonical !== esperado) falla(`canonical apunta a ${canonical}, deberia ser ${esperado}`);

  if (robots && /noindex/.test(robots)) falla('marcada noindex — no va a aparecer en Google');

  if (!/og:title/.test(html)) falla('sin Open Graph (link feo al compartir por WhatsApp)');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      conSchema++;
      const nodos = j['@graph'] || [j];
      for (const n of nodos) if (!n['@type']) falla('nodo de JSON-LD sin @type');
    } catch (e) {
      falla('JSON-LD no parsea: ' + e.message);
    }
  }

  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 === 0) falla('sin <h1>');
  else if (h1 > 1) falla(`${h1} elementos <h1> (deberia haber uno)`);
}

for (const [t, n] of titles) if (n > 1) fallos.push(`title repetido en ${n} paginas: "${t.slice(0, 50)}..."`);
for (const [d, n] of descs) if (n > 1) fallos.push(`description repetida en ${n} paginas`);

console.log(`Paginas revisadas: ${paginas.length}`);
console.log(`Bloques de JSON-LD validos: ${conSchema}`);
console.log('');

if (fallos.length === 0) {
  console.log('Sin problemas.');
} else {
  console.log(`PROBLEMAS (${fallos.length}):`);
  for (const f of fallos) console.log('  ' + f);
  process.exitCode = 1;
}
