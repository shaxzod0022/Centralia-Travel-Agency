"use client";

import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Clock, MapPin, MoveRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Playfair } from "next/font/google";
import { Tour } from "@/interfaces/tour.interface";
import Image from "next/image";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});
interface TourProps {
  data: Tour[];
}

const PopularDestination = ({ data = [] }: TourProps) => {
  const t = useTranslations("popularDes");

  if (data.length === 0) {
    return null;
  }

  // Drag-to-scroll refs/states for mouse dragging (desktop)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const stop = () => setIsDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  const onPointerDown = (e: any) => {
    // only enable custom dragging for mouse (preserve native touch scrolling)
    if (e.pointerType !== "mouse") return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    if (containerRef.current)
      scrollLeftRef.current = containerRef.current.scrollLeft;
    try {
      e.target?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startXRef.current;
    containerRef.current.scrollLeft = scrollLeftRef.current - dx;
  };

  const onPointerUp = (e: any) => {
    setIsDragging(false);
    try {
      e.target?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

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
          className={`mb-10 text-center ${styles.h3} !text-[#056D50] ${playfair.className}`}
        >
          {t("desc")}
        </p>

        {/* SLIDER */}
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`scrollbar-hide relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          <div className="flex gap-5 py-5 items-stretch">
            {data.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  window.open(
                    `/tours/${item.slug}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                className="group snap-start cursor-pointer shrink-0 w-[70%] sm:w-[40%] lg:w-[27%] 2xl:w-[21%]"
              >
                {/* Asosiy o'zgarish: flex flex-col h-full */}
                <div className="w-full h-full bg-white rounded-xl border border-gray-200 flex flex-col">
                  {/* Rasm qismi - o'zgarish yo'q */}
                  <div className="relative w-full md:h-44 h-36 rounded-t-xl overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={item.name}
                      fill
                      className="group-hover:scale-110 transition-all duration-300 object-cover"
                      sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, (max-width: 1536px) 27vw, 21vw"
                    />
                  </div>

                  {/* Orta qism - grow bilan kengayishi */}
                  <div className="sm:px-4 p-3 space-y-1 !flex-grow">
                    <h3 className={`${styles.h4} line-clamp-2`}>{item.name}</h3>{" "}
                    {/* line-clamp qo'shildi */}
                    <div className={`${styles.flexStart} gap-1`}>
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className={`${styles.span}`}>
                        {item.countries.join(", ")}
                      </span>
                    </div>
                    <div className={`${styles.flexStart} gap-2`}>
                      <span className={`${styles.p}`}>{t("from")}</span>{" "}
                      <strong className={`${styles.p} font-semibold`}>
                        {item.minPrice}$
                      </strong>
                    </div>
                  </div>

                  {/* Pastki qism - avtomatik pastga joylashadi */}
                  <div
                    className={`${styles.flexBetween} gap-2 sm:px-4 p-3 mt-auto`}
                  >
                    <div
                      className={`${styles.flex} gap-1 text-[#056D50] text-sm md:text-md font-semibold`}
                    >
                      <Clock className="xl:w-4 xl:h-4" />
                      <span>
                        {item.durationDays}{" "}
                        {item.durationDays === 1 ? t("day") : t("days")} /{" "}
                        {item.durationNights}{" "}
                        {item.durationNights === 1 ? t("night") : t("nights")}
                      </span>
                    </div>
                    <button
                      className={`${styles.flexCenter} font-semibold gap-2 rounded-3xl px-4 py-1 text-[#056D50] border text-sm md:text-md border-gray-300 hover:bg-[#056D50] hover:text-white transition active:scale-95`}
                    >
                      <span>{t("btn")}</span>
                      <MoveRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularDestination;
