"use client";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { TourProps } from "@/interfaces/signature.interface";
import { styles } from "@/styles/styles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useState } from "react";
import TourDetail from "./TourDetail";
import Booking from "./Booking";
import { getSingleImageUrl } from "@/utils/imageUtils";

interface Props {
  data?: TourProps;
}

const TourInfo: FC<Props> = ({ data }) => {
  const lang = useLocale();
  const t = useTranslations("TourPage");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Check if data exists and has required fields
  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
        <p className="text-gray-600">The requested tour could not be found or is not available.</p>
      </div>
    );
  }

  // Check if tour has an image
  const hasImage = data.image && data.image.trim() !== '';
  
  if (!hasImage) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Images Not Available</h2>
        <p className="text-gray-600">Tour images could not be loaded.</p>
      </div>
    );
  }

  // Create an array with the single image for the slider logic
  const tourImages = [data.image];

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? tourImages.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === tourImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="mb-5">
      <h4 className={`${styles.h4}`}>
        {data?.title?.[lang as keyof TranslationsProps] || "Tour Title"}
      </h4>
      <p className={`${styles.p} mb-2`}>
        {data?.tourDays} {t("day")}
      </p>
      
      {/* Image Gallery */}
      <div className="relative mb-5 md:p-20 p-4 bg-green-950 rounded-2xl inset-0 flex items-center justify-center">
        {tourImages.length > 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-5 text-white hover:text-gray-300 transition cursor-pointer z-10"
          >
            <ChevronLeft size={48} />
          </button>
        )}
        
        <img
          src={getSingleImageUrl(tourImages[currentIndex])}
          alt={`${data?.title?.[lang as keyof TranslationsProps] || 'Tour'} - Image ${currentIndex + 1}`}
          className="w-full md:h-80 sm:h-60 h-44 rounded-xl object-cover"
        />
        
        {tourImages.length > 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-5 text-white hover:text-gray-300 transition cursor-pointer z-10"
          >
            <ChevronRight size={48} />
          </button>
        )}
        
        {/* Image Indicators */}
        {tourImages.length > 1 && (
          <div className="absolute bottom-5 flex gap-2">
            {tourImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-3 w-3 rounded-full transition cursor-pointer ${
                  idx === currentIndex ? "bg-white" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Tour Details and Booking */}
      <div
        className={`w-full ${styles.flexBetween} !flex-wrap-reverse !items-end`}
      >
        <TourDetail data={data} />
        <Booking 
          tourSlug={data?.slug || ''} 
          tourPrice={data?.price || 0} 
        />
      </div>
    </div>
  );
};

export default TourInfo;
