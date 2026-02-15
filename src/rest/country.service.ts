// src/rest/country.service.ts
// Using native fetch with Next.js ISR caching

export class CountryService {
  static async getCountries(lang: string) {
    const url = `${process.env.NEXT_PUBLIC_URI}/api/public/countries?language=${lang}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1-hour ISR cache
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch countries: ${res.status}`);
    }

    return res.json();
  }
}

