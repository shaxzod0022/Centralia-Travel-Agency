// app/[locale]/blogs/[id]/page.tsx
import JsonLdScript from "@/components/JsonLdScript";
import { BlogOne, NoBlogs } from "@/components";
import { GET_BLOGBYSLUG } from "@/gql/getBlogBySlug";
import { GET_BLOGS } from "@/gql/getBlogs";
import { setRequestLocale } from "next-intl/server";
import { GET_BLOG_SEO } from "@/gql/getBlogSeo";
import { Blog, BlogBySlugData } from "@/interfaces/blog.interface";
import { SEO, SEOData } from "@/interfaces/seo.interface";
import { blogsClient } from "@/lib/apolloClient";
import type { Metadata } from "next";
import { buildAlternates, sanitizeUrl } from "@/lib/seo/buildAlternates";

// ISR: 1 hour cache
export const revalidate = 3600;
export const dynamicParams = true; // Fallback for older/unfetched blogs

// Pre-render recent 100 blogs per locale
export async function generateStaticParams() {
  const locales = ["en", "ru", "es", "ja", "de"];
  const paths: { locale: string; id: string }[] = [];

  await Promise.all(
    locales.map(async (locale) => {
      try {
        const { data } = await blogsClient.query<any>({
          query: GET_BLOGS,
          variables: { language: locale, limit: 100 },
        });

        if (data?.blogs) {
          data.blogs.forEach((blog: any) => {
            if (blog.slug) {
              paths.push({ locale, id: blog.slug });
            }
          });
        }
      } catch (error) {
        console.error(
          `Error generating static params for blogs (${locale}):`,
          error,
        );
      }
    }),
  );

  return paths;
}

interface BlogOnePageProps {
  params: Promise<{
    locale: string;
    id: string; // This is slug
  }>;
}

export async function generateMetadata({
  params,
}: BlogOnePageProps): Promise<Metadata> {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);
  let seo: SEO = {} as SEO;

  // Blog SEO
  try {
    const seoResult = await blogsClient.query<SEOData>({
      query: GET_BLOG_SEO,
      variables: { slug: slug, language: locale },
    });

    if (seoResult.data?.blogSEO) {
      seo = seoResult.data.blogSEO;
    }
  } catch (error) {
    console.error("❌ Blogs seo error:", error);
  }

  // URL tuzish
  const baseUrl = "https://www.centraliatours.com";
  let canonicalUrl = seo?.canonicalUrl
    ? sanitizeUrl(seo.canonicalUrl).replace(/http:\/\/localhost:\d+/g, baseUrl)
    : `${baseUrl}/${locale}/blogs/${slug}`;

  // Agar canonicalUrl locale'siz bo'lsa, locale qo'shish
  if (canonicalUrl && !canonicalUrl.includes(`/${locale}/`)) {
    // URL'dan baseUrl ni olib tashlash
    const urlPath = canonicalUrl.replace(baseUrl, "");

    // Agar path `/blogs/` bilan boshlansa, locale qo'shish
    if (urlPath.startsWith("/blogs/") || urlPath.startsWith("/tours/")) {
      canonicalUrl = `${baseUrl}/${locale}${urlPath}`;
    } else if (!urlPath.startsWith(`/${locale}/`)) {
      // Boshqa hollarda ham locale qo'shish
      canonicalUrl = `${baseUrl}/${locale}${urlPath}`;
    }
  }

  // Default qiymatlar
  const defaultTitle = "Centralia Travel Agency | Travel Blog";
  const defaultDescription =
    "Explore amazing travel destinations with Centralia Travel Agency";
  const defaultImage = `${baseUrl}/og/default.jpg`;

  // Ko'p tillik SEO
  const alternates = buildAlternates(locale, `/blogs/${slug}`);

  // Meta keywords formatini tekshirish
  let keywords: string[] = [];
  if (seo?.metaKeywords) {
    if (Array.isArray(seo.metaKeywords)) {
      keywords = seo.metaKeywords;
    } else if (typeof seo.metaKeywords === "string") {
      keywords = seo.metaKeywords.split(",").map((k) => k.trim());
    }
  } else {
    keywords = ["travel", "blog", "adventure", "tourism"];
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

export default async function BlogOnePage({ params }: BlogOnePageProps) {
  const { locale, id: slug } = await params;
  setRequestLocale(locale);

  // Parallel ravishda barcha ma'lumotlarni olish

  // Track view blog
  try {
    if (slug.length > 4) {
      await fetch(
        `${process.env.NEXT_PUBLIC_URI}/api/blogs/${slug}/track-view`,
        { method: "POST" },
      );
    }
  } catch (error) {
    console.error(error);
  }

  const [seoResult, blogResult] = await Promise.allSettled([
    blogsClient.query<SEOData>({
      query: GET_BLOG_SEO,
      variables: { slug: slug, language: locale },
    }),
    blogsClient.query<BlogBySlugData>({
      query: GET_BLOGBYSLUG,
      variables: { slug: slug, language: locale },
    }),
  ]);

  const seo =
    seoResult.status === "fulfilled" && seoResult.value.data?.blogSEO
      ? seoResult.value.data.blogSEO
      : ({} as SEO);

  const blogOne =
    blogResult.status === "fulfilled" && blogResult.value.data?.blogGeneral
      ? blogResult.value.data.blogGeneral
      : ({} as Blog);

  // Blog ma'lumotlarini olish
  let blog: Blog = {} as Blog;

  if (blogResult.status === "fulfilled" && blogResult.value.data?.blogGeneral) {
    const blogData = blogResult.value.data.blogGeneral;

    // Blog ma'lumotlarini transformatsiya qilish
    // API'dan kelgan ma'lumotlar bilan interface'dagi ma'lumotlarni moslashtirish
    // Destructure known fields so we can spread the rest without duplicating keys like title
    const {
      title,
      content,
      excerpt,
      slug: blogSlug,
      featuredImage,
      authorName,
      publishedAt,
      updatedAt,
      tags,
      categories,
      readTime,
      ...rest
    } = blogData;

    blog = {
      // ID bo'lmasa, slug ni ID sifatida ishlatish
      id: slug, // slug ni temporary ID sifatida
      title: title || "",
      content: content || "",
      excerpt: excerpt || "",
      slug: blogSlug || slug,
      featuredImage: featuredImage || "",
      author: {
        name: authorName || "Centralia Travel Agency",
        avatar: "", // agar API'dan kelmasa
      },
      publishedAt: publishedAt || new Date().toISOString(),
      updatedAt: updatedAt || publishedAt || new Date().toISOString(),
      tags: tags || [],
      category: categories?.[0]?.name || "General",
      readingTime: readTime || 5, // readTime -> readingTime
      // Qo'shimcha maydonlar (only remaining keys)
      ...rest,
    } as Blog;
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

      // BlogPosting uchun qo'shimcha maydonlar
      if (structuredData["@type"] === "BlogPosting") {
        // Sana formatlarini tekshirish
        if (blog.publishedAt) {
          structuredData.datePublished = new Date(
            blog.publishedAt,
          ).toISOString();
        }
        if (blog.updatedAt) {
          structuredData.dateModified = new Date(blog.updatedAt).toISOString();
        }

        // Author ma'lumotlarini qo'shish
        if (!structuredData.author) {
          structuredData.author = {
            "@type": "Person",
            name: blog.author?.name || "Centralia Travel Agency",
          };
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
        if (blog.content && !structuredData.articleBody) {
          // HTML teglarini olib tashlash
          const plainText = blog.content
            .replace(/<[^>]*>/g, "")
            .substring(0, 500);
          structuredData.articleBody = plainText;
        }
      }
    } catch (error) {
      console.error("❌ Error processing blog structuredData:", error);
    }
  }

  // Agar blog topilmasa yoki asosiy maydonlar bo'sh bo'lsa
  // ID kerak emas, faqat title va content bo'lsa ham yetarli
  if (!blog || !blog.title || !blog.content) {
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
        <BlogOne data={blogOne} />
      </main>
    </>
  );
}
