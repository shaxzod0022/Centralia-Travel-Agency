import { BlogHead, Blogs, NoBlogs } from "@/components";
import { GET_BLOGS } from "@/gql/getBlogs";
import { Blog, BlogsData } from "@/interfaces/blog.interface";
import { blogsClient } from "@/lib/apolloClient";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo/buildAlternates";

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
    "Central Asia Travel Blog | Travel Tips & Destination Guides";
  const defaultDescription =
    "Read expert travel guides, tips and stories about Central Asia. Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan & Turkmenistan travel insights.";
  const defaultKeywords =
    "central asia travel blog, travel tips, destination guides, uzbekistan travel, kazakhstan travel, kyrgyzstan travel, silk road stories";

  // Translation fayllaridan olish
  const title = t("seoBlogs.title") || defaultTitle;
  const description = t("seoBlogs.description") || defaultDescription;
  const keywords = t.raw("seoBlogs.keywords") || defaultKeywords;
  const ogTitle = t("seoBlogs.ogTitle") || title;
  const ogDescription = t("seoBlogs.ogDescription") || description;

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
  const alternates = buildAlternates(locale, "/blogs");

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
      url: `${baseUrl}/${locale}/blogs`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/blog.jpg`,
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
      images: [`${baseUrl}/og/blog.jpg`],
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
  let blogs: Blog[] = [];

  // Blogs so'rovi
  try {
    const blogsResult = await blogsClient.query<BlogsData>({
      query: GET_BLOGS,
      variables: { language: locale },
    });

    if (blogsResult.data?.blogs) {
      blogs = blogsResult.data.blogs;
    }
  } catch (error) {
    console.error("Blogs query error:", error);
  }

  if (!blogs || blogs.length === 0) return <NoBlogs />;

  return (
    <main>
      <BlogHead />
      <Blogs data={blogs} />
    </main>
  );
}
