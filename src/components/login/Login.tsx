"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Eye, EyeOff } from "lucide-react";

import { Link } from "@/i18n/routing";

const Login = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const t = useTranslations("login");

  return (
    <div className={`${styles.paddingCont} !pt-28`}>
      <div
        className={`mx-auto space-y-3 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 2xl:w-1/3 bg-white shadow-sm sm:p-5 p-3 rounded-2xl`}
      >
        <h2 className={`font-bold sm:text-3xl text-2xl`}>{t("title")}</h2>
        <div className="space-y-1">
          <label htmlFor="email" className={`${styles.p} block font-semibold`}>
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border-2 outline-none border-gray-300 rounded-lg  focus:border-[#6EBB2D]"
            placeholder={t("emailInput")}
          />
        </div>
        <div className="space-y-1 relative">
          <label
            htmlFor="password"
            className={`${styles.p} block font-semibold`}
          >
            {t("password")}
          </label>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            className="w-full p-3 border-2 outline-none border-gray-300 rounded-lg  focus:border-[#6EBB2D]"
            placeholder={t("passwordInput")}
          />
          <button
            className="absolute bottom-3 right-3 bg-white p-1 text-gray-400 z-10"
            onClick={() => setShowPass((i) => !i)}
          >
            {showPass ? <Eye /> : <EyeOff />}
          </button>
        </div>

        <Link
          href={"/forgot"}
          className={`${styles.span} w-fit mb-2 inline-block`}
        >
          {t("forgot")}
        </Link>
        <div>
          <button
            disabled={load}
            className={`bg-[#6EBB2D] active:bg-[#6EBB2D] hover:bg-[#88d747] transition py-2 px-5 font-semibold text-white rounded-lg w-full`}
          >
            {t("submit")}
          </button>
          <p className={`${styles.p} text-center`}>{t("or")}</p>
          <button
            className={`${styles.flexCenter} bg-white hover:bg-gray-400/20 active:bg-white transition font-semibold text-gray-500 p-2 w-full gap-2 rounded-full border border-gray-300`}
          >
            <img
              loading="lazy"
              decoding="async"
              src={"/icons/google.svg"}
              alt="Centralia Travel Agency Google Authorization"
              style={{ height: "auto" }}
            />
            <span>{t("google")}</span>
          </button>
        </div>
        <p className={`${styles.span} font-semibold text-center`}>
          {t("account")}
          <Link href={"/create-account"} className="ml-2 text-[#88d747]">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
