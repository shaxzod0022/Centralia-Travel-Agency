"use client";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { TourProps } from "@/interfaces/signature.interface";
import { styles } from "@/styles/styles";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  CircleQuestionMark,
  Dot,
  Dumbbell,
  MapPinPlus,
  MapPinX,
  Settings,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useState } from "react";
import { getImageUrl } from "@/utils/imageUtils";

interface Props {
  data?: TourProps;
}

const TourDetail: FC<Props> = ({ data }) => {
  const lang = useLocale();
  const t = useTranslations("TourPage");
  const [show, setShow] = useState<{ bool: boolean; item: string }>({
    bool: false,
    item: "",
  });
  const [hid, setHid] = useState<{ bool: boolean; id: string }>({
    bool: false,
    id: "",
  });

  // Check if data exists and has required fields
  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Details Not Available</h2>
        <p className="text-gray-600">Tour information could not be loaded.</p>
      </div>
    );
  }

  // Helper function to safely check if array data exists and has elements
  const hasArrayData = (data: unknown): data is Array<unknown> => {
    return Array.isArray(data) && data.length > 0;
  };

  return (
    <div className={`lg:w-[65%] w-full ${styles.flexCol} md:gap-5 gap-3`}>
      <p className={`${styles.p}`}>
        {data?.description?.[lang as keyof TranslationsProps] || "Tour description not available"}
      </p>
      
      {/* Tour Information */}
      <div className={`${styles.flexStart} md:gap-10 gap-5`}>
        <div className={`${styles.flex} gap-2`}>
          <MapPinPlus />
          <div className={`${styles.flexCol}`}>
            <span className={`${styles.span} font-semibold`}>
              {t("startLocation")}
            </span>
            <span className={`${styles.span} font-semibold text-gray-600`}>
              {data?.startLocation?.[lang as keyof TranslationsProps] || "Not specified"}
            </span>
          </div>
        </div>
        <div className={`${styles.flex} gap-2`}>
          <MapPinX />
          <div className={`${styles.flexCol}`}>
            <span className={`${styles.span} font-semibold`}>
              {t("endLocation")}
            </span>
            <span className={`${styles.span} font-semibold text-gray-600`}>
              {data?.endLocation?.[lang as keyof TranslationsProps] || "Not specified"}
            </span>
          </div>
        </div>
        <div className={`${styles.flex} gap-2`}>
          <CalendarDays />
          <div className={`${styles.flexCol}`}>
            <span className={`${styles.span} font-semibold`}>
              {t("season")}
            </span>
            <span className={`${styles.span} font-semibold text-gray-600`}>
              {data?.season?.[lang as keyof TranslationsProps] || "Not specified"}
            </span>
          </div>
        </div>
        <div className={`${styles.flex} gap-2`}>
          <Settings />
          <div className={`${styles.flexCol}`}>
            <span
              className={`${styles.span} ${styles.flex} relative gap-3 font-semibold`}
            >
              <span
                className={`${styles.span} ${
                  show.bool && show.item === "technic" ? "block" : "hidden"
                } absolute bg-white z-5 border p-3 text-center w-60 rounded-xl top-7 translate-0`}
              >
                {data?.technicalLevelComment?.[lang as keyof TranslationsProps] || "Technical level information not available"}
              </span>
              <span>{t("technicalLevel")}</span>
              <CircleQuestionMark
                onMouseOver={() =>
                  setShow({ ...show, bool: true, item: "technic" })
                }
                onMouseOut={() => setShow({ ...show, bool: false, item: "" })}
                size={16}
                className="cursor-pointer"
              />
            </span>
            <span className={`${styles.span} font-semibold text-gray-600`}>
              {data?.technicalLevel || 0}/5
            </span>
          </div>
        </div>
        <div className={`${styles.flex} gap-2`}>
          <Dumbbell />
          <div className={`${styles.flexCol}`}>
            <span
              className={`${styles.span} ${styles.flex} relative gap-3 font-semibold`}
            >
              <span
                className={`${styles.span} ${
                  show.bool && show.item === "sport" ? "block" : "hidden"
                } absolute bg-white z-5 border p-3 text-center w-60 rounded-xl top-7 translate-0`}
              >
                {data?.fitnesLevelComment?.[lang as keyof TranslationsProps] || "Fitness level information not available"}
              </span>
              <span>{t("fitnesLevel")}</span>
              <CircleQuestionMark
                onMouseOver={() =>
                  setShow({ ...show, bool: true, item: "sport" })
                }
                onMouseOut={() => setShow({ ...show, bool: false, item: "" })}
                size={16}
                className="cursor-pointer"
              />
            </span>
            <span className={`${styles.span} font-semibold text-gray-600`}>
              {data?.fitnesLevel || 0}/5
            </span>
          </div>
        </div>
      </div>
      
      {/* Tour Itinerary */}
      <h4 className={`${styles.h4}`}>{t("tourItinerary")}</h4>
      {hasArrayData(data?.travelItinerary) ? (
        <div className={`${styles.flexCol} gap-3`}>
          {data.travelItinerary.map((item, idx) => (
            <div
              key={idx}
              className={`cursor-pointer relative border border-gray-400 rounded-xl sm:flex-row flex-col sm:items-center items-start`}
            >
              <div
                onClick={() =>
                  setHid({
                    ...hid,
                    bool: !hid.bool,
                    id: item.title[lang as keyof TranslationsProps],
                  })
                }
                className={`overflow-hidden transition-all rounded-xl border-l-8 border-l-green-500 px-5 duration-300 ease-in-out ${
                  hid.bool &&
                  hid.id === item.title[lang as keyof TranslationsProps]
                    ? "max-h-[1000px] py-5"
                    : "max-h-0"
                }`}
              >
                <p
                  className={`${styles.p} ${styles.flexBetween} w-full font-semibold`}
                >
                  <span className="capitalize">
                    {t("day")} {idx + 1}:{" "}
                    {item.title[lang as keyof TranslationsProps]}
                  </span>
                  <ChevronRight
                    className={`${
                      hid.bool &&
                      item.title[lang as keyof TranslationsProps] === hid.id &&
                      "rotate-90"
                    } transition-all duration-300`}
                  />
                </p>
                <p className={`${styles.p} mb-5`}>
                  {item.description[lang as keyof TranslationsProps]}
                </p>
                {hasArrayData(item.images) && (
                  <div className={`${styles.flex} flex-wrap gap-2`}>
                    {item.images.map((image, x) => (
                      <img
                        src={getImageUrl(image)}
                        key={x}
                        alt={item.title[lang as keyof TranslationsProps]}
                        className="md:w-40 w-[47%] rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div
                onClick={() =>
                  setHid({
                    ...hid,
                    bool: !hid.bool,
                    id: item.title[lang as keyof TranslationsProps],
                  })
                }
                className={`${styles.flex} ${
                  hid.bool &&
                  hid.id === item.title[lang as keyof TranslationsProps] &&
                  "opacity-0 absolute pointer-events-none"
                } hover:bg-gray-100 rounded-xl gap-3 transition-all duration-200 ease-in-out`}
              >
                <img
                  className="sm:w-40 sm:h-28 h-24 w-40 object-cover rounded-xl"
                  src={getImageUrl(item.images?.[0])}
                  alt={item.title[lang as keyof TranslationsProps]}
                />
                <div
                  className={`${styles.flexBetween} gap-5 !flex-nowrap pr-5 w-full`}
                >
                  <p className={`${styles.p} font-semibold`}>
                    <span className="capitalize">
                      {t("day")} {idx + 1}:{" "}
                    </span>
                    {item.title[lang as keyof TranslationsProps]}
                  </p>

                  <ChevronRight
                    className={`${
                      hid.bool &&
                      item.title[lang as keyof TranslationsProps] === hid.id &&
                      "rotate-90"
                    } transition-all duration-300`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Tour itinerary not available</p>
        </div>
      )}
      
      {/* Included in Price */}
      <h4 className={`${styles.h4}`}>{t("includedInPrice")}</h4>
      {hasArrayData(data?.includedInPrice) ? (
        <div
          className={`${styles.flexCol} border w-fit rounded-xl border-gray-300 p-5`}
        >
          {data.includedInPrice.map((item, idx) => (
            <p key={idx} className={`${styles.p} ${styles.flex} gap-2`}>
              <Check className="text-[#6EBB2F]" size={20} />
              {item[lang as keyof TranslationsProps]}
            </p>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>Included services not available</p>
        </div>
      )}
      
      {/* What to Take */}
      <h4 className={`${styles.h4}`}>{t("whatToTake")}</h4>
      {hasArrayData(data?.whatToTake) ? (
        <div className={`${styles.flexBetween} w-full`}>
          {data.whatToTake.map((item, idx) => (
            <p
              key={idx}
              className={`${styles.p} ${styles.flex} w-full sm:w-1/2 gap-2`}
            >
              <Dot size={40} className="text-[#6EBB2F]" />
              {item[lang as keyof TranslationsProps]}
            </p>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>What to take information not available</p>
        </div>
      )}
      
      {/* More Info */}
      <h4 className={`${styles.h4}`}>{t("moreInfo")}</h4>
      <p className={`${styles.p} leading-tight`}>
        {data?.moreInfo?.[lang as keyof TranslationsProps] || "Additional information not available"}
      </p>
    </div>
  );
};

export default TourDetail;
