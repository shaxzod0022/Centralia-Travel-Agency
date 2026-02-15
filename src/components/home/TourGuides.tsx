"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Guides } from "@/interfaces/guides.interface";
import { Playfair } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});
interface TourGuidesProps {
  data: Guides[];
}

const TourGuides = ({ data = [] }: TourGuidesProps) => {
  const t = useTranslations("tourGuides");

  if (data.length === 0) {
    return null;
  }

  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const slidesToShow = 4; // 2xl

  const getSlidesPerView = () => {
    if (typeof window === "undefined") return slidesToShow;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1536) return 3;
    return 4;
  };

  // start with server-friendly default (avoid window during SSR) and update on mount
  const [perView, setPerView] = useState<number>(() => slidesToShow);

  useEffect(() => {
    const handleResize = () => setPerView(getSlidesPerView());
    // run once on mount to sync client with actual window size (avoids hydration mismatch)
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // maximum valid starting index (never negative)
  const maxIndex = Math.max(0, data.length - perView);

  const goToSlide = (index: number) => {
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    setCurrentIndex(index);
  };

  // TOUCH EVENTS
  const startX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const endX = e.changedTouches[0].clientX;
    if (startX.current - endX > 50) goToSlide(currentIndex + 1);
    if (endX - startX.current > 50) goToSlide(currentIndex - 1);
  };

  // AUTOPLAY
  useEffect(() => {
    const interval = setInterval(() => {
      const next = currentIndex + 1 > maxIndex ? 0 : currentIndex + 1;
      setCurrentIndex(next);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, maxIndex]);

  return (
    <div
      className="bg-cover bg-center w-full"
      style={{
        backgroundImage:
          "linear-gradient(to right,#e9f6f966,#e9f6f966), url('/categorybg.png')",
      }}
    >
      <div
        className={`${styles.paddingCont} ${styles.flexCol} items-center w-full`}
      >
        <h2 className={`${styles.h2} text-center text-[#056D50] mb-1`}>
          {t("title")}
        </h2>
        <p
          className={`mb-10 text-center ${styles.h2} !text-[#056D50] ${playfair.className}`}
        >
          {t("desc")}
        </p>

        {/* SLIDER WRAPPER */}
        <div
          className="relative w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* INNER SLIDER */}
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / perView}%)`,
            }}
          >
            {data.map((item, i) => (
              <div
                key={i}
                className="min-w-[100%] sm:min-w-[50%] lg:min-w-[33.33%] 2xl:min-w-[25%] 2xl:px-3 px-2"
              >
                <div className="relative">
                  {/* GAP TO HOLD THE IMAGE SPACE – FIXED & RESPONSIVE */}
                  <div className="w-full h-24 sm:h-20 md:h-24"></div>

                  {/* CARD */}
                  <div className="relative w-full bg-white rounded-xl border border-gray-300 p-4 pt-16 sm:pt-20 md:pt-24 lg:pt-24">
                    {/* IMAGE – ABSOLUTE, CENTERED, RESPONSIVE */}
                    <img
                      src={item.avatarUrl}
                      loading="lazy"
                      decoding="async"
                      alt={item.name}
                      className="
                absolute
                top-0 -translate-y-1/2
                left-1/2 -translate-x-1/2
                w-[35%] sm:w-[40%]
                aspect-square object-cover
                rounded-full border-4 border-white
                will-change-transform
              "
                    />

                    {/* INNER INFO BLOCK */}
                    <div className="bg-[#E9F6F9] rounded-xl p-5 mt-8 sm:mt-10">
                      <div className="mb-4">
                        <h4 className={`${styles.h4} text-center`}>
                          {item.name}
                        </h4>
                        <p className={`${styles.span} text-center`}>
                          {item.role.name}
                        </p>
                      </div>

                      <ul className={`${styles.flexCenter} flex-wrap gap-3`}>
                        <li>
                          <Link
                            target="_blank"
                            href={item.facebookUrl}
                            className={`${styles.flexCenter} transition hover:bg-[#6EBB2D] hover:text-white border border-[#6EBB2D] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                          >
                            <Facebook />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            href={item.twitterUrl}
                            className={`${styles.flexCenter} transition hover:bg-[#6EBB2D] hover:text-white border border-[#6EBB2D] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                          >
                            <Twitter />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            href={item.youtubeUrl}
                            className={`${styles.flexCenter} transition hover:bg-[#6EBB2D] hover:text-white border border-[#6EBB2D] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                          >
                            <Youtube />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            href={item.instagramUrl}
                            className={`${styles.flexCenter} transition hover:bg-[#6EBB2D] hover:text-white border border-[#6EBB2D] rounded-full w-10 h-10 text-[#6EBB2D] p-1`}
                          >
                            <Instagram />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS */}
        <div className="flex gap-3 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${idx === currentIndex
                  ? "bg-[#6EBB2D] border-[#6EBB2D]"
                  : "bg-transparent border-[#056D50]"
                }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourGuides;
