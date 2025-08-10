"use client";
import { styles } from "@/styles/styles";
import React, { FC } from "react";
import Btn from "../helpers/Btn";
import { useTranslations } from "next-intl";

interface Props {
  tourId?: string;
}

const Booking: FC<Props> = ({ tourId }) => {
  const t = useTranslations("TourPage");
  return (
    <div
      className={`lg:w-[34%] w-full p-5 border border-gray-300 rounded-xl ${styles.flexCol} md:gap-5 gap-3`}
    >
      <p className={`${styles.p} font-semibold`}>{t("booking")}</p>
      <form method="post" className={`${styles.flexCol} gap-4`}>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("firstName")} <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            type="text"
            name="firstName"
            required
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("lastName")} <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            type="text"
            name="firstName"
            required
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("email")} <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            type="email"
            name="firstName"
            required
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("phone")}
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            type="text"
            name="firstName"
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("travelNumber")} <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            type="text"
            name="firstName"
            required
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("tourDate")}
            <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            type="date"
            name="firstName"
            required
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("info")}
          </label>
          <textarea
            className="border-1 border-gray-300 rounded-xl text-lg p-2 focus:outline-none focus:border-[#6EBB2F]"
            name=""
            id=""
            rows={5}
            placeholder={t("infoPlaceholder")}
          ></textarea>
        </div>
        <Btn myClass="font-semibold" title={t("btn")} />
      </form>
    </div>
  );
};

export default Booking;
