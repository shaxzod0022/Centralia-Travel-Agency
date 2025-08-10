import { TranslationsProps } from "./helper.interface";

export interface CountryProps {
  _id: string;
  code: string;
  title: TranslationsProps;
  description: TranslationsProps;
  heroImageUrl: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
