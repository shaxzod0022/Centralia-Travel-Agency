// src/rest/destination.service.ts
// Using native fetch with Next.js ISR caching

export class DestinationService {
  static async getDestinations(lang: string) {
    const url = `${process.env.NEXT_PUBLIC_URI}/api/public/destinations?language=${lang}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1-hour ISR cache
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch destinations: ${res.status}`);
    }

    return res.json();
  }
}

