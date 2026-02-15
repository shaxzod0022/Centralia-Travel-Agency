"use client";

import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const Help = () => {
  const t = useTranslations("helpService");

  return (
    <div className="relative w-full overflow-hidden h-fit md:h-[60vh] flex items-center justify-center">
      {/* Slider */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <div
          className={`absolute inset-0 bg-cover bg-center`}
          style={{
            backgroundImage: `linear-gradient(to right,#0D0D0C80,#0D0D0C80), url("/gallery/reklama2.jpg")`,
          }}
        ></div>
      </div>

      <div className="z-10 space-y-5 text-center p-5">
        <h2 className={`${styles.h2} !text-white`}>{t("title")}</h2>
        <p className={`${styles.p} text-center text-white`}>{t("desc")}</p>
        <Link
          href={"/contact"}
          className={`bg-[#6EBB2D] w-fit active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded`}
        >
          {t("btn")}
        </Link>
      </div>
    </div>
  );
};

export default Help;
