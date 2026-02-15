import {
  About,
  AboutHead,
  BookVokation,
  TourGuides,
} from "@/components";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo/buildAlternates";
import { TeamMember, TeamMembersData } from "@/interfaces/teem.interface";
import { teamMembersClient } from "@/lib/apolloClient";
import { GET_TEEM } from "@/gql/getTeem";

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
    "About Centralia Travel Agency | Your Central Asia Experts";
  const defaultDescription =
    "Learn about Centralia Travel Agency, a trusted tour operator offering premium travel experiences across Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, and Turkmenistan.";
  const defaultKeywords =
    "about centralia travel, central asia travel agency, silk road experts, uzbekistan travel company";

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/about");

  return {
    title: languages?.seoAbout?.title || defaultTitle,
    description: languages?.seoAbout?.description || defaultDescription,
    keywords: languages?.seoAbout?.keywords || defaultKeywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: languages?.seoAbout?.ogTitle || defaultTitle,
      description: languages?.seoAbout?.ogDescription || defaultDescription,
      url: `${baseUrl}/${locale}/about`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/about.jpg`,
          width: 1200,
          height: 630,
          alt: "About Centralia Travel Agency",
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
      title: languages?.seoAbout?.ogTitle || defaultTitle,
      description: languages?.seoAbout?.ogDescription || defaultDescription,
      images: [`${baseUrl}/og/about.jpg`],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },
    alternates,
  };
}

export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  let guides: TeamMember[] = [];
  try {
    const guidesResult = await teamMembersClient.query<TeamMembersData>({
      query: GET_TEEM,
      variables: { language: locale },
    });
    if (guidesResult.data?.teamMembers) {
      guides = guidesResult.data.teamMembers;
    }
  } catch (error) {
    console.error("Guides query error:", error);
  }

  return (
    <main>
      <AboutHead />
      <About />
      <TourGuides data={guides} />
      <BookVokation />
    </main>
  );
}
