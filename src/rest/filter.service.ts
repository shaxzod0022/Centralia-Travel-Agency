// src/rest/filter.service.ts
// Using native fetch with Next.js ISR caching
import { TourFilterParams } from "@/interfaces/tour.interface";
import { TourBackendResponse } from "@/interfaces/filter.interface";

export class FilterService {
  private static buildQueryParams(params: TourFilterParams): URLSearchParams {
    const queryParams = new URLSearchParams();

    queryParams.append("language", params.language);

    if (params.page) queryParams.append("page", String(params.page));
    if (params.limit) queryParams.append("limit", String(params.limit));
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.minPrice)
      queryParams.append("minPrice", String(params.minPrice));
    if (params.maxPrice)
      queryParams.append("maxPrice", String(params.maxPrice));
    if (params.minDuration)
      queryParams.append("minDuration", String(params.minDuration));
    if (params.maxDuration)
      queryParams.append("maxDuration", String(params.maxDuration));
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const appendArrayParam = (
      key: string,
      value: string | string[] | number | number[],
    ) => {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(","));
      } else {
        queryParams.append(key, String(value));
      }
    };

    if (params.country) appendArrayParam("country", params.country);
    if (params.destination) appendArrayParam("destination", params.destination);
    if (params.category) appendArrayParam("category", params.category);
    if (params.duration) appendArrayParam("duration", params.duration);
    if (params.technical) appendArrayParam("technical", params.technical);
    if (params.fitness) appendArrayParam("fitness", params.fitness);
    if (params.price) appendArrayParam("price", params.price);
    if (params.season) appendArrayParam("season", params.season);

    return queryParams;
  }

  static async getFilteredTours(
    params: TourFilterParams,
  ): Promise<TourBackendResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_URI;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_URI environment variable is not set");
    }

    const url = `${baseUrl}/api/public/tours?${this.buildQueryParams(params)}`;

    const res = await fetch(url, {
      next: { revalidate: 1800 }, // 30-minute ISR cache for tour listings
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tours: ${res.status}`);
    }

    return res.json();
  }
}

