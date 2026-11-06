# Originales de las imágenes de servicios

Las imágenes que se ven en la sección de servicios de la portada salen de
acá. Están **fuera de `public/`** a propósito: todo lo que vive en `public/`
se publica al sitio, y estos originales pesan ocho veces más que lo que
necesita el visitante.

Son 1672x941. El panel es vertical (5:6), así que de los 941 de alto salen
784 de ancho y se recorta a lo largo. El `left` de cada una no es el centro:
se eligió mirando dónde está lo que hay que mostrar.

Para volver a generarlas:

```bash
node -e "
const sharp=require('sharp');
const mapa=[['pc',800],['consolas',660],['joysticks',380],['comercios',600]];
(async()=>{ for(const [n,left] of mapa){
  await sharp('recursos/imagenes-originales/'+n+'.webp')
    .extract({left,top:0,width:784,height:941})
    .resize(1000,1200).webp({quality:80,effort:6})
    .toFile('public/imagenes/servicio-'+n+'.webp');
}})()"
```

Si cambiás una imagen por otra, lo único que hay que ajustar es su `left`.
