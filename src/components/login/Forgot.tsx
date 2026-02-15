"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";

const Forgot = () => {
  const [load, setLoad] = useState<boolean>(false);
  const t = useTranslations("forgot");

  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <form
        className={`mx-auto space-y-3 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 2xl:w-1/3 bg-white shadow-sm sm:p-5 p-3 rounded-2xl`}
      >
        <h2 className="font-bold text-center sm:text-3xl text-2xl">
          {t("title")}
        </h2>
        <p className={`${styles.p} text-sm text-center text-gray-600 mb-4`}>
          {t("desc")}
        </p>

        {/* Email */}
        <div className="space-y-1">
          <input
            type="email"
            id="email"
            className="w-full p-3 outline-none border-gray-300 rounded-lg border-2 focus:border-[#6EBB2D]"
            placeholder={t("emailInput")}
          />
        </div>

        <button
          disabled={load}
          className="
            bg-[#6EBB2D] hover:bg-[#88d747]
            active:bg-[#6EBB2D] transition
            py-3 px-5 font-semibold text-white
            rounded-lg w-full
          "
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default Forgot;
