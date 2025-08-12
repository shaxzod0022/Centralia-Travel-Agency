"use client";
import { styles } from "@/styles/styles";
import React, { FC, useState } from "react";
import Btn from "../helpers/Btn";
import { useTranslations } from "next-intl";
import { Minus, Plus, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  tourId?: string;
  price?: number;
}

const Booking: FC<Props> = ({ tourId, price }) => {
  const t = useTranslations("TourPage");
  const [inc, setInc] = useState<number>(1);
  const myPrice = price || 500;
  const routing = useRouter();
  return (
    <div
      className={`lg:w-[34%] mb-5 w-full p-5 border border-gray-300 rounded-xl ${styles.flexCol} md:gap-5 gap-3`}
    >
      <p className={`${styles.p} font-semibold`}>{t("booking")}</p>
      <form method="post" className={`${styles.flexCol} gap-4`}>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("firstName")} <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
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
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
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
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
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
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
            type="text"
            name="phone"
          />
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("travelNumber")} <span className="text-red-500">*</span>
          </label>
          <div className={`${styles.flexCenter} gap-5`}>
            <button
              disabled={inc <= 1}
              onClick={() => setInc(inc - 1)}
              type="button"
              className={`${
                inc <= 1 ? "cursor-no-drop" : "cursor-pointer"
              } active:bg-red-300 bg-red-500 text-white p-1 rounded`}
            >
              <Minus />
            </button>
            <input
              className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F] text-center w-20"
              type="text"
              name="number"
              onChange={(e) => setInc(Number(e.target.value))}
              min={1}
              value={inc}
              required
            />
            <button
              onClick={() => setInc(inc + 1)}
              type="button"
              className={`cursor-pointer active:bg-[#b6f186] bg-[#6ebb2f] text-white p-1 rounded`}
            >
              <Plus />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="group"
              className="hidden peer"
            />
            <div className="p-4 border border-gray-300 rounded-lg peer-checked:border-[#6EBB2F] peer-checked:bg-green-50 text-center">
              <span className="text-2xl ">
                <Users className="w-full" />
              </span>
              <p className="font-semibold mt-2">{t("group")}</p>
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="individual"
              className="hidden peer"
            />
            <div className="p-4 border border-gray-300 rounded-lg peer-checked:border-[#6EBB2F] peer-checked:bg-green-50 text-center">
              <span className="text-2xl">
                <User className="w-full" />
              </span>
              <p className="font-semibold mt-2">{t("individual")}</p>
            </div>
          </label>
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("tourDate")}
            <span className="text-red-500">*</span>
          </label>
          <input
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
            type="date"
            name="date"
            required
          />
        </div>
        <div className={`${styles.flexBetween}`}>
          <p className={`${styles.p}`}>Price</p>
          <p className={`${styles.p} text-green-950 font-semibold`}>
            {myPrice * inc}$
          </p>
        </div>
        <div className={`${styles.flexCol} gap-1`}>
          <label htmlFor="firstName" className={`${styles.p}`}>
            {t("info")}
          </label>
          <textarea
            className="border-1 border-gray-300 rounded-xl text-lg p-3 focus:outline-none focus:border-[#6EBB2F]"
            name=""
            id=""
            rows={5}
            placeholder={t("infoPlaceholder")}
          ></textarea>
        </div>
        <Btn myClass="font-semibold" title={t("btn")} />
      </form>
      <div className={`${styles.flex} gap-2 w-full`}>
        <img
          className="rounded-full w-24 h-24"
          src={
            "https://thumbs.dreamstime.com/b/consulting-expert-advice-support-service-business-concept-98129276.jpg"
          }
          alt="Exprert"
        />
        <div>
          <p className="mb-2">Expert</p>
          <Btn
            onClick={() => routing.push("/meeting")}
            myClass="!w-full rounded-lg"
            title={t("call")}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;
