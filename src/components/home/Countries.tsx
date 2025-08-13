"use client";
import { CountryProps } from "@/interfaces/country.interface";
import { styles } from "@/styles/styles";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { FC, useRef } from "react";
import { TranslationsProps } from "../../interfaces/helper.interface";

interface Props {
  data: CountryProps[];
}

const Countries: FC<Props> = ({ data }) => {
  const router = useRouter();
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

  return (
    <div className="relative w-full max-w-[1800px] mx-auto">
      {/* Left Button */}
      <button
        onClick={() => scrollByCard("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className={`w-full ${styles.flex} custom-scroll overflow-x-scroll p-5 no-scrollbar gap-5`}
      >
        {data.map((item, idx) => (
          <div
            data-card
            onClick={() => router.push(`/tours/${item.slug}`)}
            style={{
              backgroundImage: `url("https://centralia-travel-agency-back.onrender.com${item.heroImageUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            key={idx}
            className={`${styles.flexCol} flex-shrink-0 justify-between h-64 md:h-80 p-8 w-full sm:w-[50%] lg:w-[32%] 2xl:w-[24%] rounded-3xl transition-all duration-150 hover:scale-105 active:scale-100 cursor-pointer`}
          >
            <p
              className={`bg-green-900 ${styles.span} uppercase text-white w-fit rounded-4xl px-4 font-semibold`}
            >
              {item.status}
            </p>
            {/* Kontentni flex va gap bilan joylashtiramiz */}
            <div className="flex mt-5 flex-col justify-between h-full">
              <div>
                <h3
                  style={{ fontFamily: "Playfair Display" }}
                  className={`${styles.h4} text-white mb-2`}
                >
                  {item?.title[lang as keyof TranslationsProps]}
                </h3>
                <p
                  className={`${styles.p} text-white !leading-tight mb-2 line-clamp-3`}
                >
                  {item?.description[lang as keyof TranslationsProps]}
                </p>
              </div>
              <div className={`${styles.flexBetween} mt-auto`}>
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

      {/* Right Button */}
      <button
        onClick={() => scrollByCard("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Countries;
