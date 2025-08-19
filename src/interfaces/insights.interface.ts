import { TranslationsProps } from "./helper.interface";

interface AuthorDto {
  id: string;
  name: string;
}

export interface Comment {
  _id: string;
  blogId: string;
  blogSlug?: string; // Add blog slug for better tracking
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
  coverImage?: string;
  author: AuthorDto;
  tags: string[];
  views: number;
  ratingAvg: number;
  ratingCount: number;
  comments?: Comment[];
  likes: string[];
  likeCount: number;
  publishedAt?: string;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}
