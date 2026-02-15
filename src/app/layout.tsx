import React from "react";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { Providers } from "@/components";
import { Manrope } from "next/font/google";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/CookieBanner";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} ${manrope.variable}`}>
        <React.Suspense fallback={null}>
          <GoogleAnalytics />
        </React.Suspense>
        <Providers>{children}</Providers>
        <CookieBanner />
      </body>
    </html>
  );
};
export default RootLayout;
