"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Playfair } from "next/font/google";

import { Link } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

const data = [
  { img: "/services/service1.jpg", title: "Slide 1" },
  { img: "/services/service2.jpg", title: "Slide 2" },
  { img: "/services/service3.jpg", title: "Slide 3" },
  { img: "/services/service4.jpg", title: "Slide 4" },
  { img: "/services/service5.jpg", title: "Slide 5" },
  { img: "/services/service6.jpg", title: "Slide 6" },
  { img: "/services/service7.jpg", title: "Slide 7" },
];

const ServiceInfo = () => {
  const t = useTranslations("services");
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // ⭐ SSR muammosini yechish
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // autoplay
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % data.length),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    // SSR paytida DOM o'lchamlarini hisoblamaymiz → HYDRATION ok
    return (
      <div className="w-full text-center py-20 opacity-0 pointer-events-none">
        Loading...
      </div>
    );
  }

  // ⭐ Client payti responsive card sizes
  const cardWidth =
    window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 180 : 220;

  const cardHeight =
    window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 240 : 300;

  return (
    <div className={`${styles.paddingCont} ${styles.flex} flex-wrap w-full`}>
      <div className={`${styles.flexCol} gap-5 w-full lg:w-1/2 p-4`}>
        <h2 className={`${styles.h2}`}>{t("title")}</h2>
        <p className={`text-3xl text-[#6EBB2D] ${playfair.className}`}>
          {t("shortDesc")}
        </p>
        <p className={`${styles.p}`}>{t("desc")}</p>
        {/* <Link
          href={"/services/one"}
          className={`bg-[#6EBB2D] w-fit active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded`}
        >
          {t("btn")}
        </Link> */}
      </div>
      <div className={`w-full lg:w-1/2`}>
        <div className="relative w-full overflow-hidden h-[250px] sm:h-[350px] md:h-[380px] lg:h-[400px] xl:h-[420px] 2xl:h-[450px]">
          <div
            className="relative w-full h-full flex justify-center items-center"
            ref={sliderRef}
          >
            {data.map((member, i) => {
              const total = data.length;
              let offset = i - currentIndex;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              // Scale markaziy card kattaroq
              const scale = offset === 0 ? 1 : 1 - Math.abs(offset) * 0.15;
              const zIndex = 10 - Math.abs(offset);
              const opacity = Math.abs(offset) > 2 ? 0 : 1;

              const translateX =
                window.innerWidth < 640
                  ? offset * 100
                  : window.innerWidth < 1024
                    ? offset * 140
                    : offset * 160;

              return (
                <div
                  key={i}
                  className="absolute h-fit cursor-pointer transition-all duration-700 flex flex-col items-center"
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  onClick={() => setCurrentIndex(i)}
                >
                  <div
                    className="rounded-xl overflow-hidden shadow-xl"
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                    }}
                  >
                    <img
                      src={member.img}
                      width={cardWidth}
                      height={cardHeight}
                      alt={member.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
