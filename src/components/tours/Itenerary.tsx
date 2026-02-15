"use client";
import { TourItineraryDay } from "@/interfaces/tourComplete.interface";
import { styles } from "@/styles/styles";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { memo, useState, type FC } from "react";
import GalleryGrid from "./GalleryGrid";

interface ItineraryProps {
  data: TourItineraryDay[];
}

const Itinerary = ({ data }: ItineraryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = useTranslations("tourDetails");
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Header */}

      <h2 className={`${styles.h2} mb-2`}>{t("itenerary")}</h2>
      <p className={`${styles.p} mb-6`}>{t("iteneraryDesc")}</p>

      {/* Timeline container */}
      <div className="w-full">
        {/* Timeline line */}
        <div className="hidden lg:block relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200"></div>
        </div>

        {/* Days list */}
        <div className="space-y-1">
          {data.map((item, idx) => {
            const open = activeIndex === idx;
            return (
              <div
                key={idx}
                className={`relative bg-white border-b-2 border-gray-300 overflow-hidden transition-all duration-300`}
              >
                {/* Day header */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(open ? null : idx)}
                  aria-expanded={open}
                  className={`w-full flex items-center justify-between p-6  ${
                    open && "border-b-2 border-gray-300"
                  }`}
                >
                  {/* Day info */}
                  <div className="text-left">
                    <h3 className={`${styles.h3} !text-base md:!text-xl`}>
                      {t("dayIndex")} {idx + 1}: {item.title}
                    </h3>
                  </div>

                  {/* Toggle icon */}
                  <div className="shrink-0">
                    <svg
                      className={`w-6 h-6 text-green-600 transform transition-transform duration-300 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 8l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expandable content */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    open ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                  aria-hidden={!open}
                >
                  <div className="p-6 space-y-3">
                    {/* Description */}

                    {item.description && (
                      <>
                        <h4 className={`${styles.h4}`}>{t("desc")}</h4>
                        <div className="prose max-w-none">
                          {item.description.split("\n").map((paragraph, i) => (
                            <p key={i} className={`${styles.p} mb-3`}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </>
                    )}

                    {item.whatToExpect && (
                      <>
                        <h4 className={`${styles.h4}`}>{t("exp")}</h4>
                        <div className="prose max-w-none">
                          {item.whatToExpect.split("\n").map((paragraph, i) => (
                            <p key={i} className={`${styles.p} mb-3`}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </>
                    )}
                    {item.meals && item.meals.length > 0 && (
                      <div>
                        <h4 className={`${styles.h4} mb-2`}>{t("meal")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.meals.map((meal, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-green-700 rounded-full text-sm font-medium bg-green-300/30"
                            >
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Distance */}
                      {item.distanceMin && (
                        <div>
                          <h4 className={`${styles.h4}`}>{t("distance")}</h4>
                          <p className={`${styles.p}`}>
                            {item.distanceMin} - {item.distanceMax} {t("km")}
                          </p>
                        </div>
                      )}

                      {/* Duration */}
                      {item.durationMin && (
                        <div>
                          <h4 className={`${styles.h4}`}>{t("duration")}</h4>
                          <p className={`${styles.p}`}>
                            {item.durationMin} - {item.durationMax} {t("hour")}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Transportation */}
                    {item.transportation && (
                      <div>
                        <h4 className={`${styles.h4}`}>
                          {t("transportation")}
                        </h4>
                        <p className={`${styles.p}`}>{item.transportation}</p>
                      </div>
                    )}

                    {/* Gallery */}
                    {item.dayGallery && item.dayGallery.length > 0 && (
                      <div>
                        <h4 className={`${styles.h4} mb-2`}>
                          {t("dayGallery")}
                        </h4>
                        <GalleryGrid
                          images={item.dayGallery}
                          title={`${item.title} - ${t("dayGallery")}`}
                        />
                      </div>
                    )}

                    {/* Accommodation */}
                    {item.accommodation && (
                      <div className="space-y-3">
                        {/* Hotel info */}

                        <div className="space-y-3">
                          <div>
                            <h4 className={`${styles.h4}`}>
                              {t("accomManager")}
                            </h4>
                            <p className={`${styles.p}`}>
                              {item.accommodation.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              {item.accommodation.starRating && (
                                <span className="text-yellow-500">
                                  {"★".repeat(item.accommodation.starRating)}
                                  {"☆".repeat(
                                    5 - item.accommodation.starRating,
                                  )}
                                </span>
                              )}
                              <span className={`${styles.span}`}>
                                {item.accommodation.starRating} {t("stars")}
                              </span>
                              <span className={`${styles.span}`}>
                                {item.accommodation.type}
                              </span>
                            </div>
                          </div>

                          <div className="">
                            <h4 className={`${styles.h4}`}>{t("address")}</h4>
                            {item.accommodation.address && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                <p className="text-gray-600">
                                  {item.accommodation.address}
                                </p>
                              </div>
                            )}
                            {item.accommodation.addressLink && (
                              <Link
                                href={item.accommodation.addressLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.p} inline-block text-green-600 hover:text-green-700`}
                              >
                                {t("view")}
                              </Link>
                            )}

                            <div className="flex items-center gap-4 mt-3">
                              <div>
                                <h4 className={`${styles.h4}`}>{t("in")}</h4>
                                <p className={`${styles.p}`}>
                                  {item.accommodation.checkInTime}
                                </p>
                              </div>
                              <div>
                                <h4 className={`${styles.h4}`}>{t("out")}</h4>
                                <p className={`${styles.p}`}>
                                  {item.accommodation.checkOutTime}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Rooms */}
                          {item.accommodation.rooms &&
                            item.accommodation.rooms.length > 0 && (
                              <div>
                                <h4 className={`${styles.h4} mb-2`}>
                                  {t("rooms")}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {item.accommodation.rooms.map((room, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm"
                                    >
                                      {room.name} ({room.capacity} {t("person")}
                                      )
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Hotel photos */}
                        {item.accommodation.photos &&
                          item.accommodation.photos.length > 0 && (
                            <div>
                              <h4 className={`${styles.h4} mb-2`}>
                                {t("accomPhotos")}
                              </h4>
                              <GalleryGrid
                                images={item.accommodation.photos}
                                title={`${item.accommodation.name} - ${t("accomPhotos")}`}
                              />
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(Itinerary);
