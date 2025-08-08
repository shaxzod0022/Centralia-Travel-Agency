import { TravelersCommentProps } from "@/interfaces/comment.interface";
import { styles } from "@/styles/styles";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const ActivityAndStories = () => {
  const t = useTranslations("HomePage.activityAndStories");
  const activites = t.raw("activites") as TravelersCommentProps[];
  const stories = t.raw("stories") as TravelersCommentProps[];
  return (
    <div className="bg-[#F8F9FA] ">
      <div
        className={`${styles.paddingCont} max-w-[2200px] mx-auto ${styles.flexBetween} !items-start gap-2`}
      >
        <div className={`w-full md:w-[47%]`}>
          <p
            className={`${styles.span} font-semibold text-center md:mb-5 mb-3 border-2 rounded-4xl w-fit px-6 py-1 text-green-600 bg-[#52C41A1A] border-[#52C41A1A]`}
          >
            {t("item1").toUpperCase()}
          </p>
          <h3
            style={{ fontFamily: "Plaffair Display" }}
            className={`${styles.h4} text-[#1B4332] mb-3`}
          >
            {t("title1")}
          </h3>
          <div className={`${styles.flexCol} w-full gap-5`}>
            {activites.map((item, idx) => (
              <div
                key={idx}
                className={`w-full shadow__insigths bg-white rounded-3xl p-6 ${styles.flexBetween}`}
              >
                <div className={`${styles.flex} gap-3`}>
                  <img
                    className={`w-16 h-16 object-cover rounded-full`}
                    src={item.image}
                    alt={item.fullName}
                  />
                  <div>
                    <p
                      className={`${styles.p} font-semibold leading-thi
                    `}
                    >
                      {item.fullName}
                    </p>
                    <span
                      className={`${styles.span} text-gray-500 font-semibold`}
                    >
                      {item.tourTitle}
                    </span>
                  </div>
                </div>
                <div className={`${styles.flexCol} items-end`}>
                  <span
                    className={`${styles.span} text-gray-500 font-semibold`}
                  >
                    {item.date}
                  </span>

                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`w-full md:w-[47%]`}>
          <p
            className={`${styles.span} font-semibold text-center md:mb-5 mb-3 border-2 rounded-4xl w-fit px-6 py-1 text-amber-700 bg-[#D4A5741A] border-[#D4A5741A]`}
          >
            {t("item2").toUpperCase()}
          </p>
          <h3
            style={{ fontFamily: "Plaffair Display" }}
            className={`${styles.h4} text-[#1B4332] mb-3`}
          >
            {t("title2")}
          </h3>
          <div className={`${styles.flexBetween} gap-4 mb-5`}>
            {stories.map((item, idx) => (
              <img
                className="md:w-[46%] w-full rounded-4xl"
                key={idx}
                src={item.image}
                alt={item.image}
              />
            ))}
          </div>
          <Link className="text-amber-700" href={"/"}>
            {t("btn")} <ArrowRight className="inline-block" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityAndStories;
