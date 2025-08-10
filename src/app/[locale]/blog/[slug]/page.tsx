import { TravelInsights } from "@/components";
import { BlogService } from "@/services/blog.service";
import React from "react";

const page = async ({ params }: { params: { slug: string } }) => {
  const blog = await BlogService.getBySlugBlog(params.slug);
  return (
    <div className="mt-24">
      <TravelInsights data={blog} />
    </div>
  );
};

export default page;
