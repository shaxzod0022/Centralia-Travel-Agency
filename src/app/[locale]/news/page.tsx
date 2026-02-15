// app/[locale]/news/page.tsx
import { newsClient } from "@/lib/apolloClient";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo/buildAlternates";
import { News, NewsHead, NoNews } from "@/components";
import { NewsData, NewsProps } from "@/interfaces/news.interface";
import { GET_NEWS } from "@/gql/getNews";

interface Params {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;

  // getTranslations ni ishlatamiz
  const t = await getTranslations({ locale });

  // Blog SEO uchun default qiymatlar
  const defaultTitle =
    "Central Asia Travel News | Latest Updates & Tourism Insights";

  const defaultDescription =
    "Stay informed with the latest travel news, destination updates, and tourism insights from Central Asia. Coverage of Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan & Turkmenistan.";

  const defaultKeywords =
    "central asia travel news, tourism updates, travel alerts, uzbekistan travel news, kazakhstan travel news, silk road tourism";

  // Translation fayllaridan olish
  const title = t("seoNews.title") || defaultTitle;
  const description = t("seoNews.description") || defaultDescription;
  const keywords = t.raw("seoNews.keywords") || defaultKeywords;
  const ogTitle = t("seoNews.ogTitle") || title;
  const ogDescription = t("seoNews.ogDescription") || description;

  // Agar keywords array bo'lsa, stringga o'tkazish
  let keywordsArray: string[] = [];
  if (Array.isArray(keywords)) {
    keywordsArray = keywords;
  } else if (typeof keywords === "string") {
    keywordsArray = keywords.split(",").map((k) => k.trim());
  } else {
    keywordsArray = defaultKeywords.split(",").map((k) => k.trim());
  }

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/news");

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
      url: `${baseUrl}/${locale}/news`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/news.jpg`,
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
      images: [`${baseUrl}/og/news.jpg`],
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
  let news: NewsProps[] = [];

  // Blogs so'rovi
  try {
    const newsResult = await newsClient.query<NewsData>({
      query: GET_NEWS,
      variables: { language: locale },
    });

    if (newsResult.data?.news) {
      news = newsResult.data.news;
    }
  } catch (error) {
    console.error("News query error:", error);
  }

  if (!news || news.length === 0) {
    return <NoNews />;
  }

  return (
    <main>
      <NewsHead />
      <News data={news} />
    </main>
  );
}
