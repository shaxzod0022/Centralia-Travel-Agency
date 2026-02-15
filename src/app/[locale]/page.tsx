import {
  Blogs4,
  Categories,
  Comments,
  Destination,
  Gallery,
  Head,
  NotFoundNoButtons,
  PopularDestination,
  Statistika,
  TripPlan,
} from "@/components";
import { getMessages, setRequestLocale } from "next-intl/server";
import { blogsClient } from "@/lib/apolloClient";
import { Blog, BlogsData4 } from "@/interfaces/blog.interface";
import type { Metadata } from "next";
import { CountryService } from "@/rest/country.service";
import { DestinationService } from "@/rest/destination.service";
import { FilterService } from "@/rest/filter.service";
import { GET_BLOGS4 } from "@/gql/getBlogs4";
import { buildAlternates } from "@/lib/seo/buildAlternates";

interface Params {
  params: Promise<{
    locale: string;
  }>;
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
    "Centralia Travel Agency | Discover the Silk Road & Central Asia Tours";
  const defaultDescription =
    "Explore unforgettable trips across Central Asia. Book premium tours to Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, and Turkmenistan.";
  const defaultKeywords =
    "central asia tours, silk road travel, uzbekistan tours, centralia travel agency";

  // ✅ Ko'p tillik SEO - barcha tillar uchun alternativ linklar
  const baseUrl = "https://www.centraliatours.com";
  const { canonical, languages: alternates } = buildAlternates(locale, "/");

  return {
    title: (languages?.seoHome?.title as string) || defaultTitle,
    description:
      (languages?.seoHome?.description as string) || defaultDescription,
    keywords: (languages?.seoHome?.keywords as string) || defaultKeywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: (languages?.seoHome?.ogTitle as string) || defaultTitle,
      description:
        (languages?.seoHome?.ogDescription as string) || defaultDescription,
      url: `${baseUrl}/${locale}`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: "Centralia Travel Agency",
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: (languages?.seoHome?.ogTitle as string) || defaultTitle,
      description:
        (languages?.seoHome?.ogDescription as string) || defaultDescription,
      images: [`${baseUrl}/og/home.jpg`],
    },
    // ✅ KO'P TILLIK SEO - hreflang taglar
    alternates: {
      canonical,
      languages: alternates,
    },
  };
}

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

export default async function HomePage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  let blogs: Blog[] = [];

  const countries = await CountryService.getCountries(locale);
  const destinations = await DestinationService.getDestinations(locale);
  const tours = await FilterService.getFilteredTours({
    language: locale,
  });

  try {
    const blogsResult = await blogsClient.query<BlogsData4>({
      query: GET_BLOGS4,
      variables: { language: locale },
    });

    if (blogsResult.data?.latestBlogs) {
      blogs = blogsResult.data.latestBlogs;
    }
  } catch (error) {
    console.error("Blogs query error:", error);
  }

  if (
    !countries.data.countries.length &&
    !destinations.data.destinations.length &&
    !blogs.length &&
    !tours.data.tours.length
  ) {
    return <NotFoundNoButtons />;
  }

  return (
    <main>
      <Head />
      <Categories data={countries.data.countries} />
      <PopularDestination data={tours.data.tours} />
      <Destination data={destinations.data.destinations} />
      <TripPlan />
      <Gallery />
      <Statistika />
      <Comments />
      <Blogs4 data={blogs} />
    </main>
  );
}
