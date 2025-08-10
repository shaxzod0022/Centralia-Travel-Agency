// app/[locale]/blog/[slug]/page.tsx
import { TravelInsights } from "@/components";
import { BlogService } from "@/services/blog.service";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const blog = await BlogService.getBySlugBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="mt-24">
      <TravelInsights data={blog} />
    </div>
  );
}
