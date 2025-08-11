import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import React from "react";
import { TravelersCommentProps } from "@/interfaces/comment.interface";
import { Quote, Star } from "lucide-react";
import Btn from "../helpers/Btn";

const TravelersComment = () => {
  const t = useTranslations("HomePage.travelersComment");
  const travelersComm = t.raw("items") as TravelersCommentProps[];
  return (
    <div className={`${styles.flexCol} !items-center`}>
      <div
        className={`w-full ${styles.flexBetween} max-w-[1800px] mx-auto gap-6 mb-10`}
      >
        {travelersComm.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.flexCol} shadow__comments justify-start bg-white p-8 w-full sm:w-[47%] xl:w-[31%] rounded-3xl transition-all duration-150`}
          >
            <div className={`${styles.flex} gap-4 mb-5`}>
              <img
                src={item.image}
                alt={item.fullName}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <p className={`${styles.p} font-bold leading-tight`}>
                  {item.fullName}
                </p>
                <span className={`${styles.span} uppercase`}>
                  {item.citizenship}
                </span>
                <div>
                  {[1, 2, 3, 4, 5].map((i) => {
                    return (
                      <Star
                        key={i}
                        className={`${
                          item.grade >= i ? "text-yellow-400" : "text-gray-400"
                        } w-5 h-5 inline-block`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <p className={`${styles.p} flex leading-snug mb-3`}>
              <Quote className="text-green-400 w-32" />
              <span className="text-gray-600">
                {item.comment.slice(0, 80)} . . .
              </span>
            </p>
            <p
              className={`${styles.p} text-green-600 leading-tight font-semibold`}
            >
              {item.tourTitle}
            </p>
            <span className={`${styles.span} text-gray-600`}>{item.date}</span>
          </div>
        ))}
      </div>
      {/* <Btn myClass="text-white font-semibold w-fit" title={"All"} /> */}
    </div>
  );
};

export default TravelersComment;
