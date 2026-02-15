// src/interfaces/tour.interface.ts

// Asosiy Tour interface
export interface Tour {
  id: number;
  slug: string;
  name: string;
  coverImage: string;
  durationDays: number;
  durationNights: number;
  countries: string[];
  shortDescription: string;
  technicalLevel: number;
  fitnessLevel: number;
  categories: Category[];
  minPrice: number;

  // Additional fields (agar mavjud bo'lsa)
  maxPrice?: number;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  images?: string[];
  videos?: string[];
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: ItineraryDay[];
  accommodations?: string[];
  transports?: string[];
  ageRestriction?: AgeRestriction;
  groupSize?: GroupSize;
  availability?: Availability[];
  bookingDeadline?: number;
}

export interface Category {
  id: number;
  name: string;
}

// Filter facet interfaces
export interface CountryFacet {
  id: number;
  name: string;
  count: number;
  disabled: boolean;
}

export interface DestinationFacet {
  id: number;
  name: string;
  count: number;
  disabled: boolean;
}

export interface CategoryFacet {
  key: number;
  value: string;
  count: number;
  disabled: boolean;
}

export interface DurationFacet {
  key: string; // "1-2", "3-4", etc.
  count: number;
  disabled: boolean;
}

export interface SeasonFacet {
  key: string; // "jan", "feb", etc.
  count: number;
  disabled: boolean;
}

export interface TechnicalFacet {
  key: number; // 1-5
  count: number;
  disabled: boolean;
}

export interface FitnessFacet {
  key: number; // 1-5
  count: number;
  disabled: boolean;
}

export interface PriceFacet {
  key: string; // "100-199", "200-299", etc.
  count: number;
  disabled: boolean;
}

// Facets object
export interface TourFacets {
  countries: CountryFacet[];
  destinations: DestinationFacet[];
  categories: CategoryFacet[];
  duration: DurationFacet[];
  season: SeasonFacet[];
  technical: TechnicalFacet[];
  fitness: FitnessFacet[];
  price: PriceFacet[];
}

// API response structure
export interface TourListResponse {
  success: boolean;
  data: {
    tours: Tour[];
    total: number;
    // Additional pagination fields (agar mavjud bo'lsa)
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  facets: TourFacets;
}

// src/interfaces/tour.interface.ts

export interface TourFilterParams {
  language: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;

  // Filter parameters - string array sifatida
  country?: string[] | string;
  destination?: string[] | string;
  category?: string[] | string;
  duration?: string[] | string;
  season?: string[] | string;
  technical?: string[] | string;
  fitness?: string[] | string;
  price?: string[] | string;
}

// Optional detailed interfaces
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  activities: Activity[];
  accommodation: string;
  transport: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
}

export interface AgeRestriction {
  min: number;
  max?: number;
}

export interface GroupSize {
  min: number;
  max: number;
}

export interface Availability {
  startDate: string;
  endDate: string;
  availableSpots: number;
  price: number;
  isGuaranteed: boolean;
}

export interface FaqsItem {
  id: number;
  displayOrder: number;
  question: string;
  answer: string;
}
