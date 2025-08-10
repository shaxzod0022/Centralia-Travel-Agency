import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import React, { FC } from "react";

interface Props {
  langKey: number;
}

const keyMap: Record<number, string> = {
  1: "HomePage.countries",
  2: "HomePage.signatureJourneys",
  3: "HomePage.travelersComment",
  4: "HomePage.travelInsights",
  5: "ToursPage",
  6: "BlogsPage",
  7: "",
  8: "",
};

const ComponentsHead: FC<Props> = ({ langKey }) => {
  const sectionKey = keyMap[langKey] || "ToursPage";
  const t = useTranslations(sectionKey);

  return (
    <div className={`${styles.flexCol} scroll-mt-16 items-center`}>
      <p
        className={`${styles.p} max-w-[1800px] mx-auto text-center md:mb-5 mb-3 border-2 rounded-4xl w-fit px-7 text-[#1B4332] bg-[#F8F9FA] border-[#E9ECEF]`}
      >
        {t("item").toUpperCase()}
      </p>
      <h2
        style={{ fontFamily: "Plaffair Display" }}
        className={`text-center max-w-[1800px] mx-auto text-[#1B4332] md:mb-4 mb-2 ${styles.h2}`}
      >
        {t("title")}
      </h2>
      <p
        className={`${styles.p} max-w-[1800px] mx-auto text-[#6C757D] mb-7 lg:mb-12 text-center`}
      >
        {t("description")}
      </p>
    </div>
  );
};

export default ComponentsHead;
