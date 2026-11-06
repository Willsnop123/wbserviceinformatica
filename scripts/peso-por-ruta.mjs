/**
 * Mide lo que un visitante descarga en cada ruta.
 *
 * No alcanza con listar dist/: ahi conviven chunks que ninguna pagina carga.
 * Esto parte de los <script> de cada HTML y sigue el grafo de imports, que es
 * lo unico que dice de verdad cuanto JS baja quien entra a esa ruta.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = 'dist';
const gz = (f) => {
  try { return zlib.gzipSync(fs.readFileSync(f)).length; } catch { return 0; }
};

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
})(DIST);

/**
 * Separa lo que baja antes de que la pagina sea interactiva (imports estaticos)
 * de lo que llega despues (import() diferido). Mezclarlos infla el numero que
 * de verdad siente el visitante al entrar.
 */
function deps(entry, inicial = new Set(), diferido = new Set(), esDiferido = false) {
  const destino = esDiferido ? diferido : inicial;
  if (inicial.has(entry) || diferido.has(entry) || !fs.existsSync(entry)) return { inicial, diferido };
  destino.add(entry);

  const src = fs.readFileSync(entry, 'utf8');
  const dinamicos = new Set(
    [...src.matchAll(/import\s*\(\s*["'`](\.{1,2}\/[^"'`]*?\.js)["'`]/g)].map((m) => m[1])
  );

  for (const m of src.matchAll(/["'`](\.{1,2}\/[^"'`]*?\.js)["'`]/g)) {
    const rel = m[1];
    const resolved = path.resolve(path.dirname(entry), rel);
    if (!fs.existsSync(resolved)) continue;
    deps(resolved, inicial, diferido, esDiferido || dinamicos.has(rel));
  }
  return { inicial, diferido };
}

const rows = [];
for (const p of pages.sort()) {
  const html = fs.readFileSync(p, 'utf8');
  // Las islas no se cargan con <script src>: el custom element astro-island
  // trae la url del componente y la del renderer en sus atributos.
  // El `(?:\?[^"]*)?` del final no sobra: los scripts de public/ se sirven
  // con el hash de su contenido pegado a la URL (ver src/lib/version.ts).
  // Sin contemplarlo, /wb-script.js?v=85c0357e no coincidia y el script
  // quedaba fuera de la cuenta: WB Service figuraba con 11 KB en vez de 20.
  const srcs = [
    ...[...html.matchAll(/<script[^>]*src="(\/[^"?]+\.js)(?:\?[^"]*)?"/g)].map((m) => m[1]),
    ...[...html.matchAll(/(?:component|renderer)-url="(\/[^"?]+\.js)(?:\?[^"]*)?"/g)].map((m) => m[1]),
  ];
  const inicial = new Set();
  const diferido = new Set();
  for (const s of srcs) {
    const r = deps(path.join(DIST, s), inicial, diferido);
    r.inicial.forEach((m) => inicial.add(m));
    r.diferido.forEach((m) => diferido.add(m));
  }

  const suma = (set) => [...set].reduce((n, f) => n + gz(f), 0);
  const rel = path.relative(DIST, path.dirname(p)).split(path.sep).join('/');
  rows.push({
    ruta: '/' + rel + (rel ? '/' : ''),
    html: gz(p),
    inicial: suma(inicial),
    diferido: suma(diferido),
  });
}

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log('RUTA'.padEnd(22) + 'HTML'.padStart(9) + 'JS INICIAL'.padStart(12) + 'JS DIFERIDO'.padStart(13));
console.log('-'.repeat(56));
for (const r of rows) {
  console.log(
    r.ruta.padEnd(22) + kb(r.html).padStart(9) + kb(r.inicial).padStart(12) + kb(r.diferido).padStart(13)
  );
}

const servicio = rows.filter((r) => !r.ruta.startsWith('/code'));
const code = rows.filter((r) => r.ruta.startsWith('/code'));
const max = (a, k) => Math.max(...a.map((r) => r[k]));
console.log('');
console.log('WB Service — JS inicial maximo:', kb(max(servicio, 'inicial')));
console.log('WB Code    — JS inicial maximo:', kb(max(code, 'inicial')), '| diferido:', kb(max(code, 'diferido')));
