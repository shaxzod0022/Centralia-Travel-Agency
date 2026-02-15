// interfaces/blog.interface.ts
export interface EventsProps {
  id?: number;
  title: string;
  content: string;
  slug: string;
  featuredImage: string;
  readTime?: number;
  publishedAt: string;
  viewsCount?: number;
}

export interface EventsBySlugData {
  eventGeneral: {
    title: string;
    content: string;
    slug: string;
    featuredImage: string;
    readTime?: number;
    viewsCount?: number;
    publishedAt: string;
  };
}

export interface EventsData {
  events: EventsProps[];
}
