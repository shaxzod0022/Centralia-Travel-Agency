import { NextIntlClientProvider } from "next-intl";
import { Footer, Navbar } from "@/components";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  let messages;

  try {
    messages = await getMessages({ locale });
  } catch {
    messages = null;
  }

  const baseUrl = "https://www.centraliatours.com";

  return {
    metadataBase: new URL(baseUrl),

    title:
      messages?.metadata?.title ||
      "Centralia Travel Agency | Explore Central Asia Tours",

    description:
      messages?.metadata?.description ||
      "Premium tours and travel packages across Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan and Turkmenistan.",

    keywords:
      messages?.metadata?.keywords ||
      "central asia tours, silk road travel, premium travel, centralia travel agency",

    robots: {
      index: true,
      follow: true,
    },

    // ✅ FAVICON — IDEAL SETUP
    icons: {
      icon: [
        { url: "/favicon-for-app/favicon.ico" }, // 16/32/48 inside
        {
          url: "/favicon-for-app/icon-48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          url: "/favicon-for-app/icon1.png",
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/favicon-for-app/apple-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },

    openGraph: {
      title:
        messages?.metadata?.ogTitle ||
        "Central Asia Tours | Centralia Travel Agency",
      description:
        messages?.metadata?.ogDescription ||
        "Premium travel packages across Central Asia.",
      url: `${baseUrl}/${locale}`,
      siteName: "Centralia Travel Agency",
      images: [
        {
          url: `${baseUrl}/og/default.jpg`,
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
      title:
        messages?.metadata?.ogTitle ||
        "Central Asia Tours | Centralia Travel Agency",
      description:
        messages?.metadata?.ogDescription ||
        "Premium travel packages across Central Asia.",
      images: [`${baseUrl}/og/default.jpg`],
    },


  };
}

// Move themeColor to the `viewport` export per Next.js expectations for app-router
export const viewport = {
  themeColor: "#ffffff",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
