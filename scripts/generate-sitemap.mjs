import { writeFile } from 'node:fs/promises';

const siteUrl = 'https://novamart-shop.vercel.app';
const productsUrl = 'https://angular-ecommerce-api.edu-mahmoud-ahmed.workers.dev/products';

function toUrlEntry(path, priority) {
  return `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

try {
  const response = await fetch(productsUrl, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Catalog request failed with ${response.status}`);
  }

  const products = await response.json();
  if (!Array.isArray(products) || products.some((product) => !product.id)) {
    throw new Error('Catalog response does not contain valid product IDs');
  }
  const entries = [
    toUrlEntry('/', '1.0'),
    ...products.map((product) =>
      toUrlEntry(`/products/${encodeURIComponent(product.id)}`, '0.8')
    ),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap);
} catch (error) {
  console.warn('Unable to refresh sitemap; using the checked-in sitemap:', error);
}
