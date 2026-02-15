"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";

const ContactHead = () => {
  const t = useTranslations("b2bPage");

  return (
    <div className="lg:pt-24 pt-28 relative w-full overflow-hidden h-[50vh] md:h-[60vh] flex items-center justify-center">

      {/* Background image */}
      <Image
        src="https://media.centraliatours.com/b2b/b2bHead.avif"
        alt="Centralia Travel B2B"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0D0D0C]/50" />

      {/* Title */}
      <h2 className={`${styles.h2} !text-white z-10`}>
        {t("headTitle")}
      </h2>
    </div>
  );
};

export default ContactHead;
