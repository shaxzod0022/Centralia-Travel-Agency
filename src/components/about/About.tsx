"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Playfair } from "next/font/google";
import Image from "next/image";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

const AboutInfo = () => {
  const t = useTranslations("about");

  return (
    <div
      className={`max-w-[1980px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 lg:py-28 md:py-20 py-16 px-4 ${styles.flex} items-stretch flex-wrap w-full`}
    >
      <div className={`${styles.flexCol} gap-5 w-full lg:w-1/2 p-4`}>
        <h2 className={styles.h2}>{t("title")}</h2>
        <p className={`text-3xl text-[#6EBB2D] ${playfair.className}`}>
          {t("shortDesc")}
        </p>
        <p className={styles.p}>{t("desc")}</p>
      </div>

      <div className="w-full lg:w-1/2 lg:h-[600px] h-80 relative">
        <Image
          src="https://media.centraliatours.com/aboutus/about1.jpg"
          alt="Centralia Travel Agency about us"
          width={240}
          height={300}
          className="absolute object-cover lg:block hidden w-64 rounded-3xl top-0 right-10 shadow-2xl border-[6px] border-white transition-all duration-500 hover:scale-105 hover:z-20 hover:rotate-2"
          sizes="(min-width: 1024px) 240px"
        />

        <Image
          src="https://media.centraliatours.com/aboutus/about2.jpg"
          alt="Centralia Travel Agency about us"
          width={180}
          height={220}
          className="absolute object-cover w-40 lg:block hidden rounded-3xl top-10 right-1/2 shadow-2xl border-[6px] border-white transition-all duration-500 hover:scale-105 hover:z-20 -rotate-3"
          sizes="(min-width: 1024px) 180px"
        />

        <Image
          src="https://media.centraliatours.com/aboutus/about3.jpg"
          alt="Centralia Travel Agency about us"
          width={180}
          height={140}
          className="absolute lg:w-48 w-20 lg:h-auto h-auto object-cover rounded-3xl bottom-10 z-10 right-10 shadow-2xl border-[4px] lg:border-[6px] border-white transition-all duration-500 hover:scale-105 hover:z-20 rotate-3"
          sizes="(min-width: 1024px) 180px, 80px"
        />

        <Image
          src="https://media.centraliatours.com/aboutus/about4.jpg"
          alt="Centralia Travel Agency about us"
          width={500}
          height={350}
          className="absolute object-cover w-[60%] lg:w-[350px] lg:h-auto h-[60%] rounded-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl border-[4px] lg:border-[8px] border-white z-0 transition-all duration-500 hover:scale-105 hover:z-20"
          sizes="(min-width: 1024px) 350px, 60vw"
        />

        <Image
          src="https://media.centraliatours.com/aboutus/about5.jpg"
          alt="Centralia Travel Agency about us"
          width={240}
          height={300}
          className="absolute object-cover lg:w-60 w-28 rounded-3xl lg:bottom-5 bottom-5 lg:left-10 left-2 shadow-2xl border-[4px] lg:border-[6px] border-white transition-all duration-500 hover:scale-105 hover:z-20 -rotate-2"
          sizes="(min-width: 1024px) 240px, 112px"
        />
      </div>
    </div>
  );
};

export default AboutInfo;
