"use client";
import { CountryProps } from "@/interfaces/country.interface";
import { styles } from "@/styles/styles";
import { ArrowRight, ChevronLeft, ChevronRight, AlertCircle, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { FC, useRef, useMemo, useCallback } from "react";
import { TranslationsProps } from "../../interfaces/helper.interface";

interface Props {
  data: CountryProps[];
}

const Countries: FC<Props> = ({ data }) => {
  const router = useRouter();
  const lang = useLocale();
  const t = useTranslations('HomePage.countries');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Memoize filtered countries to avoid unnecessary re-renders
  const filteredCountries = useMemo(() => {
    return data.filter(country => country && country.slug && country.title);
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

  // Handle country click with error handling
  const handleCountryClick = useCallback((slug: string) => {
    if (slug) {
      router.push(`/tours/${slug}`);
    }
  }, [router]);

  // If no countries data, show empty state
  if (!filteredCountries || filteredCountries.length === 0) {
    return (
      <div className="w-full max-w-[1800px] mx-auto p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noCountriesTitle', { defaultValue: 'No Countries Available' })}
          </h3>
          <p className="text-gray-500">
            {t('noCountriesDescription', { defaultValue: 'Countries data is not available at the moment.' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1800px] mx-auto">
      {/* Left Button - Only show if there are multiple countries */}
      {filteredCountries.length > 1 && (
        <button
          onClick={() => scrollByCard("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-20 bg-white/90 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label={t('scrollLeft', { defaultValue: 'Scroll left' })}
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
        {filteredCountries.map((item, idx) => (
          <div
            data-card
            onClick={() => handleCountryClick(item.slug)}
            key={item._id || idx}
            className="relative flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden cursor-pointer group snap-center transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCountryClick(item.slug);
              }
            }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url("${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${item.heroImageUrl}")`,
              }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                item.status === 'available' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-orange-500 text-white'
              }`}>
                {item.status === 'available' ? t('available') : t('comingSoonStatus')}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              {/* Country Title */}
              <h3 className="text-2xl font-bold mb-2 font-serif">
                {item?.title?.[lang as keyof TranslationsProps] || t('defaultCountryName', { defaultValue: 'Country Name' })}
              </h3>
              
              {/* Country Description */}
              <p className="text-sm text-gray-200 mb-4 line-clamp-2 leading-relaxed">
                {item?.description?.[lang as keyof TranslationsProps] || t('defaultCountryDescription', { defaultValue: 'Country description not available' })}
              </p>
              
              {/* Bottom Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-green-400" />
                  <span className="text-sm text-gray-300">
                    {item.status === 'available' ? t('readyToExplore') : t('preparingAdventures')}
                  </span>
                </div>
                
                {/* Arrow Icon */}
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-colors duration-300">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Right Button - Only show if there are multiple countries */}
      {filteredCountries.length > 1 && (
        <button
          onClick={() => scrollByCard("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-20 bg-white/90 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label={t('scrollRight', { defaultValue: 'Scroll right' })}
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

export default Countries;
