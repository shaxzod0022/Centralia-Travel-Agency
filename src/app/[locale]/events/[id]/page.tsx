// app/[locale]/events/[id]/page.tsx
import JsonLdScript from "@/components/JsonLdScript";
import type { Metadata } from "next";
import { buildAlternates, sanitizeUrl } from "@/lib/seo/buildAlternates";
import axios from "axios";
import { EventsSEOData, SEO } from "@/interfaces/seo.interface";
import { eventsClient } from "@/lib/apolloClient";
import { GET_EVENTS_SEO } from "@/gql/getEventsSeo";
import { GET_EVENTSBYSLUG } from "@/gql/getEventsBySlug";
import { GET_EVENTS } from "@/gql/getEvents";
import { setRequestLocale } from "next-intl/server";
import { EventsBySlugData, EventsProps } from "@/interfaces/events.interface";
import { EventsOne, NoEvents } from "@/components";

// ISR: 1 hour cache
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-render recent 100 events per locale
export async function generateStaticParams() {
  const locales = ["en", "ru", "es", "ja", "de"];
  const paths: { locale: string; id: string }[] = [];

  await Promise.all(
    locales.map(async (locale) => {
      try {
        const { data } = await eventsClient.query<any>({
          query: GET_EVENTS,
          variables: { language: locale, limit: 100 },
        });

        if (data?.events) {
          data.events.forEach((item: any) => {
            if (item.slug) {
              paths.push({ locale, id: item.slug });
            }
          });
        }
      } catch (error) {
        console.error(
          `Error generating static params for events (${locale}):`,
          error,
        );
      }
    }),
  );

  return paths;
}

interface EventsOnePageProps {
  params: Promise<{
    locale: string;
    id: string; // This is slug
  }>;
}

export async function generateMetadata({
  params,
}: EventsOnePageProps): Promise<Metadata> {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);
  let seo: SEO = {} as SEO;

  // Events SEO
  try {
    const seoResult = await eventsClient.query<EventsSEOData>({
      query: GET_EVENTS_SEO,
      variables: { slug: slug, language: locale },
    });

    if (seoResult.data?.eventSEO) {
      seo = seoResult.data.eventSEO;
    }
  } catch (error) {
    console.error("❌ Events seo error:", error);
  }

  // URL tuzish
  const baseUrl = "https://www.centraliatours.com";
  let canonicalUrl = seo?.canonicalUrl
    ? sanitizeUrl(seo.canonicalUrl).replace(/http:\/\/localhost:\d+/g, baseUrl)
    : `${baseUrl}/${locale}/events/${slug}`;

  // Agar canonicalUrl locale'siz bo'lsa, locale qo'shish
  if (canonicalUrl && !canonicalUrl.includes(`/${locale}/`)) {
    // URL'dan baseUrl ni olib tashlash
    const urlPath = canonicalUrl.replace(baseUrl, "");

    // Agar path `/events/` bilan boshlansa, locale qo'shish
    if (urlPath.startsWith("/events/") || urlPath.startsWith("/tours/")) {
      canonicalUrl = `${baseUrl}/${locale}${urlPath}`;
    } else if (!urlPath.startsWith(`/${locale}/`)) {
      // Boshqa hollarda ham locale qo'shish
      canonicalUrl = `${baseUrl}/${locale}${urlPath}`;
    }
  }

  // Default qiymatlar
  const defaultTitle = "Centralia Travel Agency | Travel Events";

  const defaultDescription =
    "Stay updated with the latest travel events, destination updates, and tour announcements from Centralia Travel Agency.";

  const defaultImage = `${baseUrl}/og/default.jpg`;

  // Ko'p tillik SEO
  const alternates = buildAlternates(locale, `/events/${slug}`);

  // Meta keywords formatini tekshirish
  let keywords: string[] = [];
  if (seo?.metaKeywords) {
    if (Array.isArray(seo.metaKeywords)) {
      keywords = seo.metaKeywords;
    } else if (typeof seo.metaKeywords === "string") {
      keywords = seo.metaKeywords.split(",").map((k) => k.trim());
    }
  } else {
    keywords = ["events", "travel", "blog", "adventure", "tourism"];
  }

  return {
    title: seo?.metaTitle || defaultTitle,
    description: seo?.metaDescription || defaultDescription,
    keywords: keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || defaultTitle,
      description:
        seo?.ogDescription || seo?.metaDescription || defaultDescription,
      url: canonicalUrl,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: seo?.ogImage || defaultImage,
          width: 1200,
          height: 630,
          alt: seo?.metaTitle || defaultTitle,
        },
      ],
      locale:
        locale === "en"
          ? "en_US"
          : locale === "ru"
            ? "ru_RU"
            : locale === "es"
              ? "es_ES"
              : locale === "ja"
                ? "ja_JP"
                : locale === "de"
                  ? "de_DE"
                  : "en_US",
      type: "article",
      authors: ["Centralia Travel Team"],
      publishedTime: seo?.structuredData?.datePublished,
      modifiedTime: seo?.structuredData?.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || seo?.metaTitle || defaultTitle,
      description:
        seo?.twitterDescription || seo?.metaDescription || defaultDescription,
      images: [seo?.twitterImage || seo?.ogImage || defaultImage],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },

    alternates: alternates,
    other: {
      ...(seo?.focusKeyphrase && {
        "focus-keyphrase": seo.focusKeyphrase,
      }),
      ...(seo?.featuredSnippet && {
        "featured-snippet": seo.featuredSnippet,
      }),
    },
  };
}

export default async function EventsOnePage({ params }: EventsOnePageProps) {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);

  // Track view events
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_URI}/api/event/${slug}/track-view`,
    );
  } catch (error) {
    console.error(error);
  }

  const [seoResult, eventsResult] = await Promise.allSettled([
    eventsClient.query<EventsSEOData>({
      query: GET_EVENTS_SEO,
      variables: { slug: slug, language: locale },
    }),
    eventsClient.query<EventsBySlugData>({
      query: GET_EVENTSBYSLUG,
      variables: { slug: slug, language: locale },
    }),
  ]);

  const seo =
    seoResult.status === "fulfilled" && seoResult.value.data?.eventSEO
      ? seoResult.value.data.eventSEO
      : ({} as SEO);

  const eventsOne =
    eventsResult.status === "fulfilled" && eventsResult.value.data?.eventGeneral
      ? eventsResult.value.data.eventGeneral
      : ({} as EventsProps);

  let events: EventsProps = {} as EventsProps;

  if (
    eventsResult.status === "fulfilled" &&
    eventsResult.value.data?.eventGeneral
  ) {
    const eventsData = eventsResult.value.data.eventGeneral;
    const {
      title,
      content,
      slug: eventSlug,
      featuredImage,
      publishedAt,
      readTime,
      viewsCount, // <-- keldi
    } = eventsData;

    events = {
      title: title || "",
      content: content || "",
      slug: eventSlug || slug,
      featuredImage: featuredImage || "",
      publishedAt: publishedAt || new Date().toISOString(),
      readTime: readTime || 5,
      viewsCount: viewsCount || 0, // <-- majburiy
    };
  }

  // StructuredData ni tayyorlash
  let structuredData = null;
  if (seo?.structuredData) {
    try {
      // Agar string bo'lsa parse qilish
      const rawData =
        typeof seo.structuredData === "string"
          ? JSON.parse(seo.structuredData)
          : seo.structuredData;

      // Localhost manzillarini production manziliga almashtirish (agar kerak bo'lsa)
      const dataString = JSON.stringify(rawData);
      const updatedString = dataString.replace(
        /http:\/\/localhost:\d+/g,
        "https://centraliatours.com",
      );

      structuredData = JSON.parse(updatedString);

      // EventPosting uchun qo'shimcha maydonlar
      if (structuredData["@type"] === "EventPosting") {
        // Sana formatlarini tekshirish
        if (events.publishedAt) {
          structuredData.datePublished = new Date(
            events.publishedAt,
          ).toISOString();
        }

        // Publisher ma'lumotlarini qo'shish
        if (!structuredData.publisher) {
          structuredData.publisher = {
            "@type": "Organization",
            name: "Centralia Travel Agency",
            url: "https://centraliatours.com",
            logo: {
              "@type": "ImageObject",
              url: "https://centraliatours.com/logo.png",
            },
          };
        }

        // Article body qo'shish
        if (events.content && !structuredData.articleBody) {
          // HTML teglarini olib tashlash
          const plainText = events.content
            .replace(/<[^>]*>/g, "")
            .substring(0, 500);
          structuredData.articleBody = plainText;
        }
      }
    } catch (error) {
      console.error("❌ Error processing events structuredData:", error);
    }
  }

  // Agar events  topilmasa yoki asosiy maydonlar bo'sh bo'lsa
  // ID kerak emas, faqat title va content bo'lsa ham yetarli
  if (!events || !events.title || !events.content) {
    return new Response("Data not found or permanently removed", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return (
    <>
      {/* JSON-LD Script */}
      {structuredData && <JsonLdScript structuredData={structuredData} />}

      <main>
        <EventsOne data={eventsOne} />
      </main>
    </>
  );
}
