import { ComponentsHead, TravelInsights } from "@/components";
import { BlogService } from "@/services/blog.service";
import { styles } from "@/styles/styles";
import React from "react";

const page = async () => {
  const blog = await BlogService.getAllBlogs();
  return (
    <div className={`${styles.paddingCont} mt-20 scroll-mt-16`}>
      <ComponentsHead langKey={6} />
      <TravelInsights data={blog} />
    </div>
  );
};

export default page;
