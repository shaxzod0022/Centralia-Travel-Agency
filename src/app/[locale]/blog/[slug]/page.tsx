// app/[locale]/blog/[slug]/page.tsx
import { Blog } from "@/components";
import { BlogService } from "@/services/blog.service";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const blog = await BlogService.getBySlugBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="mt-16 mx-auto max-w-[1800px]">
      <Blog data={blog} />
    </div>
  );
}
