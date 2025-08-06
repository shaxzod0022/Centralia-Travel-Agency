import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Footer, Navbar } from "@/components";
import Head from "next/head";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const titles: Record<string, string> = {
    en: "Centralia Travel Agency",
    es: "Agencia de viajes Centralia",
    fr: "Agence de voyage Centralia",
    zh: "中环旅游公司ı",
  };

  const descriptions: Record<string, string> = {
    en: "Explore the world with Centralia Travel Agency.",
    es: "Descubre viajes inolvidables con Centralia Travel Agency. Explora tours personalizados, experiencias culturales y viajes sin complicaciones a los mejores destinos del mundo. ¡Reserva tu próxima aventura hoy mismo!",
    fr: "Découvrez des voyages inoubliables avec Centralia Travel Agency. Profitez de circuits personnalisés, d’expériences culturelles et d’un voyage sans stress vers les meilleures destinations du monde. Réservez votre prochaine aventure dès aujourd'hui !",
    zh: "与 Centralia 旅行社一起开启难忘的旅程。探索个性化旅行、文化体验以及前往全球热门目的地的无忧旅行。立即预订您的下一次冒险=！",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning className="hydrate">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased mx-auto w-full max-w-[1800px]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
