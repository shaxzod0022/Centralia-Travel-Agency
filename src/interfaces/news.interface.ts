// interfaces/blog.interface.ts
export interface NewsProps {
  id?: number;
  title: string;
  content: string;
  slug: string;
  featuredImage: string;
  readTime?: number;
  publishedAt: string;
  viewsCount?: number;
}

export interface NewsBySlugData {
  newsGeneral: {
    title: string;
    content: string;
    slug: string;
    featuredImage: string;
    readTime?: number;
    viewsCount?: number;
    publishedAt: string;
  };
}

export interface NewsData {
  news: NewsProps[];
}
