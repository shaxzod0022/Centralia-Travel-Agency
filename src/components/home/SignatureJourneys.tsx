"use client";
import { styles } from "@/styles/styles";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useRef } from "react";
import Btn from "../helpers/Btn";
import { useRouter } from "next/navigation";
import { TourProps } from "@/interfaces/signature.interface";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  data: TourProps[];
}

const SignatureJourneys: FC<Props> = ({ data }) => {
  const router = useRouter();
  const t = useTranslations("HomePage.signatureJourneys");
  const lang = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector(
        "div[data-card]"
      ) as HTMLElement;
      if (card) {
        const cardWidth = card.offsetWidth + 20; // 20px = gap
        scrollRef.current.scrollBy({
          left: direction === "right" ? cardWidth : -cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  if (!data) return <>Loading...</>;

  return (
    <div className={`${styles.flexCol} !items-center`}>
      <div className="relative w-full max-w-[1800px] mx-auto">
        {/* Left Button */}
        <button
          onClick={() => scrollByCard("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white shadow p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className={`flex gap-5 mb-10 custom-scroll overflow-x-scroll p-3 scroll-smooth no-scrollbar`}
        >
          {data.map((item, idx) => (
            <div
              data-card
              key={idx}
              className={`${styles.flexCol} flex-shrink-0 shadow__signature bg-white justify-between w-full sm:w-[48%] xl:w-[32%] rounded-3xl`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  className="w-full rounded-t-3xl aspect-[16/9] object-cover"
                  src={item.images[0]}
                  alt={item.title[lang as keyof TranslationsProps]}
                />
                <span
                  className={`bg-white ${styles.span} absolute top-8 right-8 capitalize w-fit rounded-4xl px-4 py-1 font-semibold`}
                >
                  {item.tourDays} {t("dayItem")}
                </span>
              </div>

              {/* Content */}
              <div className="p-8 break-words">
                <h4
                  style={{ fontFamily: "Playfair Display" }}
                  className={`${styles.h4} mb-2 text-[#1B4332] w-full`}
                >
                  {item.title[lang as keyof TranslationsProps]}
                </h4>

                <p className={`${styles.p} text-[#6C757D] !leading-tight mb-4`}>
                  {item.description[lang as keyof TranslationsProps].slice(
                    0,
                    70
                  )}
                  . . .
                </p>

                {/* Difficulty & Country */}
                <div className={`${styles.flexBetween} mb-5`}>
                  <div className={`${styles.flex} gap-2 text-[#6C757D]`}>
                    <span>{t("difficultyTitle")}:</span>
                    {[1, 2, 3].map((i) => {
                      let color = "bg-gray-400";
                      if (item.difficulty === 1 && i === 1)
                        color = "bg-green-500";
                      else if (item.difficulty === 2 && i <= 2)
                        color = "bg-yellow-400";
                      else if (item.difficulty === 3) color = "bg-red-500";
                      return (
                        <span
                          key={i}
                          className={`${color} w-3 h-3 rounded-full inline-block mr-1`}
                        />
                      );
                    })}
                  </div>
                  <span
                    className={`bg-gray-100 ${styles.span} text-[#1B4332] capitalize w-fit rounded-4xl px-4 py-2 font-semibold`}
                  >
                    2 {t("countryItem")}
                  </span>
                </div>

                {/* Price & Button */}
                <div className={`${styles.flexBetween}`}>
                  <div>
                    <p
                      className={`${styles.p} text-[#1B4332] font-semibold !leading-tight`}
                    >
                      ${item.price}
                    </p>
                    <span className={`${styles.span} text-[#6C757D]`}>
                      {t("priceItem")}
                    </span>
                  </div>
                  <Btn
                    onClick={() => router.push(`/tour/${item.slug}`)}
                    myClass="text-white !bg-[#1B4332] active:!bg-[#2d6c52] leading-tight"
                    title={t("cardBtn")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scrollByCard("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white shadow p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default SignatureJourneys;
