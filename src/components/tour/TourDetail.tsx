"use locale";
import { TranslationsProps } from "@/interfaces/helper.interface";
import { TourProps } from "@/interfaces/signature.interface";
import { styles } from "@/styles/styles";
import {
  CalendarDays,
  Circle,
  CircleQuestionMark,
  Dumbbell,
  MapPinPlus,
  MapPinX,
  Settings,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { FC, useState } from "react";
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
  return (
    <div className={`lg:w-[65%] w-full ${styles.flexCol} md:gap-5 gap-3`}>
      <p className={`${styles.p}`}>
        {data?.description[lang as keyof TranslationsProps]}
      </p>
      <div className={`${styles.flexStart} md:gap-10 gap-5`}>
        <div className={`${styles.flex} gap-2`}>
          <MapPinPlus />
          <div className={`${styles.flexCol}`}>
            <span className={`${styles.span} font-semibold`}>
              {t("startLocation")}
            </span>
            <span className={`${styles.span} font-semibold text-gray-600`}>
              {data?.startLocation[lang as keyof TranslationsProps]}
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
              {data?.endLocation[lang as keyof TranslationsProps]}
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
              {data?.season[lang as keyof TranslationsProps]}
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
                {data?.technicalLevelComment[lang as keyof TranslationsProps]}
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
              {data?.technicalLevel}/5
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
                {data?.fitnesLevelComment[lang as keyof TranslationsProps]}
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
              {data?.fitnesLevel}/5
            </span>
          </div>
        </div>
      </div>
      <h4 className={`${styles.h4}`}>{t("tourItinerary")}</h4>
      <div className={`${styles.flexCol} gap-3`}>
        {data?.travelItinerary.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.flex} sm:flex-row flex-col sm:items-center items-start gap-3`}
          >
            <img
              className="sm:w-52 sm:h-38 h-40 w-full object-cover rounded-xl"
              src={item.images[0]}
              alt={item.title[lang as keyof TranslationsProps]}
            />
            <div>
              <p className={`${styles.p} font-semibold`}>
                {item.title[lang as keyof TranslationsProps]}
              </p>
              <p className={`${styles.p}`}>
                {item.description[lang as keyof TranslationsProps]}
              </p>
            </div>
          </div>
        ))}
      </div>
      <h4 className={`${styles.h4}`}>{t("includedInPrice")}</h4>
      <div
        className={`${styles.flexCol} border rounded-xl border-gray-500 p-5`}
      >
        {data?.includedInPrice.map((item, idx) => (
          <p key={idx} className={`${styles.p} ${styles.flex} gap-2`}>
            <Circle size={14} />
            {item[lang as keyof TranslationsProps]}
          </p>
        ))}
      </div>
      <h4 className={`${styles.h4}`}>{t("whatToTake")}</h4>
      <div className={`${styles.flexCol}`}>
        {data?.whatToTake.map((item, idx) => (
          <p key={idx} className={`${styles.p} ${styles.flex} gap-2`}>
            <Circle size={14} />
            {item[lang as keyof TranslationsProps]}
          </p>
        ))}
      </div>
      <h4 className={`${styles.h4}`}>{t("moreInfo")}</h4>
      <p className={`${styles.p} leading-tight`}>
        {data?.moreInfo[lang as keyof TranslationsProps]}
      </p>
    </div>
  );
};

export default TourDetail;
