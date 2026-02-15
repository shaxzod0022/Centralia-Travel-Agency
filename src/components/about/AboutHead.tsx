"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";

const AboutHead = () => {
  const t = useTranslations("about");

  return (
    <div className="lg:pt-24 pt-28 relative w-full overflow-hidden h-[50vh] md:h-[60vh] flex items-center justify-center">
      {/* Slider */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <Image
          src="https://media.centraliatours.com/aboutus/aboutHead.jpg"
          alt="About Header"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#0D0D0C80]" />
      </div>

      <h2 className={`${styles.h2} !text-white z-10`}>{t("headTitle")}</h2>
    </div>
  );
};

export default AboutHead;
