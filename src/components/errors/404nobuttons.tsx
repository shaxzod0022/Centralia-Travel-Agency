"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Bevan } from "next/font/google";

const jaro = Bevan({
  subsets: ["latin"],
  weight: ["400"],
});

const NotFound = () => {
  const t = useTranslations("notFound");

  return (
    <div
      className={`
        relative w-full min-h-screen bg-no-repeat bg-center bg-cover 
        md:bg-[url('/pagenotfound.png')]
        // bg-[url('/mobil_not_found.jpg')]
      `}
    >
      {/* Content */}
      <div
        className="
          absolute inset-0 z-10 
          flex flex-col items-center justify-center text-center px-5
        "
      >
        <h2
          className={`text-[#056D50] 2xl:text-[120px] md:text-[95px] text-[70px] ${jaro.className}`}
        >
          404
        </h2>

        <h2 className={`${styles.h2} text-[#056D50]`}>{t("title")}</h2>

        <p className={`${styles.p} !text-[#056D50] max-w-[600px] mt-2 mb-6`}>
          {t("description")}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
