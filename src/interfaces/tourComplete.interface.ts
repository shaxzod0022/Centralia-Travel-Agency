// src/interfaces/tour-complete.interface.ts

export interface TourCompleteQueryVariables {
  slug: string;
  language?: string;
}

export interface TourCompleteQueryResponse {
  tourComplete: TourComplete | null;
}

// ================= MAIN =================

export interface TourComplete {
  id: number;
  slug: string;
  name: string;
  coverImage: string;
  durationDays: number;
  durationNights: number;
  countries: TourCountry[];
  shortDescription: string;
  minPrice: number;
  technicalLevel: number;
  fitnessLevel: number;
  longDescription?: string | null;
  highlights?: string[] | null;
  destinations: TourDestination[];
  categories: TourCategory[];
  ageRange: AgeRange;
  gallery: string[];
  tourMapLink?: string | null;
  faqs: FAQ[];
  tourItinerary: TourItineraryDay[];
  tourIncluded: string[];
  tourExcluded: string[];

  // Optional backend fields
  maxPrice?: number;
  rating?: number;
  reviewCount?: number;
  groupSize?: GroupSize;
  bookingDeadline?: number;
  startLocation?: string;
  endLocation?: string;
}

// ================= SUB TYPES =================

export interface TourCountry {
  id: number;
  name: string;
  code: string;
}

export interface TourDestination {
  id: number;
  name: string;
}

export interface TourCategory {
  id: number;
  name: string;
}

export interface AgeRange {
  min: number;
  max: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
}

// ================= ITINERARY =================

export interface TourItineraryDay {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
  whatToExpect?: string | null;

  // SCALAR fields (IMPORTANT)
  meals: string[];
  transportation: string;

  accommodation?: Accommodation | null;

  dayGallery: string[];

  distanceMin?: number | null;
  distanceMax?: number | null;
  durationMin?: number | null;
  durationMax?: number | null;
}

// ================= ACCOMMODATION =================

export interface Accommodation {
  name: string;
  type: string;
  address: string;
  starRating?: number | null;
  addressLink?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  photos?: string[] | null;
  rooms?: Room[] | null;
}

export interface Room {
  name: string;
  capacity: number;
  quantity: number;
}

// ================= GROUP =================

export interface GroupSize {
  min: number;
  max: number;
}
