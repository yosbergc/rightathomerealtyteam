import { siteConfig } from '../config/site';
import { absoluteUrl } from './content';

export type BreadcrumbItem = { name: string; url: string };

export function buildWebPageJsonLd(name: string, url: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.domain,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'Organization'],
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.domain,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Greenwich Avenue',
      addressLocality: 'Greenwich',
      addressRegion: 'CT',
      postalCode: '06830',
      addressCountry: 'US',
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.domain,
    description: siteConfig.legalName,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type PropertyLike = {
  title: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  category: string;
  status: string;
  latitude?: number;
  longitude?: number;
};

export function buildPropertyJsonLd(
  property: PropertyLike,
  url: string,
  imageUrl: string,
  description: string,
  datePublished: string,
) {
  const graph: object[] = [
    {
      '@type': 'RealEstateListing',
      '@id': url,
      name: property.title,
      url,
      description,
      image: imageUrl,
      datePosted: datePublished,
      status: 'https://schema.org/ActiveListing',
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address,
        addressCountry: 'US',
      },
      numberOfBedrooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.sqft,
        unitCode: 'FTK',
        unitText: 'Square Feet',
      },
      ...(property.latitude && property.longitude
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: property.latitude,
              longitude: property.longitude,
            },
          }
        : {}),
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

type PostLike = {
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt?: Date;
  category: string;
};

export function buildArticleJsonLd(
  post: PostLike,
  url: string,
  imageUrl: string,
  authorName: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: imageUrl,
    url,
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function buildAlternates(enPath: string, esPath: string) {
  return {
    en: absoluteUrl(enPath),
    es: absoluteUrl(esPath),
    xDefault: absoluteUrl(enPath),
  };
}