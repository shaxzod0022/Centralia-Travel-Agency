"use client";
import { styles } from "@/styles/styles";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useRef, useMemo, useCallback } from "react";
import Btn from "../helpers/Btn";
import { ArrowRight, ChevronLeft, ChevronRight, AlertCircle, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { BlogProps } from "@/interfaces/insights.interface";
import { TranslationsProps } from "@/interfaces/helper.interface";

interface Props {
  data: BlogProps[];
}

const TravelInsights: FC<Props> = ({ data }) => {
  const router = useRouter();
  const t = useTranslations("HomePage.travelInsights");
  const lang = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Memoize filtered blogs to avoid unnecessary re-renders
  const filteredBlogs = useMemo(() => {
    return data.filter(blog => blog && blog.slug && blog.title);
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

  // Handle blog click with error handling
  const handleBlogClick = useCallback((slug: string) => {
    if (slug) {
      console.log('Frontend: Navigating to blog:', slug);
      router.push(`/blog/${slug}`);
    }
  }, [router]);

  // If no blogs data, show empty state
  if (!filteredBlogs || filteredBlogs.length === 0) {
    return (
      <div className="w-full max-w-[1800px] mx-auto p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Blog Posts Available
          </h3>
          <p className="text-gray-500">
            Blog posts are not available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1800px] mx-auto">
      {/* Left Button - Only show if there are multiple blogs */}
      {filteredBlogs.length > 1 && (
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
        {filteredBlogs.map((item, idx) => (
          <div
            data-card
            key={item._id || idx}
            className="relative flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group snap-center overflow-hidden"
            role="button"
            tabIndex={0}
            onClick={() => handleBlogClick(item.slug)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBlogClick(item.slug);
              }
            }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={`${process.env.NEXT_PUBLIC_API_URL || 'https://centralia-travel-agency-back.onrender.com'}${item.coverImage}`}
                alt={item.title[lang as keyof TranslationsProps]}
                loading="lazy"
              />
              
              {/* Category Badge */}
              {item.category && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-gray-800 capitalize">
                    {item.category[lang as keyof TranslationsProps]}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h3
                style={{ fontFamily: "Playfair Display" }}
                className="text-xl font-bold mb-3 text-[#1B4332] line-clamp-2 leading-tight"
              >
                {item.title[lang as keyof TranslationsProps]}
              </h3>

              {/* Summary */}
              <p className="text-[#6C757D] text-sm mb-4 line-clamp-2 leading-relaxed">
                {item.summary[lang as keyof TranslationsProps]}
              </p>

              {/* Author & Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#6C757D]">
                  <User size={14} />
                  <span className="text-sm">
                    {item.author?.name || 'Unknown Author'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[#6C757D]">
                  <Calendar size={14} />
                  <span className="text-sm">
                    {new Date(item.publishedAt).toLocaleDateString(lang, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Read More Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-300">
                  <span className="text-sm font-medium">{t("cardBtn")}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Right Button - Only show if there are multiple blogs */}
      {filteredBlogs.length > 1 && (
        <button
          onClick={() => scrollByCard("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-20 bg-white/90 backdrop-blur-sm shadow-lg p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      )}

      {/* View All Button */}
      <div className="text-center flex justify-center mt-8">
        <Btn
          onClick={() => router.push('/blog')}
          myClass="bg-[#1B4332] hover:bg-[#2d6c52] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 hover:scale-105"
          title={t("btn")}
        />
      </div>

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

export default TravelInsights;
