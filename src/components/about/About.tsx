"use client";
import {
  AboutSocialLinksProps,
  AboutTeamsProps,
} from "@/interfaces/aboutTeam.interface";
import { styles } from "@/styles/styles";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Mail,
};

const About = () => {
  const t = useTranslations("AboutPage");
  const team = t.raw("team.items") as AboutTeamsProps[];
  const executiveTeam = t.raw("executiveTeam.items") as AboutTeamsProps[];
  const expertSocialLinks = t.raw(
    "expertSocialLinks"
  ) as AboutSocialLinksProps[];
  const [more, setMore] = useState<{ modal: boolean; id: string }>({
    modal: false,
    id: "",
  });

  return (
    <>
      <div className={`${styles.flex} gap-5 mb-5`}>
        <img
          className="rounded-full xl:w-44 w-20 h-20 xl:h-44 object-cover"
          src="https://media.istockphoto.com/id/997461858/photo/attractive-young-man-in-blue-t-shirt-pointing-up-with-his-finger-isolated-on-gray-background.jpg?s=612x612&w=0&k=20&c=70pkYuhz65EqNOB9qI5JSDXNbQUwGLxKTCgsSWoy4kM="
          alt="Travel"
        />
        <h2 className={`${styles.h3}`}>{t("title2")}</h2>
      </div>
      <p className={`${styles.p} mb-5`}>{t("description2")}</p>
      <h4 className={`${styles.h4} mb-5`}>{t("title3")}</h4>
      <p className={`${styles.p} mb-5`}>{t("description3")}</p>
      <img
        className="w-full mb-5"
        src="https://v.imgi.no/4nedkupb7h-MOODBOARD/2042"
        alt="travelsy"
      />
      <h4 className={`${styles.h4} mt-10 mb-5`}>{t("team.title")}</h4>
      <ul className={`${styles.flexBetween} !items-start gap-6 mb-5`}>
        {team.map((item, idx) => (
          <li
            className={`w-full md:w-[47%] xl:w-[30%] transition bg-white shadow__insigths rounded-xl`}
            key={idx}
          >
            <img
              className="w-full h-60 object-cover rounded-t-xl"
              src={item.image}
              alt={item.title}
            />
            <div className="p-8">
              <h4 className={`${styles.h4} mb-3`}>{item.title}</h4>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out mb-3 ${
                  more.modal && more.id === item.title
                    ? "max-h-[1000px]"
                    : "max-h-[100px]"
                }`}
              >
                <p className={`${styles.p}`}>{item.info}</p>
              </div>
              <button
                onClick={() =>
                  setMore({ ...more, id: item.title, modal: !more.modal })
                }
                className={`${styles.p} hover:text-green-600 text-green-950 transition cursor-pointer`}
              >
                {more.modal && item.title === more.id ? t("readL") : t("readM")}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h4 className={`${styles.h4} mt-10 mb-5`}>{t("executiveTeam.title")}</h4>
      <ul className={`${styles.flexBetween} !items-start gap-6 mb-10`}>
        {executiveTeam.map((item, idx) => (
          <li
            className={`w-full md:w-[47%] xl:w-[30%] transition bg-white shadow__insigths rounded-xl`}
            key={idx}
          >
            <img
              className="w-full h-60 object-cover rounded-t-xl"
              src={item.image}
              alt={item.title}
            />
            <div className="p-8">
              <h4 className={`${styles.h4} mb-3`}>{item.title}</h4>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out mb-3 ${
                  more.modal && more.id === item.title
                    ? "max-h-[1000px]"
                    : "max-h-[100px]"
                }`}
              >
                <p className={`${styles.p}`}>{item.info}</p>
              </div>
              <button
                onClick={() =>
                  setMore({ ...more, id: item.title, modal: !more.modal })
                }
                className={`${styles.p} hover:text-green-600 text-green-950 transition cursor-pointer`}
              >
                {more.modal && item.title === more.id ? t("readL") : t("readM")}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h4 className={`${styles.h4} mb-5`}>{t("expert")}</h4>
      <div className={`${styles.flex} gap-4`}>
        <img
          className="rounded-full xl:w-44 w-20 h-20 xl:h-44 object-cover"
          src="https://media.istockphoto.com/id/997461858/photo/attractive-young-man-in-blue-t-shirt-pointing-up-with-his-finger-isolated-on-gray-background.jpg?s=612x612&w=0&k=20&c=70pkYuhz65EqNOB9qI5JSDXNbQUwGLxKTCgsSWoy4kM="
          alt="Travel"
        />
        <ul className={`${styles.flexAround} gap-8`}>
          {expertSocialLinks.map((item, idx) => {
            const Icon = iconMap[item.icon];
            if (!Icon) return null;

            return (
              <li key={idx}>
                <Link
                  className={`${styles.flexCol} !items-center hover:text-green-600 transition`}
                  href={item.path}
                >
                  <Icon />
                  <span className={`${styles.span}`}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default About;
