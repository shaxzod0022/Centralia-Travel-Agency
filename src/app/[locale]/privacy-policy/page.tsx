import { PrivacyPolicy } from "@/components";
import { setRequestLocale } from "next-intl/server";

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

export default async function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <PrivacyPolicy />
    </main>
  );
}
