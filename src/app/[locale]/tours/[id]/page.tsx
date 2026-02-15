"use strict";
import { DeskAndMobil, NoTours, TourImages } from "@/components";
import JsonLdScript from "@/components/JsonLdScript";
import { GET_AD_ONS } from "@/gql/getAddOns";
import { GET_TOUR_OPTION } from "@/gql/getOption";
import { GET_TOUR_SEO } from "@/gql/getTourSeo";
import { AddOnsData } from "@/interfaces/addOns.interface";
import { SEO, TourSEOData } from "@/interfaces/seo.interface";
import { mainClient } from "@/lib/apolloClient";
import { Metadata } from "next";
import { buildAlternates, sanitizeUrl } from "@/lib/seo/buildAlternates";
import { TOUR_COMPLETE_QUERY } from "@/gql/getTourComplete";
import {
  TourComplete,
  TourCompleteQueryResponse,
} from "@/interfaces/tourComplete.interface";
import { DataTourOption, TourOption } from "@/interfaces/calendar.interface";

// ISR: revalidate every 5 minutes for fresh tour data while enabling CDN caching
export const revalidate = 300;
// Allow fallback for new slugs not pre-rendered at build time
export const dynamicParams = true;

// Pre-render popular tours at build time
export async function generateStaticParams() {
  const locales = ["en", "ru", "es", "ja", "de"];

  try {
    // Fetch tour slugs for pre-rendering
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URI}/api/public/tours?language=en&limit=50`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return [];

    const data = await res.json();
    const tours = data.data?.tours || [];

    // Generate params for each locale + tour combination
    return tours.flatMap((tour: { slug: string }) =>
      locales.map((locale) => ({
        locale,
        id: tour.slug,
      })),
    );
  } catch (error) {
    console.error("Failed to generate static params for tours:", error);
    return [];
  }
}

interface Props {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  let seo: SEO = {} as SEO;

  try {
    const seoResult = await mainClient.query<TourSEOData>({
      query: GET_TOUR_SEO,
      variables: { slug: id, language: locale },
    });

    if (seoResult.data?.tourSEO) {
      seo = seoResult.data.tourSEO;
    }
  } catch (error) {
    console.error("Tour SEO error:", error);
  }

  // URL tuzish
  const baseUrl = "https://www.centraliatours.com";
  const canonicalUrl = seo?.canonicalUrl
    ? sanitizeUrl(seo.canonicalUrl).replace(/http:\/\/localhost:\d+/g, baseUrl)
    : `${baseUrl}/${locale}/tours/${id}`;

  // Default qiymatlar
  const defaultTitle = "Centralia Travel Agency | Tour";
  const defaultDescription =
    "Explore amazing tours with Centralia Travel Agency";
  const defaultImage = `${baseUrl}/og/default.jpg`;

  // Ko'p tillik SEO
  const alternates = buildAlternates(locale, `/tours/${id}`);

  return {
    title: seo?.metaTitle || defaultTitle,
    description: seo?.metaDescription || defaultDescription,
    keywords: (() => {
      const mk = seo?.metaKeywords;
      if (Array.isArray(mk)) return mk;
      if (typeof mk === "string") return mk.split(",").map((k) => k.trim());
      return ["tour", "travel", "central asia"];
    })(),

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
      type: "website",
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

export default async function TourOne({ params }: Props) {
  const { locale, id } = await params;

  // Barcha ma'lumotlarni parallel ravishda olish
  const [seoResult, completeResult, optionsResult, addonsResult] =
    await Promise.allSettled([
      mainClient.query<TourSEOData>({
        query: GET_TOUR_SEO,
        variables: { slug: id, language: locale },
      }),
      mainClient.query<TourCompleteQueryResponse>({
        query: TOUR_COMPLETE_QUERY,
        variables: { language: locale, slug: id },
      }),
      mainClient.query<DataTourOption>({
        query: GET_TOUR_OPTION,
        variables: { language: locale, slug: id },
      }),
      mainClient.query<AddOnsData>({
        query: GET_AD_ONS,
        variables: { language: locale, slug: id },
      }),
    ]);

  // Ma'lumotlarni chiqarish
  const seo =
    seoResult.status === "fulfilled" && seoResult.value.data?.tourSEO
      ? seoResult.value.data.tourSEO
      : ({} as SEO);

  const completeTour =
    completeResult.status === "fulfilled" &&
    completeResult.value.data?.tourComplete
      ? completeResult.value.data.tourComplete
      : ({} as TourComplete);

  const tourOption =
    optionsResult.status === "fulfilled" &&
    optionsResult.value.data?.tourOptions
      ? optionsResult.value.data.tourOptions
      : ({} as TourOption);

  const addOns =
    addonsResult.status === "fulfilled" && addonsResult.value.data?.tourAddOns
      ? addonsResult.value.data.tourAddOns
      : [];

  // StructuredData ni tayyorlash
  let structuredData = null;
  if (seo?.structuredData) {
    try {
      const rawData =
        typeof seo.structuredData === "string"
          ? JSON.parse(seo.structuredData)
          : seo.structuredData;

      // Localhost manzillarini production manziliga almashtirish
      const dataStr = JSON.stringify(rawData);
      const updatedStr = dataStr.replace(
        /http:\/\/localhost:\d+/g,
        "https://centraliatours.com",
      );
      structuredData = JSON.parse(updatedStr);
    } catch (error) {
      console.error("Error processing structuredData:", error);
    }
  }

  if (!completeTour || !completeTour.gallery) {
    return new Response("Data not found or permanently removed", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return (
    <>
      {/* JSON-LD Script (faqat client-side) */}
      {structuredData && <JsonLdScript structuredData={structuredData} />}

      <main>
        <div className="md:pt-26 pt-24 bg-[#F2F2F2]">
          <TourImages generalInfo={completeTour} />
        </div>

        <DeskAndMobil
          completeTour={completeTour}
          tourOption={tourOption}
          addOns={addOns}
        />
      </main>
    </>
  );
}
