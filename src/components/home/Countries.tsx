"use client"
import { CountryProps } from "@/interfaces/country.interface";
import { styles } from "@/styles/styles";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

const Countries = () => {
  const router = useRouter();
  const t = useTranslations("HomePage.countries");
  const countries = t.raw("items") as CountryProps[];
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C4025%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`${styles.paddingCont} ${styles.flexCol} items-center`}
    >
      <p
        className={`${styles.p} text-center max-w-[1800px] mx-auto md:mb-5 mb-3 border-2 rounded-4xl w-fit px-7 bg-[#F8F9FA] border-[#E9ECEF]`}
      >
        {t("item").toUpperCase()}
      </p>
      <h2
        style={{ fontFamily: "Plaffair Display" }}
        className={`text-center text-[#1B4332] md:mb-4 mb-2 max-w-[1800px] mx-auto ${styles.h2}`}
      >
        {t("title")}
      </h2>
      <p
        className={`${styles.p} text-[#6C757D] mb-7 max-w-[1800px] mx-auto lg:mb-12 text-center`}
      >
        {t("description")}
      </p>
      <div
        className={`w-full ${styles.flexBetween} max-w-[1800px] mx-auto gap-6`}
      >
        {countries.map((item, idx) => (
          <div
            onClick={() => router.push(`/tours/${item.title}`)}
            style={{
              backgroundImage: `url("${item.image}")`,
              backgroundPosition: "contain",
            }}
            key={idx}
            className={`${styles.flexCol} justify-between h-64 md:h-80 p-8 w-full sm:w-[47%] lg:w-[31%] 2xl:w-[23%] rounded-3xl transition-all duration-150 hover:scale-105 active:scale-100 cursor-pointer`}
          >
            <p
              className={`bg-green-900 ${styles.span} uppercase text-white w-fit rounded-4xl px-4 font-semibold`}
            >
              {item.type}
            </p>
            <div>
              <h3
                style={{ fontFamily: "Plaffair Display" }}
                className={`${styles.h4} text-white mb-2`}
              >
                {item.title}
              </h3>
              <p className={`${styles.p} text-white !leading-tight mb-2`}>
                {item.description}
              </p>
              <div className={`${styles.flexBetween}`}>
                <div>
                  <p
                    className={`${styles.p} text-green-500 font-semibold  !leading-tight`}
                  >
                    {item.tourNumber}
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
    </div>
  );
};

export default Countries;
