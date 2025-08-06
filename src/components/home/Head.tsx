"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import React from "react";
import Btn from "../helpers/Btn";

const Head = () => {
  const t = useTranslations("HomePage.head");
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video background */}
      <video
        src="/head.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Text overlay */}

      <div className="relative flex flex-col justify-center items-center text-white bg-black/40 text-center z-10 h-full p-4 mx-auto">
        <h1
          style={{ fontFamily: "Playfair Display" }}
          className={`${styles.h1} mb-4 lg:w-[50%]`}
        >
          {t("title")}
        </h1>
        <p className={`${styles.p} mb-4 lg:w-[50%]`}>{t("description")}</p>
        <Btn title={t("btn")} />
      </div>
    </div>
  );
};

export default Head;
