// app/[locale]/news/[id]/page.tsx
import JsonLdScript from "@/components/JsonLdScript";
import type { Metadata } from "next";
import { buildAlternates, sanitizeUrl } from "@/lib/seo/buildAlternates";
import axios from "axios";
import { NewsSEOData, SEO } from "@/interfaces/seo.interface";
import { newsClient } from "@/lib/apolloClient";
import { GET_NEWS_SEO } from "@/gql/getNewsSeo";
import { GET_NEWSBYSLUG } from "@/gql/getNewsBySlug";
import { GET_NEWS } from "@/gql/getNews";
import { setRequestLocale } from "next-intl/server";
import { NewsBySlugData, NewsProps } from "@/interfaces/news.interface";
import { NewsOne, NoNews } from "@/components";

// ISR: 1 hour cache
export const revalidate = 3600;
export const dynamicParams = true;

// Pre-render recent 100 news per locale
export async function generateStaticParams() {
  const locales = ["en", "ru", "es", "ja", "de"];
  const paths: { locale: string; id: string }[] = [];

  await Promise.all(
    locales.map(async (locale) => {
      try {
        const { data } = await newsClient.query<any>({
          query: GET_NEWS,
          variables: { language: locale, limit: 100 },
        });

        if (data?.news) {
          data.news.forEach((item: any) => {
            if (item.slug) {
              paths.push({ locale, id: item.slug });
            }
          });
        }
      } catch (error) {
        console.error(
          `Error generating static params for news (${locale}):`,
          error,
        );
      }
    }),
  );

  return paths;
}

interface NewsOnePageProps {
  params: Promise<{
    locale: string;
    id: string; // This is slug
  }>;
}

export async function generateMetadata({
  params,
}: NewsOnePageProps): Promise<Metadata> {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);
  let seo: SEO = {} as SEO;

  // News SEO
  try {
    const seoResult = await newsClient.query<NewsSEOData>({
      query: GET_NEWS_SEO,
      variables: { slug: slug, language: locale },
    });

    if (seoResult.data?.newsSEO) {
      seo = seoResult.data.newsSEO;
    }
  } catch (error) {
    console.error("❌ News seo error:", error);
  }

  // URL tuzish
  const baseUrl = "https://www.centraliatours.com";
  let canonicalUrl = seo?.canonicalUrl
    ? sanitizeUrl(seo.canonicalUrl).replace(/http:\/\/localhost:\d+/g, baseUrl)
    : `${baseUrl}/${locale}/news/${slug}`;

  // Agar canonicalUrl locale'siz bo'lsa, locale qo'shish
  if (canonicalUrl && !canonicalUrl.includes(`/${locale}/`)) {
    // URL'dan baseUrl ni olib tashlash
    const urlPath = canonicalUrl.replace(baseUrl, "");

    // Agar path `/news/` bilan boshlansa, locale qo'shish
    if (urlPath.startsWith("/news/") || urlPath.startsWith("/tours/")) {
      canonicalUrl = `${baseUrl}/${locale}${urlPath}`;
    } else if (!urlPath.startsWith(`/${locale}/`)) {
      // Boshqa hollarda ham locale qo'shish
      canonicalUrl = `${baseUrl}/${locale}${urlPath}`;
    }
  }

  // Default qiymatlar
  const defaultTitle = "Centralia Travel Agency | Travel News";

  const defaultDescription =
    "Stay updated with the latest travel news, destination updates, and tour announcements from Centralia Travel Agency.";

  const defaultImage = `${baseUrl}/og/default.jpg`;

  // Ko'p tillik SEO
  const alternates = buildAlternates(locale, `/news/${slug}`);

  // Meta keywords formatini tekshirish
  let keywords: string[] = [];
  if (seo?.metaKeywords) {
    if (Array.isArray(seo.metaKeywords)) {
      keywords = seo.metaKeywords;
    } else if (typeof seo.metaKeywords === "string") {
      keywords = seo.metaKeywords.split(",").map((k) => k.trim());
    }
  } else {
    keywords = ["news", "travel", "blog", "adventure", "tourism"];
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

export default async function NewsOnePage({ params }: NewsOnePageProps) {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);

  // Track view news
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_URI}/api/news/${slug}/track-view`,
    );
  } catch (error) {
    console.error(error);
  }

  const [seoResult, newsResult] = await Promise.allSettled([
    newsClient.query<NewsSEOData>({
      query: GET_NEWS_SEO,
      variables: { slug: slug, language: locale },
    }),
    newsClient.query<NewsBySlugData>({
      query: GET_NEWSBYSLUG,
      variables: { slug: slug, language: locale },
    }),
  ]);

  const seo =
    seoResult.status === "fulfilled" && seoResult.value.data?.newsSEO
      ? seoResult.value.data.newsSEO
      : ({} as SEO);

  const newsOne =
    newsResult.status === "fulfilled" && newsResult.value.data?.newsGeneral
      ? newsResult.value.data.newsGeneral
      : ({} as NewsProps);

  let news: NewsProps = {} as NewsProps;

  if (newsResult.status === "fulfilled" && newsResult.value.data?.newsGeneral) {
    const newsData = newsResult.value.data.newsGeneral;
    const {
      title,
      content,
      slug: newsSlug,
      featuredImage,
      publishedAt,
      readTime,
      viewsCount, // <-- keldi
    } = newsData;

    news = {
      title: title || "",
      content: content || "",
      slug: newsSlug || slug,
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

      // NewsPosting uchun qo'shimcha maydonlar
      if (structuredData["@type"] === "NewsPosting") {
        // Sana formatlarini tekshirish
        if (news.publishedAt) {
          structuredData.datePublished = new Date(
            news.publishedAt,
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
        if (news.content && !structuredData.articleBody) {
          // HTML teglarini olib tashlash
          const plainText = news.content
            .replace(/<[^>]*>/g, "")
            .substring(0, 500);
          structuredData.articleBody = plainText;
        }
      }
    } catch (error) {
      console.error("❌ Error processing news structuredData:", error);
    }
  }

  // Agar news topilmasa yoki asosiy maydonlar bo'sh bo'lsa
  // ID kerak emas, faqat title va content bo'lsa ham yetarli
  if (!news || !news.title || !news.content) {
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
        <NewsOne data={newsOne} />
      </main>
    </>
  );
}
