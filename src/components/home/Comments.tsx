"use client";

import { useState, useEffect, useRef } from "react";

import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Playfair } from "next/font/google";
import Stars from "../helper/Star";
import { Link } from "@/i18n/routing";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

const realSlides = [
  {
    img: "",
    fullName: "Yoel – Israel",
    role: "Traveller",
    comment:
      "We had a great day with Numon our guide and the driver. The lakes are magnificent. Everything went as planed and on time. Numon was very friendly and welcoming. He made the long day very enjoyable and insightful sharing with us his vast knowledge about the sites and Tajikistan.",
    star: 5,
    date: "October 4, 2025 - Verified booking",
    link: "https://www.getyourguide.com/samarkand-l32506/tajikistan-seven-lakes-day-tripfrom-samarkand-t854629/?ranking_uuid=975c1ee5-bcc9-41e7-ab22-e2e78ee57edc",
  },
  {
    img: "/getyourguide.png",
    fullName: "GetYourGuide traveler – Uzbekistan",
    role: "Traveller",
    comment:
      "The Bukhara walking tour was truly unforgettable. The guide was friendly, professional, and passionate about the city’s heritage. I learned so much about the ancient trade routes, madrasas, mosques, and unique architecture that makes Bukhara so magical.",
    star: 5,
    date: "November 23, 2025 - Verified booking",
    link: "https://www.getyourguide.com/panjakent-tajikistan-l190008/panjakent-walking-tour-food-tasting-in-local-bazaar-t1119329/?ranking_uuid=975c1ee5-bcc9-41e7-ab22-e2e78ee57edc",
  },
  {
    img: "",
    fullName: "Ummi Haslinda Mohd – Malaysia",
    role: "Traveller",
    comment:
      "The trip was superb! The views and lakes here are stunning, I just can't get over it! Our guide, Vohidjon was great all the way. He was very informative, helpful and tentative. Expect the roads to be bumpy, but take it as nature's massage.",
    star: 5,
    date: "October 31, 2025 - Verified booking",
    link: "https://www.getyourguide.com/samarkand-l32506/tajikistan-seven-lakes-day-tripfrom-samarkand-t854629/?ranking_uuid=975c1ee5-bcc9-41e7-ab22-e2e78ee57edc",
  },
  {
    img: "",
    fullName: "Arvind – Belgium",
    role: "Traveller",
    comment:
      "Hamza was a great guide! It was so amazing walking around Bukhara with him. He is very knowledgable, explained the history in a very interesting and passionate way. I had a great afternoon and can highly recommend.",
    star: 5,
    date: "December 28, 2025 - Verified booking",
    link: "https://www.getyourguide.ru/panjakent-tajikistan-l190008/panjakent-walking-tour-food-tasting-in-local-bazaar-t1119329/?ranking_uuid=975c1ee5-bcc9-41e7-ab22-e2e78ee57edc&visitor-id=ZD4EUFWD59GBXIAJWAVP819AXFLPYY84&locale_autoredirect_optout=true",
  },
  {
    img: "",
    fullName: "Patric – Canada",
    role: "Traveller",
    comment:
      "The trip was amazing. The driver and guide were perfect. Thank you for all! If you like nature this is must go location!",
    star: 5,
    date: "December 14, 2025 - Verified booking",
    link: "https://www.getyourguide.com/samarkand-l32506/samarkand-zomin-national-park-day-trip-with-guide-t1097245/?ranking_uuid=975c1ee5-bcc9-41e7-ab22-e2e78ee57edc",
  },
  {
    img: "/getyourguide.png",
    fullName: "GetYourGuide traveler – Uzbekistan",
    role: "Traveller",
    comment:
      "Absolutely amazing trip from Samarkand. My tour guide was Asror and he was very helpful, polite and knowledgeable. We walked on the glass bridge and experienced with cable car. It was great day. Thank you for my guide and company. I really recommend this company.",
    star: 5,
    date: "December 15, 2025 - Verified booking",
    link: "https://www.getyourguide.com/samarkand-l32506/samarkand-zomin-national-park-day-trip-with-guide-t1097245/?ranking_uuid=975c1ee5-bcc9-41e7-ab22-e2e78ee57edc",
  },
];

const Comments = () => {
  const t = useTranslations("comments");

  // Slider states and refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Slides per view and pagination
  const [slidesPerView, setSlidesPerView] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(0);

  // Calculate slides per view based on screen width
  const getSlidesPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  // Update slides per view on resize
  useEffect(() => {
    const updateSlides = () => {
      const spv = getSlidesPerView();
      setSlidesPerView(spv);

      // Update active page based on scroll position
      const container = containerRef.current;
      if (container) {
        const cardWidth = Math.max(1, container.clientWidth / spv);
        const page = Math.round(container.scrollLeft / cardWidth);
        const maxPage = Math.max(0, realSlides.length - spv);
        setActivePage(Math.min(page, maxPage));
      }
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  // Update active page on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = Math.max(1, container.clientWidth / slidesPerView);
      const page = Math.round(container.scrollLeft / cardWidth);
      const maxPage = Math.max(0, realSlides.length - slidesPerView);
      setActivePage(Math.min(Math.max(0, page), maxPage));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [slidesPerView]);

  // Go to specific page
  const goToPage = (page: number) => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = Math.max(1, container.clientWidth / slidesPerView);
    const left = page * cardWidth;
    container.scrollTo({ left, behavior: "smooth" });
    setActivePage(page);
  };

  // Drag functionality for desktop
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only enable custom dragging for mouse (preserve native touch scrolling)
    if (e.pointerType !== "mouse") return;

    setIsDragging(true);
    startXRef.current = e.clientX;
    if (containerRef.current) {
      scrollLeftRef.current = containerRef.current.scrollLeft;
    }
    try {
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    } catch { }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();
    const dx = e.clientX - startXRef.current;
    containerRef.current.scrollLeft = scrollLeftRef.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch { }
  };

  // Clean up pointer events
  useEffect(() => {
    const stopDragging = () => setIsDragging(false);

    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  // Deterministik ranglar ro'yxati
  const COLORS = [
    "#3B82F6", // blue
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#14B8A6", // teal
    "#F97316", // orange
    "#84CC16", // lime
    "#6366F1", // indigo
  ] as const;

  // Deterministik rang olish funksiyasi
  const getColorForName = (name: string): string => {
    // Ism asosida hash yaratish
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  };

  return (
    <div className="relative w-full">
      <div
        className={`max-w-[1980px] mx-auto xl:p-16 lg:p-14 md:p-12 p-6 sm:p-8 ${styles.flexCol} items-center w-full`}
      >
        <h2 className={`${styles.h2} text-center text-[#056D50] mb-1`}>
          {t("title")}
        </h2>
        <p
          className={`mb-10 text-center ${styles.h3} !text-[#056D50] ${playfair.className}`}
        >
          {t("desc")}
        </p>

        {/* SLIDER WRAPPER */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
        >
          <div className="flex items-stretch">
            {realSlides.map((item, index) => (
              <div
                key={index}
                className="relative snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 2xl:px-3 px-2"
              >
                <div className="w-full bg-[#E9F6F9] rounded-xl p-5 space-y-5 h-full flex flex-col">
                  <div className={`${styles.flexBetween} !items-start`}>
                    <div className={`${styles.flex} gap-2`}>
                      <div
                        style={{
                          backgroundColor: getColorForName(item.fullName),
                        }}
                        className={`${styles.flexCenter} ${styles.h2} text-white font-bold relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-gray-400`}
                      >
                        {item.img.length === 0 ? (
                          item.fullName.slice(0, 1)
                        ) : (
                          <img
                            src={item.img}
                            alt={item.fullName}
                            className="object-cover"
                            sizes="(max-width: 640px) 48px, 64px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`${styles.h3} !text-[#056D50] `}>
                          {item.fullName}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <Stars rating={item.star} />
                  <p className={`${styles.p} text-gray-700 line-clamp-3`}>
                    {item.comment}
                  </p>
                  <Link
                    href={item.link}
                    className={`${styles.p} !text-[#056D50] mt-auto`}
                    target="_blank"
                  >
                    {t("btn")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS INDICATOR (only on mobile/tablet) */}
        <div className="flex gap-2 mt-8">
          {Array.from({
            length: Math.max(1, realSlides.length - slidesPerView + 1),
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${activePage === idx
                  ? "bg-[#6EBB2D] border-[#6EBB2D]"
                  : "bg-transparent border-[#056D50]"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;
