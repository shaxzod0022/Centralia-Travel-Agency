import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { blogsClient, newsClient, eventsClient } from '@/lib/apolloClient';
import { GET_BLOGS } from '@/gql/getBlogs';
import { GET_NEWS } from '@/gql/getNews';
import { GET_EVENTS } from '@/gql/getEvents';
import { BlogsData } from '@/interfaces/blog.interface';
import { NewsData } from '@/interfaces/news.interface';
import { EventsData } from '@/interfaces/events.interface';

// Force dynamic rendering since we fetch data from external API
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://centraliatours.com';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/tours',
    '/services',
    '/blogs',
    '/news',
    '/events',
    '/b2b',
    '/contact',
    // '/login',
    // '/create-account',
    // '/forgot',
    // '/reset-password',
    // '/verify-email',
    '/cart',
    '/privacy-policy',
    '/terms-of-service',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const uniqueBlogCategories = new Set<number>();

  // Helper to add sitemap entry
  const addEntry = (url: string, priority: number, changeFreq: 'daily' | 'weekly' | 'monthly') => {
    sitemapEntries.push({
      url: `${baseUrl}/en${url}`, // Default to EN for the main URL logic if following pattern, but we iterate locales below
      lastModified: currentDate,
      changeFrequency: changeFreq,
      priority: priority,
      // alternates will be handled per item style
    });
  };

  // Generate static pages for all locales
  routing.locales.forEach((locale) => {
    staticPages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((loc) => [
                loc,
                `${baseUrl}/${loc}${page}`,
              ])
            ),
            'x-default': `${baseUrl}/en${page}`,
          },
        },
      });
    });
  });

  // Fetch Countries and Destinations for Tours (filtered views)
  for (const locale of routing.locales) {
    try {
      // Countries
      const countryRes = await fetch(`${process.env.NEXT_PUBLIC_URI}/api/public/countries?language=${locale}`);
      const countryData = await countryRes.json();
      if (countryData.success && countryData.data?.countries) {
        countryData.data.countries.forEach((c: any) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/tours?country=${c.id}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
              languages: {
                ...Object.fromEntries(
                  routing.locales.map((loc) => [
                    loc,
                    `${baseUrl}/${loc}/tours?country=${c.id}`,
                  ])
                ),
                'x-default': `${baseUrl}/en/tours?country=${c.id}`,
              },
            },
          });
        });
      }

      // Destinations
      const destRes = await fetch(`${process.env.NEXT_PUBLIC_URI}/api/public/destinations?language=${locale}`);
      const destData = await destRes.json();
      if (destData.success && destData.data?.destinations) {
        destData.data.destinations.forEach((d: any) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/tours?destination=${d.id}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
              languages: {
                ...Object.fromEntries(
                  routing.locales.map((loc) => [
                    loc,
                    `${baseUrl}/${loc}/tours?destination=${d.id}`,
                  ])
                ),
                'x-default': `${baseUrl}/en/tours?destination=${d.id}`,
              },
            },
          });
        });
      }
    } catch (e) {
      console.error(`Error fetching filters for ${locale}`, e);
    }
  }

  // Generate dynamic TOUR pages for ALL locales
  for (const locale of routing.locales) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URI}/api/public/tours?language=${locale}&limit=1000`,
        { next: { revalidate: 3600 } }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.tours) {
        data.data.tours.forEach((tour: any) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/tours/${tour.slug}`,
            lastModified: currentDate, // Tours REST API might not return lastModified, using current date
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: {
                ...Object.fromEntries(
                  routing.locales.map((loc) => [
                    loc,
                    `${baseUrl}/${loc}/tours/${tour.slug}`,
                  ])
                ),
                'x-default': `${baseUrl}/en/tours/${tour.slug}`,
              },
            },
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching tours for locale ${locale}:`, error);
    }
  }

  // Generate dynamic BLOG pages for ALL locales
  for (const locale of routing.locales) {
    try {
      const blogsResult = await blogsClient.query<BlogsData>({
        query: GET_BLOGS,
        variables: { language: locale, limit: 1000 }, // Get ALL blogs
      });

      if (blogsResult.data?.blogs) {
        blogsResult.data.blogs.forEach((blog) => {
          // Collect categories
          if (blog.categories) {
            blog.categories.forEach((cat) => uniqueBlogCategories.add(cat.id));
          }

          sitemapEntries.push({
            url: `${baseUrl}/${locale}/blogs/${blog.slug}`,
            lastModified: blog.publishedAt
              ? new Date(blog.publishedAt).toISOString()
              : currentDate,
            changeFrequency: 'monthly',
            priority: 0.6,
            alternates: {
              languages: {
                ...Object.fromEntries(
                  routing.locales.map((loc) => [
                    loc,
                    `${baseUrl}/${loc}/blogs/${blog.slug}`,
                  ])
                ),
                'x-default': `${baseUrl}/en/blogs/${blog.slug}`,
              },
            },
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching blogs for locale ${locale}:`, error);
    }
  }

  // Generate BLOG CATEGORY pages
  // We collected IDs from all locales (should be same IDs across locales).
  // We generate entries for each locale for each category ID.
  for (const locale of routing.locales) {
    uniqueBlogCategories.forEach((catId) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blogs/category/${catId}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((loc) => [
                loc,
                `${baseUrl}/${loc}/blogs/category/${catId}`,
              ])
            ),
            'x-default': `${baseUrl}/en/blogs/category/${catId}`,
          },
        },
      });
    });
  }

  // Generate dynamic NEWS pages for ALL locales
  for (const locale of routing.locales) {
    try {
      const newsResult = await newsClient.query<NewsData>({
        query: GET_NEWS,
        variables: { language: locale }, // Get ALL news is implied by limit in query or default
      });

      if (newsResult.data?.news) {
        newsResult.data.news.forEach((newsItem) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/news/${newsItem.slug}`,
            lastModified: newsItem.publishedAt
              ? new Date(newsItem.publishedAt).toISOString()
              : currentDate,
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: {
                ...Object.fromEntries(
                  routing.locales.map((loc) => [
                    loc,
                    `${baseUrl}/${loc}/news/${newsItem.slug}`,
                  ])
                ),
                'x-default': `${baseUrl}/en/news/${newsItem.slug}`,
              },
            },
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching news for locale ${locale}:`, error);
    }
  }

  // Generate dynamic EVENTS pages for ALL locales
  for (const locale of routing.locales) {
    try {
      const eventsResult = await eventsClient.query<EventsData>({
        query: GET_EVENTS,
        variables: { language: locale },
      });

      if (eventsResult.data?.events) {
        eventsResult.data.events.forEach((event) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/events/${event.slug}`,
            lastModified: event.publishedAt
              ? new Date(event.publishedAt).toISOString()
              : currentDate,
            changeFrequency: 'weekly',
            priority: 0.6,
            alternates: {
              languages: {
                ...Object.fromEntries(
                  routing.locales.map((loc) => [
                    loc,
                    `${baseUrl}/${loc}/events/${event.slug}`,
                  ])
                ),
                'x-default': `${baseUrl}/en/events/${event.slug}`,
              },
            },
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching events for locale ${locale}:`, error);
    }
  }

  // If URLs exceed 50,000, create sitemap index
  if (sitemapEntries.length > 50000) {
    // Split into chunks and return sitemap index
    // For now, return all (typical travel site won't exceed this)
  }

  return sitemapEntries;
}
