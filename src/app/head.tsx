import React from "react";

export default function Head() {
  const org = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Centralia Travel Agency",
    url: "https://centraliatours.com",
    logo: "https://centraliatours.com/logo.svg",
    description:
      "Premium tours and travel packages across Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan and Turkmenistan.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarkand",
      addressCountry: "UZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998-94-501-92-72",
      email: "travel@centraliatours.com",
      contactType: "customer service",
    },
    sameAs: ["https://www.instagram.com/centraliatours"],
    areaServed: [
      { "@type": "Country", name: "Uzbekistan" },
      { "@type": "Country", name: "Kazakhstan" },
      { "@type": "Country", name: "Kyrgyzstan" },
      { "@type": "Country", name: "Tajikistan" },
      { "@type": "Country", name: "Turkmenistan" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}
