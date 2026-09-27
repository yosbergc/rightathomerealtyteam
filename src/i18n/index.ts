import type { Translation } from './types';
import { en } from './en';
import { es } from './es';
import type { Locale } from '../content.config';

export const dictionaries: Record<Locale, Translation> = { en, es };

export function getDictionary(locale: Locale): Translation {
  return dictionaries[locale];
}

const enToEsStatic: Record<string, string> = {
  '/': '/es',
  '/properties': '/es/propiedades',
  '/blog': '/es/blog',
  '/about': '/es/nosotros',
  '/contact': '/es/contacto',
  '/appointments': '/es/citas',
  '/404': '/es/404',
};

function esToEnStatic(enPath: string): string | undefined {
  for (const [en, es] of Object.entries(enToEsStatic)) {
    if (enPath === es) return en;
  }
  return undefined;
}

function toEsPath(enPath: string): string {
  if (enToEsStatic[enPath]) return enToEsStatic[enPath];
  if (enPath.startsWith('/legal/terms-conditions'))
    return `/es/legal/terminos-y-condiciones${enPath.slice('/legal/terms-conditions'.length)}`;
  if (enPath.startsWith('/legal/privacy-policy'))
    return `/es/legal/politica-de-privacidad${enPath.slice('/legal/privacy-policy'.length)}`;
  if (enPath.startsWith('/properties/')) return `/es/propiedades/${enPath.slice('/properties/'.length)}`;
  if (enPath.startsWith('/category/')) return `/es/categoria/${enPath.slice('/category/'.length)}`;
  if (enPath.startsWith('/blog/')) return `/es/blog/${enPath.slice('/blog/'.length)}`;
  if (enPath.startsWith('/legal/')) return `/es/legal/${enPath.slice('/legal/'.length)}`;
  if (enPath.startsWith('/')) return `/es${enPath}`;
  return enPath;
}

function toEnPath(esPath: string): string {
  const exact = esToEnStatic(esPath);
  if (exact) return exact;
  if (esPath.startsWith('/es/legal/terminos-y-condiciones'))
    return `/legal/terms-conditions${esPath.slice('/es/legal/terminos-y-condiciones'.length)}`;
  if (esPath.startsWith('/es/legal/politica-de-privacidad'))
    return `/legal/privacy-policy${esPath.slice('/es/legal/politica-de-privacidad'.length)}`;
  if (esPath.startsWith('/es/propiedades/')) return `/properties/${esPath.slice('/es/propiedades/'.length)}`;
  if (esPath.startsWith('/es/categoria/')) return `/category/${esPath.slice('/es/categoria/'.length)}`;
  if (esPath.startsWith('/es/blog/')) return `/blog/${esPath.slice('/es/blog/'.length)}`;
  if (esPath.startsWith('/es/legal/')) return `/legal/${esPath.slice('/es/legal/'.length)}`;
  if (esPath.startsWith('/es')) return esPath.slice(3) || '/';
  return esPath;
}

export function localizedPath(input: string, locale: Locale): string {
  const hashIndex = input.indexOf('#');
  const path = hashIndex === -1 ? input : input.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : input.slice(hashIndex);
  const enPath = path.startsWith('/es') ? toEnPath(path) : path;
  const result = locale === 'en' ? enPath : toEsPath(enPath);
  return result + hash;
}