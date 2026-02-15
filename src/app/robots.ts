import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/data/'],
      },
      {
        userAgent: '*',
        allow: '/_next/static/',
      },
    ],
    sitemap: 'https://centraliatours.com/sitemap.xml',
  };
}
