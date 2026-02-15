// interfaces/blog.interface.ts
export interface Blog {
  id?: string; // Optional, chunki API'dan kelmaydi
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage: string;
  readTime?: number; // API'dan `readTime` nomi bilan keladi
  readingTime?: number; // Komponentlar uchun
  viewsCount?: number;
  authorName?: string; // API'dan keladi
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  category?: string;
  categories?: Array<{ id: number; name: string }>;
  // Qo'shimcha maydonlar
  [key: string]: any;
}

export interface BlogBySlugData {
  blogGeneral: {
    title: string;
    content: string;
    slug: string;
    featuredImage: string;
    readTime?: number;
    viewsCount?: number;
    authorName?: string;
    categories?: Array<{ id: number; name: string }>;
    publishedAt: string;
    excerpt?: string;
    tags?: string[];
    updatedAt?: string;
  };
}

export interface BlogsData {
  blogs: Blog[];
}

export interface BlogsData4 {
  latestBlogs: Blog[];
}