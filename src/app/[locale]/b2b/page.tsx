import { B2bHead, B2bRequest } from "@/components";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo/buildAlternates";
// ISR: 30 minutes
export const revalidate = 1800;

// Pre-render all locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' },
    { locale: 'es' },
    { locale: 'ja' },
    { locale: 'de' },
  ];
}
interface Params {
  params: { locale: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  let languages;

  try {
    languages = await getMessages({ locale });
  } catch (error) {
    console.error("Failed to load messages:", error);
    languages = null;
  }

  const defaultTitle = "Travel Agents & B2B | Centralia Travel Agency Partnerships";
  const defaultDescription = "Partner with Centralia Travel Agency for premium travel packages across Central Asia. Exclusive B2B solutions for travel agents, tour operators, and corporate partners.";
  const defaultKeywords = "travel agents partnership, B2B travel central asia, tour operator partnership, centralia travel agency B2B";

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/b2b");

  return {
    title: languages?.seoB2B?.title || defaultTitle,
    description: languages?.seoB2B?.description || defaultDescription,
    keywords: languages?.seoB2B?.keywords || defaultKeywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: languages?.seoB2B?.ogTitle || defaultTitle,
      description: languages?.seoB2B?.ogDescription || defaultDescription,
      url: `${baseUrl}/${locale}/b2b`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/b2b.jpg`,
          width: 1200,
          height: 630,
          alt: "Centralia Travel B2B",
        },
      ],
      locale: locale === 'en' ? 'en_US' : locale === 'ru' ? 'ru_RU' : locale === 'es' ? 'es_ES' : locale === 'ja' ? 'ja_JP' : locale === 'de' ? 'de_DE' : locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: languages?.seoB2B?.ogTitle || defaultTitle,
      description: languages?.seoB2B?.ogDescription || defaultDescription,
      images: [`${baseUrl}/og/b2b.jpg`],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },
    alternates,
  };
}

export default async function B2BPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <B2bHead />
      <B2bRequest />
    </main>
  );
}
