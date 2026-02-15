// app/[locale]/events/page.tsx
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo/buildAlternates";
import { Events, EventsHead, NotFound, NoEvents } from "@/components";
import { EventsData, EventsProps } from "@/interfaces/events.interface";
import { eventsClient } from "@/lib/apolloClient";
import { GET_EVENTS } from "@/gql/getEvents";

interface Params {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale });

  const defaultTitle =
    "Central Asia Events | Festivals, Cultural & Travel Events";

  const defaultDescription =
    "Discover upcoming festivals, cultural celebrations, and travel-related events across Central Asia. Explore events in Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan & Turkmenistan.";

  const defaultKeywords =
    "central asia events, cultural festivals, travel events, uzbekistan events, kazakhstan festivals, silk road events";

  const title = t("seoEvents.title") || defaultTitle;
  const description = t("seoEvents.description") || defaultDescription;
  const keywords = t.raw("seoEvents.keywords") || defaultKeywords;
  const ogTitle = t("seoEvents.ogTitle") || title;
  const ogDescription = t("seoEvents.ogDescription") || description;

  let keywordsArray: string[] = [];
  if (Array.isArray(keywords)) {
    keywordsArray = keywords;
  } else if (typeof keywords === "string") {
    keywordsArray = keywords.split(",").map((k) => k.trim());
  } else {
    keywordsArray = defaultKeywords.split(",").map((k) => k.trim());
  }

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/events");

  return {
    title: title,
    description: description,
    keywords: keywordsArray,
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
      title: ogTitle,
      description: ogDescription,
      url: `${baseUrl}/${locale}/events`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/events.jpg`,
          width: 1200,
          height: 630,
          alt: title,
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
                  : locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [`${baseUrl}/og/events.jpg`],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },
    alternates,
  };
}

// ISR: 30 daqiqa kesh (CDN optimization)
export const revalidate = 1800;
// Faqat generateStaticParams dan keladigan locale'larni render qilish
export const dynamicParams = false;

// Pre-render barcha locale'lar uchun (ISR ishlashi uchun kerak)
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' },
    { locale: 'es' },
    { locale: 'ja' },
    { locale: 'de' },
  ];
}

export default async function BlogPage({ params }: Params) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  let events: EventsProps[] = [];

  // Blogs so'rovi
  try {
    const eventsResult = await eventsClient.query<EventsData>({
      query: GET_EVENTS,
      variables: { language: locale },
    });

    if (eventsResult.data?.events) {
      events = eventsResult.data.events;
    }
  } catch (error) {
    console.error("News query error:", error);
  }

  if (!events || events.length === 0) {
    return <NoEvents />;
  }

  return (
    <main>
      <EventsHead />
      <Events data={events} />
    </main>
  );
}
