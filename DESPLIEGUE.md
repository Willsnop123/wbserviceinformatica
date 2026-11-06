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

## Las capturas del portfolio de WB Code

Las pantallas que se ven en `/code/portfolio/` no son fotos a mano: las
genera un script contra los sitios en vivo.

```bash
node scripts/capturar-portfolio.mjs            # los cinco
node scripts/capturar-portfolio.mjs konig      # uno solo, por su slug
```

Para agregar un trabajo nuevo hay que tocar dos lugares: la lista `SITIOS`
del script, y la lista `TRABAJOS` de
`src/components/code/sections/Portfolio.tsx`. El slug tiene que ser el
mismo en los dos — es lo que une el proyecto con sus imágenes.

Usa el Chrome que ya está instalado, hablándole por su protocolo de
depuración. No descarga ningún navegador.

Dos cosas que conviene saber si algo sale raro:

- **Si un sitio abre con un cartel encima** (Konig tiene un control de
  edad), hay que agregarle un `preparar` en su entrada de `SITIOS`: un
  pedacito de JavaScript que lo cierre antes de fotografiar.
- **La captura va por franjas superpuestas, no de una sola foto.** Estos
  sitios revelan su contenido a medida que uno baja, así que una foto
  tomada desde arriba sale con los textos en blanco. Y los bordes de cada
  franja se descartan porque ahí viven las barras fijas y los botones
  flotantes, que si no salen repetidos a lo largo de la página.

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

## Por qué los scripts llevan `?v=` en la URL

`wb-script.js` y `galeria.js` viven en `public/`, así que se llaman
siempre igual. Los que empaqueta Astro llevan un hash en el nombre y se
renuevan solos; estos no. Cloudflare Pages les pone cuatro horas de
caché: durante esas cuatro horas, quien ya visitó el sitio sigue usando
su copia vieja del JavaScript junto con el HTML nuevo, aunque la
corrección ya esté publicada.

Pasó el 2026-11-04 y costó un rato entenderlo, porque `curl` mostraba el
archivo nuevo —  `curl` no cachea — mientras el navegador seguía con el
viejo.

**Intenté resolverlo con `public/_headers` y no funciona.** Medido contra
producción con `cf-cache-status: MISS` (respuesta del origen, sin caché
del borde de por medio), la cabecera declarada ahí no llega a la
respuesta: Cloudflare Pages maneja el caché de sus estáticos por su
cuenta.

Lo que sí funciona es `src/lib/version.ts`: calcula un hash del contenido
del archivo durante el build y lo agrega a la URL. Si el archivo cambia,
cambia la URL y el navegador lo pide de nuevo; si no cambia, el caché
sigue sirviendo. No hay nada que recordar bumpear a mano.

Si alguna vez una corrección de JavaScript no se ve en producción aunque
el deploy haya terminado, comparar el tamaño del archivo que sirve el
navegador contra el que sirve `curl`.

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
