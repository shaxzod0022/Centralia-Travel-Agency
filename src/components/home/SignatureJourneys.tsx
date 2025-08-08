"use client";
import { SignatureProps } from "@/interfaces/signature.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import React from "react";
import Btn from "../helpers/Btn";
import { useRouter } from "next/navigation";

const SignatureJourneys = () => {
  const router = useRouter();
  const t = useTranslations("HomePage.signatureJourneys");
  const signatureJourneys = t.raw("items") as SignatureProps[];
  return (
    <div
      id="tours"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(https://images.theconversation.com/files/622347/original/file-20240930-18-ozn5tj.jpg?ixlib=rb-4.1.0&rect=0%2C271%2C4025%2C2009&q=45&auto=format&w=1356&h=668&fit=crop)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className={`${styles.paddingCont} ${styles.flexCol} scroll-mt-16 items-center`}
    >
      <p
        className={`${styles.p} max-w-[1800px] mx-auto text-center md:mb-5 mb-3 border-2 rounded-4xl w-fit px-7 text-[#1B4332] bg-[#F8F9FA] border-[#E9ECEF]`}
      >
        {t("item").toUpperCase()}
      </p>
      <h2
        style={{ fontFamily: "Plaffair Display" }}
        className={`text-center max-w-[1800px] mx-auto text-[#1B4332] md:mb-4 mb-2 ${styles.h2}`}
      >
        {t("title")}
      </h2>
      <p
        className={`${styles.p} max-w-[1800px] mx-auto text-[#6C757D] mb-7 lg:mb-12 text-center`}
      >
        {t("description")}
      </p>
      <div
        className={`w-full ${styles.flexBetween} max-w-[1800px] mx-auto gap-6 mb-10`}
      >
        {signatureJourneys.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.flexCol} shadow__signature bg-white justify-between w-full sm:w-[47%] xl:w-[31%] rounded-3xl`}
          >
            <div className="relative">
              <img
                className="w-full rounded-t-3xl h-56 object-cover"
                src={item.image}
                alt={item.title}
              />
              <span
                className={`bg-white ${styles.span} absolute top-8 right-8 capitalize w-fit rounded-4xl px-4 py-1 font-semibold`}
              >
                {item.tourDay} {t("dayItem")}
              </span>
              <span
                className={`bg-[#1B4332] text-white ${styles.span} absolute top-8 left-8 capitalize w-fit rounded-4xl px-4 py-1 font-semibold`}
              >
                {item.status}
              </span>
            </div>
            <div className="p-8">
              <h3
                style={{ fontFamily: "Plaffair Display" }}
                className={`${styles.h4} mb-2 text-[#1B4332]`}
              >
                {item.title}
              </h3>
              <p className={`${styles.p} text-[#6C757D] !leading-tight mb-4`}>
                {item.description.slice(0, 70)} . . .
              </p>
              <div className={`${styles.flexBetween} mb-5`}>
                <div className={`${styles.flex} gap-2 text-[#6C757D]`}>
                  <span>{t("difficultyTitle")}:</span>
                  {[1, 2, 3].map((i) => {
                    let color = "bg-gray-400";

                    if (item.difficulty === 1 && i === 1) {
                      color = "bg-green-500";
                    } else if (item.difficulty === 2 && i <= 2) {
                      color = "bg-yellow-400";
                    } else if (item.difficulty === 3) {
                      color = "bg-red-500";
                    }

                    return (
                      <span
                        key={i}
                        className={`${color} w-3 h-3 rounded-full inline-block mr-1`}
                      ></span>
                    );
                  })}
                </div>
                <span
                  className={`bg-gray-100 ${styles.span} text-[#1B4332] capitalize w-fit rounded-4xl px-4 py-2 font-semibold`}
                >
                  {item.countryNumber} {t("countryItem")}
                </span>
              </div>
              <div className={`${styles.flexBetween}`}>
                <div>
                  <p
                    className={`${styles.p} text-[#1B4332] font-semibold  !leading-tight`}
                  >
                    ${item.price}
                  </p>
                  <span className={`${styles.span} text-[#6C757D]`}>
                    {t("priceItem")}
                  </span>
                </div>
                <Btn
                  onClick={() => router.push(`/tour/${idx}`)}
                  myClass="text-white !bg-[#1B4332] active:!bg-[#2d6c52] w-32 leading-tight"
                  title={t("cardBtn")}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Btn myClass="text-white font-semibold" title={t("btn")} />
    </div>
  );
};

export default SignatureJourneys;
