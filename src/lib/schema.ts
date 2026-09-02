/**
 * Datos estructurados del sitio.
 *
 * Los dos mundos se declaran como negocios distintos con el mismo dueño:
 * WB Service es un LocalBusiness (taller fisico, atiende una zona) y WB Code
 * un ProfessionalService (trabajo remoto, sin local al publico). Meterlos en
 * una sola ficha confundiria las dos busquedas que queremos ganar.
 */

export const SITIO = 'https://wbserviceinformatica.com.ar';
export const TELEFONO = '+5493444569948';

const DIRECCION = {
  '@type': 'PostalAddress',
  addressLocality: 'Gualeguay',
  addressRegion: 'Entre Ríos',
  addressCountry: 'AR',
};

const GEO = {
  '@type': 'GeoCoordinates',
  latitude: -33.1416,
  longitude: -59.3174,
};

/** Miga de pan. Google la usa para mostrar la ruta en vez de la URL cruda. */
export function migas(items: { nombre: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nombre,
      item: `${SITIO}${it.url}`,
    })),
  };
}

/** Un servicio concreto del taller, colgado del negocio. */
export function servicio(nombre: string, descripcion: string, ruta: string) {
  return {
    '@type': 'Service',
    '@id': `${SITIO}${ruta}#service`,
    name: nombre,
    description: descripcion,
    url: `${SITIO}${ruta}`,
    provider: { '@id': `${SITIO}/#business` },
    areaServed: [
      { '@type': 'City', name: 'Gualeguay' },
      { '@type': 'AdministrativeArea', name: 'Entre Ríos' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITIO}${ruta}`,
      servicePhone: TELEFONO,
    },
  };
}

/** La ficha de WB Code. Sin address porque no hay local al publico. */
export const NEGOCIO_CODE = {
  '@type': 'ProfessionalService',
  '@id': `${SITIO}/code/#business`,
  name: 'WB Code',
  alternateName: 'WB Code — Desarrollo Web',
  description:
    'Diseño y desarrollo de landing pages, sitios web y tiendas online. Unidad de desarrollo de WB Service, en Gualeguay, Entre Ríos.',
  url: `${SITIO}/code/`,
  telephone: TELEFONO,
  priceRange: '$$$',
  currenciesAccepted: 'ARS',
  address: DIRECCION,
  geo: GEO,
  areaServed: [
    { '@type': 'City', name: 'Gualeguay' },
    { '@type': 'AdministrativeArea', name: 'Entre Ríos' },
    { '@type': 'Country', name: 'Argentina' },
  ],
  parentOrganization: { '@id': `${SITIO}/#business` },
  knowsAbout: ['Desarrollo web', 'Diseño web', 'E-commerce', 'Landing pages', 'SEO'],
  sameAs: [`https://wa.me/${TELEFONO.replace('+', '')}`],
};

/** Envuelve uno o varios nodos en el grafo que espera schema.org. */
export function grafo(...nodos: unknown[]) {
  return { '@context': 'https://schema.org', '@graph': nodos.filter(Boolean) };
}
