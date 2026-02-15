"use client";

import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Playfair } from "next/font/google";
import { MoveRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

const TripPlan = () => {
  const t = useTranslations("plan");

  return (
    <div
      className={`overflow-hidden relative max-w-[1980px] mx-auto gap-5 ${styles.flexBetween} items-stretch 2xl:px-52 xl:px-40 lg:px-32 md:px-20 sm:px-10 2xl:py-28 xl:py-20 lg:py-16 md:py-12 py-10 px-4`}
    >
      <div className={`w-full lg:w-[47%] ${styles.flexBetween}`}>
        <div className="w-[48%] h-full">
          <img
            src={"/plan/tim-broadbent-uj4TyuvM72w-unsplash.jpg"}
            alt="Centralia Travel Agency"
            className="object-cover w-full h-full rounded-t-full rounded-bl-full"
            width={200}
            height={300}
          />
        </div>
        <div className="w-[48%] h-full flex flex-col justify-between">
          <img
            src={"/plan/anatolii-shcherbyna-VrvtBRPUYlg-unsplash.jpg"}
            alt="Centralia Travel Agency"
            className="object-cover w-full h-[48%] rounded-t-full rounded-br-full"
            loading="lazy"
            decoding="async"
          />
          <img
            src={"/plan/mick-truyts-4dZnL_Da9gk-unsplash.jpg"}
            alt="Centralia Travel Agency"
            className="object-cover w-full h-[48%] rounded-b-full rounded-tl-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div className={`w-full lg:w-[47%] space-y-5`}>
        <div>
          <h2 className={`${styles.h2} text-[#056D50]`}>{t("title")}</h2>
          <p className={`${styles.h3} !text-[#056D50] ${playfair.className}`}>
            {t("desc")}
          </p>
        </div>
        <p className={`${styles.p} mb-4`}>{t("description")}</p>
        <div className={`${styles.flex} gap-2 items-start`}>
          <img
            src={"/icons/maps.svg"}
            alt="Centralia Travel Agency Map"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h4 className={`${styles.h4} text-[#056D50]`}>{t("trip")}</h4>
            <p className={`${styles.span}`}>{t("tripDesc")}</p>
          </div>
        </div>
        <div className={`${styles.flex} gap-2 items-start`}>
          <img
            src={"/icons/planMaps.svg"}
            alt="Centralia Travel Agency Map"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h4 className={`${styles.h4} text-[#056D50]`}>{t("guide")}</h4>
            <p className={`${styles.span}`}>{t("guideDesc")}</p>
          </div>
        </div>
        <div className={`${styles.flex} gap-2 items-start`}>
          <img
            src={"/icons/planMaps.svg"}
            alt="Centralia Travel Agency Map"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h4 className={`${styles.h4} text-[#056D50]`}>{t("item3")}</h4>
            <p className={`${styles.span}`}>{t("item3Desc")}</p>
          </div>
        </div>
        <Link
          href={"/contact"}
          className="w-fit mx-auto md:px-6 px-5 md:text-lg text-sm py-2 2xl:py-3 flex items-center gap-2 border-2 border-[#056D50] bg-[#056D50] rounded-4xl text-white hover:bg-white hover:text-[#056D50] transition active:scale-95"
        >
          <span>{t("more")}</span>
          <MoveRight />
        </Link>
      </div>
      <img
        loading="lazy"
        decoding="async"
        className="absolute right-0 bottom-0 -z-10 lg:w-44 md:w-34 w-24"
        src={"/icons/milliy.png"}
        alt="Centralia Travel Agency Tourist"
      />
    </div>
  );
};

export default TripPlan;
