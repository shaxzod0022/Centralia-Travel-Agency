import { TranslationsProps } from "./helper.interface";

interface AuthorDto {
  id: string;
  name: string;
}

export interface BlogProps {
  slug: string;
  title: TranslationsProps;
  summary: TranslationsProps;
  content: TranslationsProps;
  coverImage: string;
  author: AuthorDto;
  tags: string[];
  views?: number;
  ratingAvg?: number;
  ratingCount?: number;
  publishedAt?: string;
  status: string;
}
