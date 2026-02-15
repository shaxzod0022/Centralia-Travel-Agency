import {
  GetInTouch,
  HelpService,
  OurNumbers,
  ServiceHead,
  ServiceInfo,
  Services,
} from "@/components";
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
  params: {
    locale: string;
  };
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

  const defaultTitle =
    "Travel Services | Centralia Travel Agency – Discover Central Asia";
  const defaultDescription =
    "Professional travel services including custom tours, hotel booking, transportation, visa support, guides, and more across Central Asia.";
  const defaultKeywords =
    "central asia travel services, silk road tours, custom travel packages, centralia travel services";

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/services");

  return {
    title: languages?.seoService?.title || defaultTitle,
    description: languages?.seoService?.description || defaultDescription,
    keywords: languages?.seoService?.keywords || defaultKeywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: languages?.seoService?.ogTitle || defaultTitle,
      description: languages?.seoService?.ogDescription || defaultDescription,
      url: `${baseUrl}/${locale}/services`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/services.jpg`,
          width: 1200,
          height: 630,
          alt: "Centralia Travel Services",
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
      title: languages?.seoService?.ogTitle || defaultTitle,
      description: languages?.seoService?.ogDescription || defaultDescription,
      images: [`${baseUrl}/og/services.jpg`],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },
    alternates,
  };
}

export default async function ServicesPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <ServiceHead />
      {/* <ServiceInfo /> */}
      <Services />
      {/* <HelpService /> */}
      {/* <OurNumbers /> */}
      <GetInTouch />
    </main>
  );
}
