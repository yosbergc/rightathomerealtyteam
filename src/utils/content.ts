import { getCollection, type CollectionEntry } from 'astro:content';
import { type Locale } from '../content.config';
import { siteConfig } from '../config/site';

export type Property = CollectionEntry<'properties'>;
export type Category = CollectionEntry<'categories'>;
export type Post = CollectionEntry<'blog'>;
export type Author = CollectionEntry<'authors'>;
export type LegalDoc = CollectionEntry<'legal'>;

export function contentSlug(entry: { id: string }): string {
  const segments = entry.id.replace(/\.(mdx|md|yaml|json)$/, '').split('/');
  return segments.length > 1 ? segments.slice(1).join('/') : entry.id.replace(/\.(mdx|md|yaml|json)$/, '');
}

export async function getProperties(locale: Locale = 'en'): Promise<Property[]> {
  const entries = await getCollection('properties', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return a.data.order - b.data.order;
  });
}

export async function getFeaturedProperties(locale: Locale = 'en', limit = 6): Promise<Property[]> {
  const entries = await getProperties(locale);
  return entries.filter((entry) => entry.data.featured).slice(0, limit);
}

export async function getPropertyBySlug(locale: Locale, slug: string): Promise<Property | undefined> {
  const entries = await getCollection(
    'properties',
    (entry) => entry.data.locale === locale && contentSlug(entry) === slug,
  );
  return entries[0];
}

export async function getPropertyByTranslationKey(
  locale: Locale,
  translationKey: string,
): Promise<Property | undefined> {
  const entries = await getCollection(
    'properties',
    ({ data }) => data.locale === locale && data.translationKey === translationKey,
  );
  return entries[0];
}

export async function getPropertiesByCategory(
  locale: Locale,
  categorySlug: string,
): Promise<Property[]> {
  const entries = await getCollection(
    'properties',
    ({ data }) => data.locale === locale && data.category === categorySlug,
  );
  return entries.sort((a, b) => a.data.categoryOrder - b.data.categoryOrder);
}

export async function getRelatedProperties(current: Property, limit = 3): Promise<Property[]> {
  const all = await getProperties(current.data.locale);
  const others = all.filter((entry) => entry.data.translationKey !== current.data.translationKey);
  const sameCategory = others.filter((entry) => entry.data.category === current.data.category);
  const rest = others.filter((entry) => entry.data.category !== current.data.category);
  const byPrice = (a: Property, b: Property) =>
    Math.abs(a.data.price - current.data.price) - Math.abs(b.data.price - current.data.price);
  sameCategory.sort(byPrice);
  rest.sort(byPrice);
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function getCategories(locale: Locale = 'en'): Promise<Category[]> {
  const entries = await getCollection('categories', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getCategoryBySlug(locale: Locale, slug: string): Promise<Category | undefined> {
  const entries = await getCollection(
    'categories',
    (entry) => entry.data.locale === locale && contentSlug(entry) === slug,
  );
  return entries[0];
}

export async function getCategoryByTranslationKey(
  locale: Locale,
  translationKey: string,
): Promise<Category | undefined> {
  const entries = await getCollection(
    'categories',
    ({ data }) => data.locale === locale && data.translationKey === translationKey,
  );
  return entries[0];
}

export async function getPosts(locale: Locale = 'en'): Promise<Post[]> {
  const entries = await getCollection('blog', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | undefined> {
  const entries = await getCollection(
    'blog',
    (entry) => entry.data.locale === locale && contentSlug(entry) === slug,
  );
  return entries[0];
}

export async function getPostByTranslationKey(
  locale: Locale,
  translationKey: string,
): Promise<Post | undefined> {
  const entries = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && data.translationKey === translationKey,
  );
  return entries[0];
}

export async function getAdjacentPosts(current: Post): Promise<{ previous?: Post; next?: Post }> {
  const all = await getPosts(current.data.locale);
  const sorted = [...all].sort((a, b) => a.data.chainOrder - b.data.chainOrder);
  const index = sorted.findIndex((entry) => entry.data.translationKey === current.data.translationKey);
  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

export async function getRelatedPosts(current: Post, limit = 3): Promise<Post[]> {
  const all = await getPosts(current.data.locale);
  const others = all.filter((entry) => entry.data.translationKey !== current.data.translationKey);
  const score = (entry: Post) => {
    let points = 0;
    if (entry.data.category === current.data.category) points += 3;
    points += entry.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
    return points;
  };
  return others
    .sort((a, b) => {
      const diff = score(b) - score(a);
      if (diff !== 0) return diff;
      return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    })
    .slice(0, limit);
}

export async function getAuthor(key: string): Promise<Author | undefined> {
  const entries = await getCollection('authors');
  return entries.find((entry) => entry.id === key);
}

export async function getLegalDoc(locale: Locale, slug: string): Promise<LegalDoc | undefined> {
  const entries = await getCollection(
    'legal',
    (entry) => entry.data.locale === locale && contentSlug(entry) === slug,
  );
  return entries[0];
}

export async function getLegalDocs(locale: Locale = 'en'): Promise<LegalDoc[]> {
  const entries = await getCollection('legal', ({ data }) => data.locale === locale);
  return entries.sort((a, b) => contentSlug(a).localeCompare(contentSlug(b)));
}

export function propertyUrl(property: Property, locale: Locale): string {
  const prefix = locale === 'es' ? '/es/propiedades' : '/properties';
  return `${prefix}/${contentSlug(property)}`;
}

export function categoryUrl(category: Category, locale: Locale): string {
  const prefix = locale === 'es' ? '/es/categoria' : '/category';
  return `${prefix}/${contentSlug(category)}`;
}

export function postUrl(post: Post, locale: Locale): string {
  const prefix = locale === 'es' ? '/es/blog' : '/blog';
  return `${prefix}/${contentSlug(post)}`;
}

export function legalUrl(doc: LegalDoc, locale: Locale): string {
  const prefix = locale === 'es' ? '/es/legal' : '/legal';
  return `${prefix}/${contentSlug(doc)}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.domain).href;
}