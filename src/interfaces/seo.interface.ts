// interfaces/seo.interface.ts
export interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string | string[];
  slug: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  focusKeyphrase: string;
  featuredSnippet: string;
  structuredData: any;
}

export interface SEOData {
  blogSEO: SEO;
}

export interface TourSEOData {
  tourSEO: SEO;
}

export interface NewsSEOData {
  newsSEO: SEO;
}

export interface EventsSEOData {
  eventSEO: SEO;
}