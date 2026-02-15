"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";

const BlogHead = () => {
  const t = useTranslations("blogs");

  return (
    <section className="lg:pt-24 pt-28 relative w-full overflow-hidden h-[50vh] md:h-[60vh] flex items-center justify-center">
      {/* Background image */}
      <Image
        src="https://media.centraliatours.com/blogs/blogHead.avif"
        alt="Centralia Travel Blogs"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0D0D0C]/50" />

      {/* Content */}
      <div className="z-10 text-center px-4">
        <h2 className={`${styles.h2} !text-white`}>{t("title")}</h2>
      </div>
    </section>
  );
};

export default BlogHead;
