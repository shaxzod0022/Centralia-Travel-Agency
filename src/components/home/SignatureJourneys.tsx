"use client";
import { styles } from "@/styles/styles";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useRef, useMemo, useCallback } from "react";
import Btn from "../helpers/Btn";
import { useRouter } from "next/navigation";
import { TourProps } from "@/interfaces/signature.interface";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { getFirstImageUrl } from "@/utils/imageUtils";

interface Props {
  data: TourProps[];
}

const SignatureJourneys: FC<Props> = ({ data }) => {
  const router = useRouter();
  const t = useTranslations("HomePage.signatureJourneys");
  const lang = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Memoize filtered tours to avoid unnecessary re-renders
  const filteredTours = useMemo(() => {
    return data.filter(tour => tour && tour.slug && tour.title);
  }, [data]);

  // Memoize scroll function to prevent unnecessary re-renders
  const scrollByCard = useCallback((direction: "left" | "right") => {
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
  }, []);

  // Handle tour click with error handling
  const handleTourClick = useCallback((slug: string) => {
    if (slug) {
      router.push(`/tour/${slug}`);
    }
  }, [router]);

  // If no tours data, show empty state
  if (!filteredTours || filteredTours.length === 0) {
    return (
      <div className="w-full max-w-[1800px] mx-auto p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Tours Available
          </h3>
          <p className="text-gray-500">
            Tours data is not available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1800px] mx-auto">
      {/* Left Button - Only show if there are multiple tours */}
      {filteredTours.length > 1 && (
        <button
          onClick={() => scrollByCard("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-20 bg-white/90 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="w-full flex overflow-x-auto scrollbar-hide gap-6 p-6 snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {filteredTours.map((item, idx) => (
          <div
            data-card
            key={item._id || idx}
            className="relative flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group snap-center overflow-hidden"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTourClick(item.slug);
              }
            }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${item.images[0]}`}
                alt={item.title[lang as keyof TranslationsProps]}
                loading="lazy"
              />
              
              {/* Tour Days Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-semibold text-gray-800">
                  {item.tourDays} {t("dayItem")}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h4
                style={{ fontFamily: "Playfair Display" }}
                className="text-xl font-bold mb-3 text-[#1B4332] line-clamp-2 leading-tight"
              >
                {item.title[lang as keyof TranslationsProps]}
              </h4>

              {/* Description */}
              <p className="text-[#6C757D] text-sm mb-4 line-clamp-2 leading-relaxed">
                {item.description[lang as keyof TranslationsProps]}
              </p>

              {/* Difficulty & Country */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-[#6C757D]">
                  <span className="text-sm">{t("difficultyTitle")}:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => {
                      let color = "bg-gray-400";
                      if (item.difficulty === 1 && level === 1) color = "bg-green-500";
                      else if (item.difficulty === 2 && level <= 2) color = "bg-yellow-500";
                      else if (item.difficulty === 3) color = "bg-red-500";
                      
                      return (
                        <span
                          key={level}
                          className={`${color} w-2 h-2 rounded-full transition-colors duration-300`}
                        />
                      );
                    })}
                  </div>
                </div>
                
                <span className="bg-gray-100 text-sm text-[#1B4332] capitalize px-3 py-1 rounded-full font-semibold">
                  {item.country[lang as keyof TranslationsProps]}
                </span>
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#1B4332]">
                    ${item.price.toLocaleString()}
                  </p>
                  <span className="text-sm text-[#6C757D]">
                    {t("priceItem")}
                  </span>
                </div>
                
                <Btn
                  onClick={() => handleTourClick(item.slug)}
                  myClass="bg-[#1B4332] hover:bg-[#2d6c52] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                  title={t("cardBtn")}
                />
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Right Button - Only show if there are multiple tours */}
      {filteredTours.length > 1 && (
        <button
          onClick={() => scrollByCard("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-20 bg-white/90 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SignatureJourneys;
