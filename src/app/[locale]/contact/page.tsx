import { ContactHead, Contacts, GetInTouch, Map } from "@/components";
import { buildAlternates } from "@/lib/seo/buildAlternates";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
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
  params: Promise<{ locale: string }>;
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

  const defaultTitle = "Contact Us | Centralia Travel Agency – Get in Touch";
  const defaultDescription = "Contact Centralia Travel Agency for tour inquiries, travel support, bookings, and customer service across Central Asia.";
  const defaultKeywords = "contact centralia, central asia travel contact, travel agency support, silk road tours help";

  const currentPath = `/contact`;
  const { canonical, languages: alternates } = buildAlternates(locale, currentPath);

  return {
    title: languages?.seoContact?.title || defaultTitle,
    description: languages?.seoContact?.description || defaultDescription,
    keywords: languages?.seoContact?.keywords || defaultKeywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: languages?.seoContact?.ogTitle || defaultTitle,
      description: languages?.seoContact?.ogDescription || defaultDescription,
      url: canonical,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: "https://centraliatours.com/og/contact.jpg",
          width: 1200,
          height: 630,
          alt: "Contact Centralia Travel",
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: languages?.seoContact?.ogTitle || defaultTitle,
      description: languages?.seoContact?.ogDescription || defaultDescription,
      images: ["https://centraliatours.com/og/contact.jpg"],
      creator: "@centraliatravel",
      site: "@centraliatravel",
    },
    alternates: {
      canonical: canonical,
      languages: alternates,
    },
  };
}

export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <ContactHead />
      <Contacts />
      <GetInTouch />
      <Map />
    </main>
  );
}
