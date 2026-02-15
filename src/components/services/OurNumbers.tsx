"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Playfair } from "next/font/google";
import { Link } from "@/i18n/routing";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

const ServiceInfo = () => {
  const t = useTranslations("ourNumbers");

  return (
    <div className={`${styles.paddingCont} ${styles.flex} flex-wrap w-full`}>
      <div className={`${styles.flexAround} w-full lg:w-1/2`}>
        <div className={`md:w-1/2 p-4`}>
          <div
            className={`${styles.flexCol} items-center text-center border border-gray-300 rounded-md p-5`}
          >
            <h2 className={`${styles.h2}`}>{t("num1")}</h2>
            <p className={`${styles.p}`}>{t("numDesc1")}</p>
          </div>
        </div>
        <div className={`md:w-1/2 p-4`}>
          <div
            className={`${styles.flexCol} items-center text-center border border-gray-300 rounded-md p-5`}
          >
            <h2 className={`${styles.h2}`}>{t("num2")}</h2>
            <p className={`${styles.p}`}>{t("numDesc2")}</p>
          </div>
        </div>
        <div className={`md:w-1/2 p-4`}>
          <div
            className={`${styles.flexCol} items-center text-center border border-gray-300 rounded-md p-5`}
          >
            <h2 className={`${styles.h2}`}>9/10</h2>
            <p className={`${styles.p}`}>{t("numDesc3")}</p>
          </div>
        </div>
      </div>
      <div className={`${styles.flexCol} gap-3 w-full lg:w-1/2 p-4`}>
        <p className={`text-3xl text-[#6EBB2D] ${playfair.className}`}>
          {t("shortDesc")}
        </p>
        <h2 className={`${styles.h2}`}>{t("title")}</h2>
        <p className={`${styles.p}`}>{t("desc")}</p>
        {/* <Link
          href={"/services/one"}
          className={`bg-[#6EBB2D] w-fit active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded`}
        >
          {t("btn")}
        </Link> */}
      </div>
    </div>
  );
};

export default ServiceInfo;
