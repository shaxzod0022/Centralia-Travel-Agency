import { NoTours, TourHead } from "@/components";
import ToursFilteredClient from "@/components/tours/ToursFilteredClient";
import { FilterService } from "@/rest/filter.service";
import { mapBackendFacetsToUI } from "@/utils/mapper";
import { Metadata } from "next";
import { getMessages, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo/buildAlternates";
import { Tour } from "@/interfaces/tour.interface";
import { FilterFacets } from "@/interfaces/filter.interface";

// ISR: revalidate every 30 minutes for tour listings
export const revalidate = 1800;
export const dynamicParams = false;

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
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

  // Commercial keywords for tours listing
  const defaultTitle =
    "Premium Central Asia Tours | Uzbekistan Kazakhstan Kyrgyzstan Tours";
  const defaultDescription =
    "Book premium guided tours across Central Asia. Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan & Turkmenistan tours with local experts. Best prices guaranteed.";
  const defaultKeywords =
    "central asia tours, uzbekistan tours, kazakhstan tours, kyrgyzstan tours, tajikistan tours, turkmenistan tours, silk road tours, premium travel, guided tours";

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/tours");

  return {
    title: languages?.seoTours?.title || defaultTitle,
    description: languages?.seoTours?.description || defaultDescription,
    keywords: languages?.seoTours?.keywords || defaultKeywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: languages?.seoTours?.ogTitle || defaultTitle,
      description: languages?.seoTours?.ogDescription || defaultDescription,
      url: `${baseUrl}/${locale}/tours`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/tours.jpg`,
          width: 1200,
          height: 630,
          alt: "Central Asia Tours",
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
      title: languages?.seoTours?.ogTitle || defaultTitle,
      description: languages?.seoTours?.ogDescription || defaultDescription,
      images: [`${baseUrl}/og/tours.jpg`],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },
    alternates,
  };
}

export default async function ToursPage(props: Params) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  setRequestLocale(locale);

  // Server-side data fetching for initial tours (improves FCP & SEO)
  let initialTours: Tour[] = [];
  let initialTotal = 0;
  let initialFacets: FilterFacets | null = null;

  try {
    const res = await FilterService.getFilteredTours({
      language: locale,
      ...searchParams,
    });
    initialTours = res.data.tours;
    initialTotal = res.data.total;
    initialFacets = mapBackendFacetsToUI(res.facets);
  } catch (error) {
    console.error("Failed to fetch initial tours:", error);
  }

  if (!initialTours || initialTours.length === 0) {
    return <NoTours />;
  }

  return (
    <main>
      <TourHead />
      <ToursFilteredClient
        initialTours={initialTours}
        initialTotal={initialTotal}
        initialFacets={initialFacets}
      />
    </main>
  );
}

