import { TranslationsProps } from "./helper.interface";

interface AuthorDto {
  id: string;
  name: string;
}

export interface Comment {
  _id: string;
  blogId: string;
  fullName: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogProps {
  _id: string;
  slug: string;
  title: TranslationsProps;
  summary: TranslationsProps;
  content: TranslationsProps;
  additionalInfo: TranslationsProps;
  coverImage: string;
  author: AuthorDto;
  tags: string[];
  category?: TranslationsProps;
  views?: number;
  ratingAvg?: number;
  ratingCount?: number;
  publishedAt?: string;
  status: string;
  comments?: Comment[];
}
