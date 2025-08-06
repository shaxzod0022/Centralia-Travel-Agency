import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import React from "react";
import { TravelersCommentProps } from "@/interfaces/comment.interface";
import { Quote, Star } from "lucide-react";

const TravelersComment = () => {
  const t = useTranslations("HomePage.travelersComment");
  const travelersComm = t.raw("items") as TravelersCommentProps[];
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C4025%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`${styles.paddingCont} ${styles.flexCol} bg-white/10 items-center`}
    >
      <p
        className={`${styles.p} text-center md:mb-5 mb-3 border-2 rounded-4xl w-fit px-7 bg-[#F8F9FA] border-[#E9ECEF]`}
      >
        {t("item").toUpperCase()}
      </p>
      <h2
        style={{ fontFamily: "Plaffair Display" }}
        className={`text-center text-green-950 md:mb-4 mb-2 ${styles.h2}`}
      >
        {t("title")}
      </h2>
      <p className={`${styles.p} text-gray-500 mb-7 lg:mb-12 text-center`}>
        {t("description")}
      </p>
      <div className={`w-full ${styles.flexBetween} gap-6 mb-10`}>
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
            <p className={`${styles.p} text-green-600 leading-tight font-semibold`}>
              {item.tourTitle}
            </p>
            <span className={`${styles.span} text-gray-600`}>{item.date}</span>
          </div>
        ))}
      </div>
      {/* <Btn myClass="text-white font-semibold" title={t("btn")} /> */}
    </div>
  );
};

export default TravelersComment;
