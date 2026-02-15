"use client";

import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Playfair } from "next/font/google";
import { MoveRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Destinations } from "@/interfaces/destination.interface";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Mousewheel,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

interface DestinationProps {
  data: Destinations[];
}

const Destination = ({ data = [] }: DestinationProps) => {
  const t = useTranslations("destination");

  if (data.length === 0) return null;

  return (
    <section className="relative max-w-[1980px] mx-auto w-full flex flex-col items-center justify-center overflow-hidden py-10 destination-swiper">
      <div className="w-full z-10 mb-10">
        <h2 className={`${styles.h2} text-center text-[#056D50] mb-1`}>
          {t("title")}
        </h2>
        <p
          className={`text-center !text-[#056D50]/80 ${styles.h3} ${playfair.className}`}
        >
          {t("desc")}
        </p>
      </div>

      <div className="w-full relative">
        <Swiper
          modules={[
            EffectCoverflow,
            Pagination,
            Autoplay,
            Mousewheel,
          ]}
          effect="coverflow"
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          spaceBetween={0}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          mousewheel={{ forceToAxis: true }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          slidesPerView={1.6} // default (mobile)
          breakpoints={{
            640: {
              slidesPerView: 3.5, // tablet
            },
            1024: {
              slidesPerView: 5, // desktop ✅
            }
          }}
          className="swiper_container !pb-14"
        >
          {data.map((item) => (
            <SwiperSlide
              key={item.id}
              // BU YERDA KENGLIKNI ANIQ BERING
              // BU YERDA KENGLIKNI ANIQ BERING
              className="relative rounded-xl overflow-hidden shadow-xl aspect-[3/4] h-auto"
            >
              <div
                className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0f2027] via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white z-20">
                <h3 className="font-bold text-lg md:text-[1.4rem] leading-[1.2] mb-2 md:mb-3">
                  {item.name}
                </h3>
                <Link
                  href={`/tours?destination=${item.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2 border border-white/60 rounded-full text-xs md:text-sm hover:bg-white hover:text-[#056D50] transition-all duration-300"
                >
                  {t("more")}
                  <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Destination;
