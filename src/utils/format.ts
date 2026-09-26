import type { Locale } from '../content.config';

const priceFormatter = new Intl.NumberFormat('en-US');

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatSqft(value: number, locale: Locale): string {
  const formatted = priceFormatter.format(value);
  return locale === 'es' ? `${formatted} pies²` : `${formatted} sqft`;
}