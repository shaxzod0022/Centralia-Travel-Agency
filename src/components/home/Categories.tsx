"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { useRouter } from "@/i18n/routing";
import { useDrag } from "@use-gesture/react";
import { Playfair } from "next/font/google";
import { Country } from "@/interfaces/country.interface";
import Image from "next/image";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

interface CategoriesProps {
  data: Country[];
}

const Categories = ({ data = [] }: CategoriesProps) => {
  const t = useTranslations("category");
  const router = useRouter();
  if (data.length === 0) {
    return null;
  }

  const extendedData = [...data, ...data, ...data];
  const centerIndex = data.length;
  const [currentIndex, setCurrentIndex] = useState(centerIndex);
  const [isTransition, setIsTransition] = useState<boolean>(true);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // AUTOPLAY
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((p) => p + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // INFINITE LOOP
  useEffect(() => {
    if (currentIndex === extendedData.length - data.length) {
      setTimeout(() => {
        setIsTransition(false);
        setCurrentIndex(centerIndex);
      }, 700);
      setTimeout(() => setIsTransition(true), 750);
    }
  }, [currentIndex]);

  // DRAG Qo‘shish — touch, trackpad va mouse hold bilan ishlaydi
  const [dragX, setDragX] = useState(0);

  const bind = useDrag(
    ({ movement: [mx], direction: [dx], last }) => {
      // mx — hozirgi x harakati (px); dx — yo'nalish
      setDragX(mx);

      if (last) {
        const threshold = 60; // minimal harakat uzunligi (px) to switch slide
        if (mx < -threshold || (dx < 0 && Math.abs(mx) > 10)) {
          setCurrentIndex((p) => p + 1);
        } else if (mx > threshold || (dx > 0 && Math.abs(mx) > 10)) {
          setCurrentIndex((p) => p - 1);
        }
        setDragX(0);
      }
    },
    { filterTaps: true, axis: "x" }
  );

  return (
    <div
      className="w-full bg-cover bg-center"
      style={{ backgroundImage: `url("/icons/categorybg.png")` }}
    >
      <div className="w-full flex flex-col items-center overflow-hidden max-w-[1980px] mx-auto py-6 sm:py-8 2xl:py-20">
        <h2 className={`${styles.h2} text-center text-[#056D50] mb-1`}>
          {t("title")}
        </h2>
        <p
          className={`mb-10 text-center ${styles.h3} !text-[#056D50] ${playfair.className}`}
        >
          {t("desc")}
        </p>

        {/* SLIDER */}
        <div
          {...bind()}
          className="relative w-full mx-auto h-[350px] flex justify-center items-center select-none"
        >
          {extendedData.map((item, i) => {
            const gap =
              screenWidth < 640
                ? 180
                : screenWidth < 768
                  ? 230
                  : screenWidth < 1024
                    ? 320
                    : screenWidth < 1536
                      ? 290
                      : screenWidth < 1800
                        ? 310
                        : 380;

            // show 3 cards on mobile (center +/-1), and 5 on other screens (center +/-2)
            const visibleRange = screenWidth < 640 ? 1 : 2;

            const diff = i - currentIndex;
            const isVisible = Math.abs(diff) <= visibleRange;

            return (
              <div
                key={i}
                className={`absolute cursor-pointer hover:scale-105`}
                style={{
                  transform: `
                    translateX(${diff * gap + dragX}px)
                    translateY(${Math.abs(diff) * 25}px)
                    rotate(${diff * 4}deg)
                  `,
                  transition: isTransition ? "all 0.7s ease" : "none",
                  zIndex: isVisible ? 10 - Math.abs(diff) : 0,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible
                    ? Math.abs(dragX) > 10
                      ? "none"
                      : "auto"
                    : "none",
                }}
                onClick={() => {
                  if (Math.abs(dragX) > 10) return;
                  router.push(`/tours?country=${item.id}`);
                }}
              >
                <div className="relative xl:w-60 xl:h-60 w-52 h-52 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 208px, (max-width: 1280px) 256px, 240px"
                  />
                </div>

                <h4 className={`${styles.h4} text-center mt-2 !text-[#056D50]`}>
                  {item.name}
                </h4>
                <p className={`${styles.span} text-center font-semibold`}>
                  {t("more")}
                </p>
              </div>
            );
          })}
        </div>

        {/* DOTS */}
        <div className="flex gap-3 mt-8">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(centerIndex + i)}
              className={`w-3 h-3 border-2 rounded-full transition-all duration-300 ${(currentIndex - centerIndex) % data.length === i
                ? "bg-[#6EBB2D] border-[#6EBB2D]"
                : "bg-transparent border-[#056D50]"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
