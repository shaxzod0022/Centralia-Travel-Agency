// src/interfaces/filter.interface.ts

import { Tour } from "./tour.interface";

export interface FilterItem {
  value: string;
  label: string;
  count: number;
  disabled: boolean;
}

export interface FilterFacets {
  countries: FilterItem[];
  destinations: FilterItem[];
  categories: FilterItem[];
  duration: FilterItem[];
  season: FilterItem[];
  technical: FilterItem[];
  fitness: FilterItem[];
  price: FilterItem[];
}

export interface FilterState {
  country?: string[];
  destination?: string[];
  category?: string[];
  duration?: string[];
  season?: string[];
  technical?: string[];
  fitness?: string[];
  price?: string[];
}

// src/interfaces/backend-facets.interface.ts

export interface BackendCountryFacet {
  id: number;
  name: string;
  count: number;
  disabled: boolean;
}

export interface BackendDestinationFacet {
  id: number;
  name: string;
  count: number;
  disabled: boolean;
}

export interface BackendCategoryFacet {
  key: number;
  value: string;
  count: number;
  disabled: boolean;
}

export interface BackendKeyFacet<T = string | number> {
  key: T;
  count: number;
  disabled: boolean;
}

export interface BackendFacets {
  countries: BackendCountryFacet[];
  destinations: BackendDestinationFacet[];
  categories: BackendCategoryFacet[];
  duration: BackendKeyFacet<string>[];
  season: BackendKeyFacet<string>[];
  technical: BackendKeyFacet<number>[];
  fitness: BackendKeyFacet<number>[];
  price: BackendKeyFacet<string>[];
}

export interface TourBackendResponse {
  success: boolean;
  data: {
    tours: Tour[];
    total: number;
  };
  facets: BackendFacets;
}
