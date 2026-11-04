# Cómo se publica este sitio

## Qué hay acá

Un solo sitio Astro con dos alas:

- **WB Service** — servicio técnico, en la raíz del dominio
- **WB Code** — desarrollo web, en `/code`

Las une un portal que cruza de un mundo al otro sin recargar la página.

## Publicar un cambio

```bash
npm run dev          # ver el sitio mientras trabajás (http://localhost:4321)
npm run dev -- --host   # además accesible desde el celular en la misma wifi
npm run build        # generar el sitio final en dist/
```

Después de cualquier cambio, antes de subir:

```bash
npm run build && node scripts/verificar-seo.mjs
```

Ese chequeo revisa las 12 páginas: que el canonical apunte a la propia
página, el largo de títulos y descripciones, que haya un solo `h1`, que el
JSON-LD sea válido y que no haya títulos repetidos. Un build verde no
garantiza nada de eso.

Para ver cuánto JavaScript descarga cada ruta:

```bash
node scripts/peso-por-ruta.mjs
```

## Configuración de Cloudflare Pages

| | |
|---|---|
| Comando de build | `npm run build` |
| Carpeta de salida | `dist` |
| Rama de producción | `main` |
| Versión de Node | la toma de `.nvmrc` (22.12.0) |

Astro 7 exige Node 22.12 o superior. Si alguna vez falla el build en
Cloudflare con un error raro de sintaxis, revisar que `.nvmrc` siga ahí.

## Las redirecciones

`public/_redirects` tiene las 301 que conservan el posicionamiento ganado.
La única URL que cambió de dirección de verdad al migrar fue
`/galeria.html` → `/galeria/`.

**No borrar ese archivo.** Sin él, Google pierde el rastro de las
direcciones viejas y hay que volver a ganar las posiciones desde cero.

## Las cabeceras de caché

`public/_headers` existe por un motivo concreto. Los archivos que Astro
empaqueta llevan un hash en el nombre, así que cuando cambian cambia la
URL y el navegador los pide solos. Los de `public/` no: `wb-script.js`
se llama siempre igual, y Cloudflare Pages por defecto le pone cuatro
horas de caché. Durante esas cuatro horas, quien ya visitó el sitio sigue
usando su copia vieja del JavaScript junto con el HTML nuevo, aunque ya
hayamos publicado la corrección.

Pasó el 2026-11-04 y costó un rato entender por qué el sitio seguía roto
en un navegador y andaba en otro. **No borrar ese archivo.**

Si alguna vez una corrección de JavaScript no se ve en producción aunque
el deploy haya terminado, lo primero es comparar el tamaño del archivo
que sirve el navegador contra el que sirve `curl`.

## Archivos que no se tocan

- `public/googledc90d44876b2a389.html` — verificación de Google Search
  Console. Si desaparece, Search Console deja de reconocer el sitio.
- `public/CNAME` — resto de GitHub Pages. En Cloudflare Pages no hace
  nada, pero se conserva: si alguna vez hay que volver atrás apuntando el
  dominio a GitHub Pages, ese archivo es necesario.

## Volver atrás

Cada versión queda guardada en GitHub. Para volver al sitio anterior:
apuntar el dominio de vuelta a GitHub Pages desde el panel de Cloudflare.
Tarda minutos, no días.
