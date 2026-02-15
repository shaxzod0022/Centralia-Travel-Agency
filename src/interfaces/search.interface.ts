/* ================= TYPES ================= */

export interface SearchModalProps {
  show: { show: boolean; value: string };
  openClose?: () => void;
}

export interface SearchPreviewResponse {
  countries: SearchCountry[];
  destinations: SearchDestination[];
  tours: SearchTour[];
}

export interface SearchCountry {
  id: number;
  name: string;
  image?: string;
}

export interface SearchDestination {
  id: number;
  name: string;
  image: string;
  country?: string;
}

export interface SearchTour {
  id: number;
  name: string;
  slug: string;
  coverImage: string;
}
