"use client";
import { CountryProps } from "@/interfaces/country.interface";
import { styles } from "@/styles/styles";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { TranslationsProps } from "../../interfaces/helper.interface";

interface Props {
  data: CountryProps[];
}

const Countries: FC<Props> = ({ data }) => {
  const router = useRouter();
  const lang = useLocale();
  return (
    <div
      className={`w-full ${styles.flexBetween} max-w-[1800px] mx-auto gap-6`}
    >
      {data.map((item, idx) => (
        <div
          onClick={() => router.push(`/tours/${item.slug}`)}
          style={{
            backgroundImage: `url("${item.heroImageUrl}")`,
            backgroundPosition: "contain",
          }}
          key={idx}
          className={`${styles.flexCol} justify-between h-64 md:h-80 p-8 w-full sm:w-[47%] lg:w-[31%] 2xl:w-[23%] rounded-3xl transition-all duration-150 hover:scale-105 active:scale-100 cursor-pointer`}
        >
          <p
            className={`bg-green-900 ${styles.span} uppercase text-white w-fit rounded-4xl px-4 font-semibold`}
          >
            {item.status}
          </p>
          <div>
            <h3
              style={{ fontFamily: "Plaffair Display" }}
              className={`${styles.h4} text-white mb-2`}
            >
              {item?.title[lang as keyof TranslationsProps]}
            </h3>
            <p className={`${styles.p} text-white !leading-tight mb-2`}>
              {item?.description[lang as keyof TranslationsProps]}
            </p>
            <div className={`${styles.flexBetween}`}>
              <div>
                <p
                  className={`${styles.p} text-green-500 font-semibold  !leading-tight`}
                >
                  {/* {item.tourNumber} */}
                </p>
                <span className={`${styles.span} text-white`}>
                  {item.status}
                </span>
              </div>
              <span
                style={{ backdropFilter: "blur(4px)" }}
                className="text-white p-3 rounded-full"
              >
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countries;
