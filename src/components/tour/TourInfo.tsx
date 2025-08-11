"use client";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { TourProps } from "@/interfaces/signature.interface";
import { styles } from "@/styles/styles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useState } from "react";
import TourDetail from "./TourDetail";
import Booking from "./Booking";

interface Props {
  data?: TourProps;
}

const TourInfo: FC<Props> = ({ data }) => {
  const lang = useLocale();
  const t = useTranslations("TourPage");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? (data?.images ?? []).length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === (data?.images ?? []).length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="mb-5">
      <h4 className={`${styles.h4}`}>
        {data?.title?.[lang as keyof TranslationsProps] || ""}
      </h4>
      <p className={`${styles.p} mb-2`}>
        {data?.tourDays} {t("day")}
      </p>
      <div className="relative mb-5 md:p-20 p-4 bg-green-950 rounded-2xl inset-0 flex items-center justify-center">
        <button
          onClick={prevSlide}
          className="absolute left-5 text-white hover:text-gray-300 transition cursor-pointer"
        >
          <ChevronLeft size={48} />
        </button>
        <img
          src={data?.images[currentIndex]}
          alt={`slide-${currentIndex}`}
          className="w-full md:h-80 sm:h-60 h-44 rounded-xl object-cover"
        />
        <button
          onClick={nextSlide}
          className="absolute right-5 text-white hover:text-gray-300 transition cursor-pointer"
        >
          <ChevronRight size={48} />
        </button>
        <div className="absolute bottom-5 flex gap-2">
          {data?.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-3 w-3 rounded-full transition cursor-pointer ${
                idx === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
      <div
        className={`w-full ${styles.flexBetween} !flex-wrap-reverse !items-end`}
      >
        <TourDetail data={data} />
        <Booking price={data?.price} tourId={data?._id} />
      </div>
    </div>
  );
};

export default TourInfo;
