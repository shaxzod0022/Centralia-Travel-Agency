"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";

const TourHead = () => {
  const t = useTranslations("tours");

  return (
    <div className="lg:pt-24 pt-28 relative w-full overflow-hidden h-[50vh] md:h-[60vh] flex items-center justify-center">
      <Image
        src="https://media.centraliatours.com/tours/toursHead.avif"
        alt="Tours Header"
        fill
        unoptimized
        priority
        className="object-cover -z-10"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-[#0D0D0C] opacity-50 -z-10"></div>

      <h2 className={`${styles.h2} !text-white text-center z-10`}>{t("headTitle")}</h2>
    </div>
  );
};

export default TourHead;
