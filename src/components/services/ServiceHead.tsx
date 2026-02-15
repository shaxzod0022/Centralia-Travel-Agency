"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";

const BlogHead = () => {
  const t = useTranslations("services");

  return (
    <div className="lg:pt-24 pt-28 relative w-full overflow-hidden h-[50vh] md:h-[60vh] flex items-center justify-center">

      {/* Background image */}
      <Image
        src="https://media.centraliatours.com/services/serviceHead.avif"
        alt="Centralia Travel Services"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0D0D0C]/50" />

      {/* Content */}
      <div className="z-10 text-center px-4">
        <h2 className={`${styles.h2} !text-white`}>
          {t("headTitle")}
        </h2>
        <p className={`${styles.p} !text-white`}>
          {t("headDesc")}
        </p>
      </div>
    </div>
  );
};

export default BlogHead;
