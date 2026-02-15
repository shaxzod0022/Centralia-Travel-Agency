import { NotFound } from "@/components";
import { Metadata } from "next";
import { buildAlternates } from "@/lib/seo/buildAlternates";

interface Props {
  params: Promise<{
    locale: string;
    rest: string[];
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = "https://www.centraliatours.com";
  const alternates = buildAlternates(locale, "/404");

  return {
    title: "Page Not Found | Centralia Travel Agency",
    description: "The page you are looking for does not exist. Explore our amazing Central Asia tours and travel packages.",
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
    alternates,
  };
}

export default async function NotFoundPage() {
  return (
    <main>
      <NotFound />
    </main>
  );
}
