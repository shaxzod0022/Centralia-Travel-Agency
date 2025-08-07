import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import React from "react";
import Btn from "../helpers/Btn";
import { InsightsProps } from "@/interfaces/insights.interface";
import { ArrowRight } from "lucide-react";

const TravelInsights = () => {
  const t = useTranslations("HomePage.travelInsights");
  const signatureJourneys = t.raw("items") as InsightsProps[];
  return (
    <div
      className={`${styles.paddingCont} ${styles.flexCol} bg-[#F8F9FA] items-center`}
    >
      <p
        className={`${styles.p} max-w-[1800px] mx-auto text-center md:mb-5 mb-3 border-2 rounded-4xl w-fit px-7 bg-[#F8F9FA] border-[#E9ECEF]`}
      >
        {t("item").toUpperCase()}
      </p>
      <h2
        style={{ fontFamily: "Plaffair Display" }}
        className={`text-center text-green-950 max-w-[1800px] mx-auto md:mb-4 mb-2 ${styles.h2}`}
      >
        {t("title")}
      </h2>
      <p className={`${styles.p} text-gray-500 max-w-[1800px] mx-auto mb-7 lg:mb-12 text-center`}>
        {t("description")}
      </p>
      <div className={`w-full ${styles.flexBetween} max-w-[1800px] mx-auto gap-6 mb-10`}>
        {signatureJourneys.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.flexCol} shadow__insigths bg-white justify-between w-full sm:w-[47%] xl:w-[31%] rounded-3xl transition-all duration-150 hover:scale-105 active:scale-100 cursor-pointer`}
          >
            <img
              className="w-full rounded-t-3xl h-56 object-cover"
              src={item.image}
              alt={item.title}
            />
            <div className="p-8">
              <h3
                style={{ fontFamily: "Plaffair Display" }}
                className={`${styles.h4} mb-2 text-green-950`}
              >
                {item.title}
              </h3>
              <p className={`${styles.p} text-gray-500 !leading-tight mb-4`}>
                {item.description.slice(0, 70)} . . .
              </p>
              <div className={`${styles.flexBetween}`}>
                <span className={`${styles.span} text-gray-500`}>
                  {item.date}
                </span>
                <p
                  className={`${styles.p} ${styles.flex} font-semibold text-green-600`}
                >
                  <span>{t("cardBtn")}</span> <ArrowRight />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Btn myClass="text-white font-semibold" title={t("btn")} />
    </div>
  );
};

export default TravelInsights;
