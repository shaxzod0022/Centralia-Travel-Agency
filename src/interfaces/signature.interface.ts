import { TranslationsProps } from "./helper.interface";

export interface ItineraryProps {
  title: TranslationsProps;
  description: TranslationsProps;
  images: string[];
}

export interface TourProps {
  _id: string;
  countryRef: string;
  title: TranslationsProps;
  difficulty: number;
  description: TranslationsProps;
  country: TranslationsProps;
  startLocation: TranslationsProps;
  endLocation: TranslationsProps;
  season: TranslationsProps;
  price: number;
  tourDays: number;
  images: string[];
  includedInPrice: TranslationsProps[];
  whatToTake: TranslationsProps[];
  dayComment: TranslationsProps[];
  travelItinerary: ItineraryProps[];
  moreInfo: TranslationsProps;
  slug: string;
  technicalLevelComment: TranslationsProps;
  technicalLevel: number;
  fitnesLevelComment: TranslationsProps;
  fitnesLevel: number;
  createdAt: string;
  updatedAt: string;
}
