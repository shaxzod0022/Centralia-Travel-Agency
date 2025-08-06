import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  type Locale = "en" | "es" | "fr" | "zh";

  let locale = (await requestLocale) as Locale | undefined;
  if (typeof locale !== "string" || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
