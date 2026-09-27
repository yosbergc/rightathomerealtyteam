import { getCategories, getProperties, getPosts, getLegalDocs, contentSlug } from '../utils/content';
import { siteConfig } from '../config/site';

const SITE = siteConfig.domain;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function urlEntry(
  enPath: string,
  esPath: string,
  priority: number,
  changefreq: string,
): string {
  const en = `${SITE}${enPath}`;
  const es = `${SITE}${esPath}`;
  const alternates = [
    `<xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(en)}"/>`,
    `<xhtml:link rel="alternate" hreflang="es" href="${xmlEscape(es)}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(en)}"/>`,
  ].join('');
  return [
    '  <url>',
    `    <loc>${xmlEscape(en)}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    alternates,
    '  </url>',
  ].join('\n');
}

export async function GET() {
  const [categoriesEn, categoriesEs, propertiesEn, propertiesEs, postsEn, postsEs, legalEn, legalEs] =
    await Promise.all([
      getCategories('en'),
      getCategories('es'),
      getProperties('en'),
      getProperties('es'),
      getPosts('en'),
      getPosts('es'),
      getLegalDocs('en'),
      getLegalDocs('es'),
    ]);

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

const staticRoutes = [
    { en: '/', es: '/es', priority: 1.0, changefreq: 'weekly' },
    { en: '/properties', es: '/es/propiedades', priority: 0.9, changefreq: 'weekly' },
    { en: '/blog', es: '/es/blog', priority: 0.9, changefreq: 'weekly' },
    { en: '/about', es: '/es/nosotros', priority: 0.7, changefreq: 'monthly' },
    { en: '/contact', es: '/es/contacto', priority: 0.7, changefreq: 'monthly' },
    { en: '/join', es: '/es/join', priority: 0.6, changefreq: 'monthly' },
  ];

  for (const route of staticRoutes) {
    lines.push(urlEntry(route.en, route.es, route.priority, route.changefreq));
  }

  const categoryMapEn = new Map(categoriesEn.map((category) => [category.data.translationKey, category]));
  for (const categoryEs of categoriesEs) {
    const categoryEn = categoryMapEn.get(categoryEs.data.translationKey);
    if (categoryEn) {
      lines.push(
        urlEntry(`/category/${contentSlug(categoryEn)}`, `/es/categoria/${contentSlug(categoryEs)}`, 0.8, 'weekly'),
      );
    }
  }

  const propertyMapEn = new Map(propertiesEn.map((property) => [property.data.translationKey, property]));
  for (const propertyEs of propertiesEs) {
    const propertyEn = propertyMapEn.get(propertyEs.data.translationKey);
    if (propertyEn) {
      lines.push(
        urlEntry(
          `/properties/${contentSlug(propertyEn)}`,
          `/es/propiedades/${contentSlug(propertyEs)}`,
          0.8,
          'weekly',
        ),
      );
    }
  }

  const postMapEn = new Map(postsEn.map((post) => [post.data.translationKey, post]));
  for (const postEs of postsEs) {
    const postEn = postMapEn.get(postEs.data.translationKey);
    if (postEn) {
      lines.push(
        urlEntry(`/blog/${contentSlug(postEn)}`, `/es/blog/${contentSlug(postEs)}`, 0.7, 'monthly'),
      );
    }
  }

  const legalMapEn = new Map(legalEn.map((doc) => [doc.data.translationKey, doc]));
  for (const docEs of legalEs) {
    const docEn = legalMapEn.get(docEs.data.translationKey);
    if (docEn) {
      lines.push(
        urlEntry(`/legal/${contentSlug(docEn)}`, `/es/legal/${contentSlug(docEs)}`, 0.3, 'yearly'),
      );
    }
  }

  lines.push('</urlset>');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
