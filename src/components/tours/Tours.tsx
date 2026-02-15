"use client";
import { Tour } from "@/interfaces/tour.interface";
import Image from "next/image";
import { styles } from "@/styles/styles";
import { Clock4, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

interface ToursByCountryProps {
  newClass?: string;
  data: Tour[];
}

const Tours = ({ data = [], newClass }: ToursByCountryProps) => {
  const t = useTranslations("tours");

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.paddingCont} xl:!py-8 lg:!py-6 !py-4 ${newClass}`}
    >
      <div className={`${styles.flex} flex-wrap items-stretch`}>
        {data.map((item, i) => {
          return (
            <div
              key={i}
              className="w-full sm:w-1/2 lg:w-1/3 shrink-0 p-2 md:p-4"
            >
              {/* DESKTOP CARD (Hidden on mobile) */}
              <div
                className={`hidden md:flex shadow-xl rounded-xl h-full w-full ${styles.flexCol}`}
              >
                <div className="relative w-full md:h-44 h-36 lg:h-56 aspect-square rounded-t-xl overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.name}
                    fill
                    unoptimized
                    className="duration-300 object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div
                  className={`${styles.flexCol} flex-1 p-5 xl:space-y-5 space-y-3`}
                >
                  <div
                    className={`${styles.flexBetween} p-3 shadow-md rounded-xl`}
                  >
                    <div className={`${styles.flex} items-center gap-2`}>
                      <Clock4 className="text-[#6EBB2D] w-5" />
                      <span className={`${styles.p} font-semibold`}>
                        {item.durationDays}{" "}
                        {item.durationDays === 1 ? t("day") : t("days")} /{" "}
                        {item.durationNights}{" "}
                        {item.durationNights === 1 ? t("night") : t("nights")}
                      </span>
                    </div>
                    <div className={`${styles.flex} gap-2`}>
                      <Link href={"/contact"} className="w-7 h-7">
                        <Mail className="text-[#6EBB2D] w-full h-full" />
                      </Link>
                      <Link href={"/contact"} className="w-6 h-6">
                        <div className="relative w-6 h-6">
                          <Image
                            className="object-cover"
                            src="/icons/Symbol.svg"
                            alt="Centralia Travel Agency Location"
                            fill
                            unoptimized
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                  <>
                    <h4 className={`${styles.h4} mb-1 !font-bold`}>
                      {item.name}
                    </h4>
                    <span className={`${styles.span} ${styles.flex} gap-1`}>
                      <MapPin className="text-[#6EBB2D] w-5" />
                      <span className="line-clamp-1">
                        {item.countries.join(", ")}
                      </span>
                    </span>
                  </>
                  <p
                    className={`${styles.p} py-1 border-y border-gray-300 line-clamp-3`}
                  >
                    {item.shortDescription}
                  </p>
                  <div className={`${styles.flexBetween} mt-auto`}>
                    <div className={`${styles.flexCol}`}>
                      <span className={`${styles.span}`}>{t("from")}</span>
                      <span className={`${styles.h4} !font-extrabold`}>
                        $ {item.minPrice}
                      </span>
                    </div>

                    <Link
                      target="_blank"
                      href={"/tours/" + item.slug}
                      className={`bg-[#6EBB2D] w-full active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-4 font-bold text-white rounded-3xl md:rounded text-center md:w-fit`}
                    >
                      {t("detailBtn")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* MOBILE CARD (Visible only on mobile) */}
              <Link
                href={"/tours/" + item.slug}
                className="md:hidden flex bg-white rounded-xl shadow-lg overflow-hidden h-36 border border-gray-100 hover:shadow-xl transition-shadow active:scale-[0.98] transition-transform"
              >
                {/* Image Section (40%) */}
                <div className="relative w-[40%] h-full">
                  <Image
                    src={item.coverImage}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="40vw"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock4 size={10} />
                    <span>
                      {item.durationDays} {t("day").substring(0, 1)}
                    </span>
                  </div>
                </div>

                {/* Content Section (60%) */}
                <div className="w-[60%] p-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm leading-tight line-clamp-2 text-gray-800">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 line-clamp-1">
                      <MapPin size={12} className="text-[#6EBB2D]" />
                      <span className="line-clamp-1">
                        {item.countries.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {t("from")}
                      </span>
                      <span className="font-extrabold text-lg text-[#6EBB2D] leading-none">
                        ${item.minPrice}
                      </span>
                    </div>
                    <div className="bg-[#6EBB2D] text-white text-xs font-semibold px-3 py-2 rounded-lg pointer-events-none">
                      {t("detailBtn")}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tours;
