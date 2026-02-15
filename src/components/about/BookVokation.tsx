"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const Help = () => {
  const t = useTranslations("about");

  return (
    <div className={`${styles.paddingCont} !py-10`}>
      <div className="relative w-full overflow-hidden h-fit md:h-44 flex items-center justify-center">
        {/* Slider */}
        <div className="absolute inset-0 transition-all duration-700 ease-in-out">
          <div
            className={`absolute inset-0 bg-cover bg-center`}
            style={{
              backgroundImage: `linear-gradient(to right,#0D0D0C80,#0D0D0C80), url("/gallery/reklama1.jpg")`,
            }}
          ></div>
        </div>

        <div className={`${styles.flex} z-10 h-full w-full`}>
          <img
            loading="lazy"
            decoding="async"
            className="h-full w-52 md:block hidden"
            alt="Centralia Tracel Agency book vocation"
            src="/gallery/reklama3.jpg"
          />
          <div className={`p-5 w-full`}>
            <p className={`${styles.p} text-white`}>{t("descVocation")}</p>
            <div className="flex items-center flex-wrap justify-between gap-5">
              <h2 className={`${styles.h2} !text-white`}>
                {t("titleVocation")}
              </h2>
              <Link
                href={"/contact"}
                className={`bg-[#6EBB2D] w-fit active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded`}
              >
                {t("btn")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
