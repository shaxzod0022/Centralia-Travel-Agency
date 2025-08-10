"use client";
import { styles } from "@/styles/styles";
import { useLocale, useTranslations } from "next-intl";
import React, { FC } from "react";
import Btn from "../helpers/Btn";
import { ArrowRight } from "lucide-react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { BlogProps } from "@/interfaces/insights.interface";
import { TranslationsProps } from "@/interfaces/helper.interface";

interface Props {
  data: BlogProps[];
}

const TravelInsights: FC<Props> = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("HomePage.travelInsights");
  const lang = useLocale();
  if (!data || data.length === 0) {
    return notFound();
  }
  return (
    <div className={`${styles.flexCol} items-center`}>
      <div
        className={`w-full ${styles.flexBetween} max-w-[1800px] mx-auto gap-6 mb-10`}
      >
        {data.map((item, idx) => (
          <div
            onClick={() => router.push(`/blog/${item.slug}`)}
            key={idx}
            className={`${styles.flexCol} shadow__insigths bg-white justify-between w-full sm:w-[47%] xl:w-[31%] rounded-3xl transition-all duration-150 hover:scale-105 active:scale-100 cursor-pointer`}
          >
            <img
              className="w-full rounded-t-3xl h-56 object-cover"
              src={item.coverImage}
              alt={item.title[lang as keyof TranslationsProps]}
            />
            <div className="p-8">
              <h3
                style={{ fontFamily: "Plaffair Display" }}
                className={`${styles.h4} mb-2 text-[#1B4332]`}
              >
                {item.title[lang as keyof TranslationsProps]}
              </h3>
              <p className={`${styles.p} text-[#6C757D] !leading-tight mb-4`}>
                {item.summary[lang as keyof TranslationsProps].slice(0, 70)} . .
                .
              </p>
              <div className={`${styles.flexBetween}`}>
                <span className={`${styles.span} text-[#6C757D]`}>
                  {item.publishedAt}
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
      <Btn
        onClick={() => router.push(`/blog`)}
        myClass={`${
          pathname.slice(4) === "blog" && "hidden"
        } text-white font-semibold`}
        title={t("btn")}
      />
    </div>
  );
};

export default TravelInsights;
