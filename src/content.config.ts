import { defineCollection, z } from 'astro:content';

const locales = ['en', 'es'] as const;
export const localeSchema = z.enum(locales);
export type Locale = (typeof locales)[number];

const property = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      locale: localeSchema,
      translationKey: z.string(),
      category: z.string(),
      status: z.string(),
      price: z.number(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      beds: z.number(),
      baths: z.number(),
      sqft: z.number(),
      featured: z.boolean().default(false),
      order: z.number(),
      categoryOrder: z.number(),
      coverImage: image(),
      gallery: z.array(image()).default([]),
      highlights: z.array(z.string()).default([]),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      propertyType: z.string().default('Single Family Residence'),
      yearBuilt: z.string().default('Built in 2020'),
      lotSize: z.string().default('3,049.2 Sqft Lot'),
      daysOnMarket: z.string().default('38 days ago'),
      pricePerSqft: z.string().default('$376/sqft'),
      hoa: z.string().default('$185/mo'),
      detailsCategory: z.string().default('Residential'),
      detailsPropertyType: z.string().default('Single Family'),
      tags: z.array(z.string()).default([
        'Fenced backyard',
        'Updated lighting',
        'New',
        'New roof',
        'Central ac',
        'Newer gas fireplace insert',
        'Vaulted ceilings',
        'Open airy feel',
      ]),
      facilities: z.array(z.string()).default([
        'Parking',
        'Swimming Pool',
        'Playground',
        'Tennis Court',
        'Gymnasium',
        'Barbeque area',
      ]),
      amenities: z.array(z.string()).default([
        'Internet',
        'Smart Home Integration',
        'Kid friendly',
        'Pet friendly',
        'Security Systems',
        'Mini market',
      ]),
    }),
});

const category = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      locale: localeSchema,
      translationKey: z.string(),
      title: z.string(),
      description: z.string(),
      heroImage: image(),
      order: z.number(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      locale: localeSchema,
      translationKey: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string(),
      coverImage: image(),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      readingTime: z.number(),
      order: z.number(),
      chainOrder: z.number(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

const author = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      avatar: image(),
    }),
});

const legal = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      locale: localeSchema,
      translationKey: z.string(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

export const collections = {
  properties: property,
  categories: category,
  blog: blog,
  authors: author,
  legal: legal,
};