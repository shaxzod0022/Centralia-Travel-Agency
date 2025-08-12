"use client";
import { styles } from "@/styles/styles";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const MeetiingHead = () => {
  const t = useTranslations("MeetingPage");
  return (
    <div>
      <div
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://huttohuthikingaustria.com/_next/image?url=https%3A%2F%2Fcdn.world-discovery.com%2F12261%2Fabout-us-hth-austria.jpeg&w=1920&q=75")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100%",
        }}
        className={`${styles.paddingCont} text-white`}
      >
        <h2 className={`${styles.h2} mx-auto max-w-[1800px]`}>{t("title")}</h2>
        <p className={`${styles.p} mx-auto max-w-[1800px]`}>
          {t("description")}
        </p>
      </div>
      <div className={`${styles.paddingCont} ${styles.flex} gap-2 w-fit !py-6`}>
        <Link
          href={"/"}
          className={`${styles.p} text-gray-500 mx-auto max-w-[1800px]`}
        >
          {t("home")}
        </Link>
        <ChevronRight />
        <p className={`${styles.p} mx-auto max-w-[1800px]`}>{t("title")}</p>
      </div>
    </div>
  );
};

export default MeetiingHead;
