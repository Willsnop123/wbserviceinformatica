/**
 * Captura las pantallas del portfolio de WB Code.
 *
 * Toma cada sitio de la lista y guarda dos imagenes en
 * public/code/portfolio/: una de escritorio y una de celular, ambas de la
 * pagina entera (no solo lo que entra en una pantalla), para que el mockup
 * pueda mostrarlas desplazandose.
 *
 * No usa Playwright ni Puppeteer a proposito: descargarian un navegador
 * entero de unos 150 MB cuando ya hay un Chrome instalado. En vez de eso
 * se habla con ese Chrome por su protocolo de depuracion, que viaja por
 * WebSocket, y Node 24 ya trae cliente de WebSocket. La unica dependencia
 * real es sharp, que ya esta porque la usa Astro.
 *
 *   node scripts/capturar-portfolio.mjs            # todos
 *   node scripts/capturar-portfolio.mjs konig      # solo uno, por su slug
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const SITIOS = [
  { slug: 'vidasana', url: 'https://www.almacenvidasana.com.ar' },
  {
    slug: 'konig',
    url: 'https://www.cervezakonig.com.ar',
    // El sitio abre con un portal de edad que tapa todo. Sin esto, la
    // captura del portfolio muestra el cartel y no la cerveceria.
    //
    // Sin expresion regular a proposito: dentro de un template literal, \s
    // no es un escape valido y JavaScript lo deja en s, asi que /18\s*o/
    // termina siendo /18so/ y no coincide con nada. Paso una vez.
    // El unico boton del sitio que dice 18 es el de "Si, tengo 18 o mas".
    preparar: `[...document.querySelectorAll('button')]
      .find(b => (b.textContent || '').includes('18'))?.click()`,
  },
  { slug: 'martin', url: 'https://martingonzalezcueros.com.ar/' },
  { slug: 'dulce',  url: 'https://www.dulcearmonia.com.ar' },
  { slug: 'dvc',    url: 'https://dvcestudiojuridico.com.ar/' },
];

const SALIDA = 'public/code/portfolio';

// Cuantas pantallas de alto se capturan como maximo. Una tienda online
// puede medir 15.000 px de largo; pasado cierto punto no aporta nada al
// mockup y solo engorda lo que descarga el visitante. Se mide en pantallas
// y no en pixeles para que la proporcion sea la misma en los dos formatos:
// una pagina de celular siempre es mas alta que la misma en escritorio.
const PANTALLAS_MAX = 6;

// `anchoFinal` es el ancho con el que se guarda, y sale de a que tamaño se
// ve en el mockup, no de a que tamaño se capturo: el monitor mide como mucho
// 860 px en pantalla y el telefono unos 230. Con 1440 y 620 se ven nitidos
// en pantallas de alta densidad sin que el visitante baje megabytes de mas.
const FORMATOS = {
  escritorio: { ancho: 1440, alto: 900, escala: 2, movil: false, anchoFinal: 1440 },
  movil:      { ancho: 390,  alto: 844, escala: 3, movil: true,  anchoFinal: 620  },
};

const CALIDAD = 78;

const UA_MOVIL =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/157.0.0.0 Mobile Safari/537.36';

const CHROME = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env['ProgramFiles(x86)']}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => p && existsSync(p));

if (!CHROME) {
  console.error('No encontre Chrome instalado. Rutas probadas: ver CHROME en este archivo.');
  process.exit(1);
}

const dormir = ms => new Promise(r => setTimeout(r, ms));

/** Levanta un Chrome aparte, con su propio perfil, sin tocar el del usuario. */
async function abrirChrome() {
  const perfil = join(tmpdir(), 'wb-captura-' + Date.now());
  mkdirSync(perfil, { recursive: true });

  const proc = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  // Chrome anuncia en stderr el puerto que eligio.
  const puerto = await new Promise((res, rej) => {
    let buf = '';
    const t = setTimeout(() => rej(new Error('Chrome no anuncio su puerto en 30 s')), 30_000);
    proc.stderr.on('data', d => {
      buf += d;
      const m = buf.match(/ws:\/\/127\.0\.0\.1:(\d+)/);
      if (m) { clearTimeout(t); res(Number(m[1])); }
    });
    proc.on('exit', c => { clearTimeout(t); rej(new Error('Chrome se cerro con codigo ' + c)); });
  });

  return {
    puerto,
    cerrar() {
      proc.kill();
      try { rmSync(perfil, { recursive: true, force: true }); } catch {}
    },
  };
}

/** Un canal de protocolo contra una pestaña nueva. */
async function abrirPestana(puerto) {
  const r = await fetch(`http://127.0.0.1:${puerto}/json/new?about:blank`, { method: 'PUT' });
  const tab = await r.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('no pude conectar al protocolo')); });

  let id = 0;
  const pendientes = new Map();
  const oyentes = new Map();

  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== undefined) {
      const p = pendientes.get(msg.id);
      if (!p) return;
      pendientes.delete(msg.id);
      msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result);
    } else if (oyentes.has(msg.method)) {
      oyentes.get(msg.method)(msg.params);
    }
  };

  return {
    enviar(metodo, params = {}) {
      const n = ++id;
      return new Promise((res, rej) => {
        // Un Runtime.evaluate cuyo codigo explota NO contesta con error de
        // protocolo: contesta bien, y mete la excepcion en exceptionDetails.
        // Sin mirar ese campo, un fallo dentro de la pagina pasa totalmente
        // desapercibido y uno termina buscando el problema en otro lado.
        const envolver = {
          res: r => (r && r.exceptionDetails
            ? rej(new Error(`${metodo}: ${r.exceptionDetails.exception?.description
                || r.exceptionDetails.text}`))
            : res(r)),
          rej,
        };
        pendientes.set(n, envolver);
        ws.send(JSON.stringify({ id: n, method: metodo, params }));
        setTimeout(() => {
          if (pendientes.delete(n)) rej(new Error(metodo + ' no contesto en 90 s'));
        }, 90_000);
      });
    },
    al(evento, fn) { oyentes.set(evento, fn); },
    cerrar() { ws.close(); return fetch(`http://127.0.0.1:${puerto}/json/close/${tab.id}`); },
  };
}

async function capturar(puerto, { url, preparar }, fmt) {
  const p = await abrirPestana(puerto);
  try {
    await p.enviar('Page.enable');
    await p.enviar('Network.enable');

    await p.enviar('Emulation.setDeviceMetricsOverride', {
      width: fmt.ancho,
      height: fmt.alto,
      deviceScaleFactor: fmt.escala,
      mobile: fmt.movil,
      screenWidth: fmt.ancho,
      screenHeight: fmt.alto,
    });
    if (fmt.movil) {
      await p.enviar('Emulation.setUserAgentOverride', { userAgent: UA_MOVIL });
      await p.enviar('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    }

    const cargado = new Promise(res => p.al('Page.loadEventFired', res));
    await p.enviar('Page.navigate', { url });
    await Promise.race([cargado, dormir(45_000)]);

    // Pasos propios del sitio: portales de edad, carteles que tapan.
    if (preparar) {
      await p.enviar('Runtime.evaluate', { expression: preparar });
      await dormir(1200);
    }

    // Una pasada de arriba abajo para despertar lo que carga en diferido.
    // Se mide sobre documentElement y no sobre body: en muchos sitios el
    // alto vive en un contenedor y body.scrollHeight da casi cero, con lo
    // cual el bucle no daria ni una vuelta.
    await p.enviar('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        const esperar = ms => new Promise(r => setTimeout(r, ms));
        const alto = () => document.documentElement.scrollHeight;
        const paso = window.innerHeight * 0.7;
        for (let y = 0; y < alto(); y += paso) {
          window.scrollTo(0, y);
          await esperar(170);
        }
        window.scrollTo(0, 0);
        await esperar(500);
        await Promise.all([...document.images]
          .filter(i => !i.complete)
          .map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 3000); })));
      })()`,
    });
    await dormir(900);

    const { result: medida } = await p.enviar('Runtime.evaluate', {
      expression: `Math.min(document.documentElement.scrollHeight, ${fmt.alto * PANTALLAS_MAX})`,
    });
    const altoTotal = medida.value;

    // La captura va por franjas, no de un saque.
    //
    // `captureBeyondViewport` saca la pagina entera en una sola foto, pero
    // la saca con el scroll donde este — y estos sitios revelan su contenido
    // segun la posicion del scroll: desde arriba, todo lo de mas abajo esta
    // en opacity 0. La foto sale con los titulos y los textos en blanco.
    // (Konig ademas vuelve a ocultar lo que ya habia revelado al subir, asi
    // que ni siquiera alcanza con recorrerla antes.)
    //
    // Entonces se va parando en cada pantalla, se espera a que el revelado
    // termine, se fotografia solo lo que se ve — que ahi si esta visible — y
    // despues se cosen las franjas.
    // Las franjas se solapan y se recortan por los bordes.
    //
    // Las barras fijas y los botones flotantes viajan con la ventana, asi que
    // aparecen en todas las franjas y, al coser, saldrian repetidos a lo
    // largo de la pagina. Lo intente ocultandolos por estilo y no alcanzo:
    // el DOM los daba por ocultos y la foto seguia saliendo con la barra,
    // porque `captureScreenshot` entrega lo ultimo que el navegador compuso
    // y sin pantalla que refrescar el compositor no vuelve a dibujar. Ni
    // esperar, ni dos vueltas de requestAnimationFrame, ni pedir una captura
    // descartable primero lo resolvieron.
    //
    // Asi que no se depende de eso. Cada franja avanza MARGEN pixeles menos
    // de lo que mide, y al coser se descartan MARGEN de arriba y MARGEN de
    // abajo: justo las dos zonas donde se paran las barras y los botones
    // flotantes. Esa parte de la pagina igual aparece, pero tomada de la
    // franja vecina, donde cayo en el medio de la pantalla y no habia nada
    // encima. Las unicas excepciones son el borde de arriba de la primera
    // franja y el de abajo de la ultima, que se conservan enteros: ahi la
    // barra del sitio corresponde que se vea.
    const MARGEN = 140;
    const paso = fmt.alto - 2 * MARGEN;

    const paradas = [];
    for (let y = 0; ; y += paso) {
      paradas.push(y);
      if (y + fmt.alto >= altoTotal || paradas.length > 40) break;
    }

    const franjas = [];
    for (const y of paradas) {
      await p.enviar('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await dormir(y === 0 ? 700 : 480);

      // Donde quedo de verdad: al final de la pagina el scroll se topa y
      // pedir 4500 puede dejarte en 4120. Si la franja se pegara donde se
      // pidio en vez de donde quedo, la costura saldria corrida.
      const { result: real } = await p.enviar('Runtime.evaluate', { expression: 'window.scrollY' });

      const { data } = await p.enviar('Page.captureScreenshot', { format: 'png' });
      const png = Buffer.from(data, 'base64');
      if (process.env.WB_FRANJAS) {
        await writeFile(join(process.env.WB_FRANJAS, `franja-${Math.round(real.value)}.png`), png);
      }
      franjas.push({ y: Math.round(real.value), png });
    }

    // Coser. De cada franja se usa solo su tramo util, y se pega en la
    // posicion de la pagina que le corresponde.
    const esc = fmt.escala;
    const piezas = [];
    for (let i = 0; i < franjas.length; i++) {
      const f = franjas[i];
      const primera = i === 0;
      const ultima = i === franjas.length - 1;

      const desde = primera ? f.y : f.y + MARGEN;
      const hasta = Math.min(ultima ? f.y + fmt.alto : f.y + fmt.alto - MARGEN, altoTotal);
      if (hasta <= desde) continue; // el scroll se topo y esta franja no agrega nada

      piezas.push({
        input: await sharp(f.png)
          .extract({
            left: 0,
            top: Math.round((desde - f.y) * esc),
            width: Math.round(fmt.ancho * esc),
            height: Math.round((hasta - desde) * esc),
          })
          .png()
          .toBuffer(),
        left: 0,
        top: Math.round(desde * esc),
      });
    }

    const png = await sharp({
      create: {
        width: Math.round(fmt.ancho * esc),
        height: Math.round(altoTotal * esc),
        channels: 3,
        background: '#ffffff',
      },
    })
      .composite(piezas)
      .png()
      .toBuffer();

    return { png, altoCss: altoTotal, franjas: franjas.length };
  } finally {
    await p.cerrar().catch(() => {});
  }
}

const soloEste = process.argv[2];
const lista = soloEste ? SITIOS.filter(s => s.slug === soloEste) : SITIOS;
if (!lista.length) {
  console.error(`No hay ningun sitio con el slug "${soloEste}". Hay: ${SITIOS.map(s => s.slug).join(', ')}`);
  process.exit(1);
}

mkdirSync(SALIDA, { recursive: true });
const chrome = await abrirChrome();
console.log(`Chrome escuchando en el puerto ${chrome.puerto}\n`);

const resumen = [];
try {
  for (const sitio of lista) {
    for (const [nombre, fmt] of Object.entries(FORMATOS)) {
      process.stdout.write(`${sitio.slug} ${nombre} ... `);
      try {
        const { png, altoCss } = await capturar(chrome.puerto, sitio, fmt);
        const destino = join(SALIDA, `${sitio.slug}-${nombre}.webp`);
        const img = sharp(png).resize({ width: fmt.anchoFinal, withoutEnlargement: true });
        const info = await img.webp({ quality: CALIDAD, effort: 6 }).toFile(destino);
        console.log(`${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
        resumen.push({ sitio: sitio.slug, formato: nombre, w: info.width, h: info.height, kb: +(info.size / 1024).toFixed(0), altoCss });
      } catch (e) {
        console.log('FALLO: ' + e.message);
        resumen.push({ sitio: sitio.slug, formato: nombre, error: e.message });
      }
    }
  }
} finally {
  chrome.cerrar();
}

console.log('\n--- resumen ---');
console.table(resumen);
const fallos = resumen.filter(r => r.error);
if (fallos.length) {
  console.error(`\n${fallos.length} captura(s) fallaron.`);
  process.exit(1);
}
// Solo en la corrida completa: pedir un sitio suelto dejaria el registro con
// una sola fila y pareceria que los demas no existen.
if (!soloEste) {
  await writeFile(join(SALIDA, 'capturas.json'), JSON.stringify(resumen, null, 2) + '\n');
  console.log(`\nMedidas guardadas en ${join(SALIDA, 'capturas.json')}`);
}
