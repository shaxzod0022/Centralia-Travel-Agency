"use client";


import { styles } from "@/styles/styles";
import { useLocale } from "next-intl";

interface StatistikaItem {
  item: string;
  title: {
    [key: string]: string;
  };
}

const data: StatistikaItem[] = [
  {
    item: "3",
    title: {
      en: "Years of experience",
      ru: "Опыт работы",
      de: "Jahre Erfahrung",
      ja: "経験年数",
      es: "Años de experiencia",
    },
  },
  {
    item: "95%",
    title: {
      en: "Traveler satisfaction",
      ru: "Удовлетворённость туристов",
      de: "Reisezufriedenheit",
      ja: "旅行者の満足度",
      es: "Satisfacción de los viajeros",
    },
  },
  {
    item: "986+",
    title: {
      en: "Adventures completed",
      ru: "Приключения завершены",
      de: "Abenteuer abgeschlossen",
      ja: "完了した冒険",
      es: "Aventuras completadas",
    },
  },
  {
    item: "9.431+",
    title: {
      en: "Happy Explorers",
      ru: "Путешественники",
      de: "Reisende",
      ja: "旅行者",
      es: "Viajeros",
    },
  },
];

const Statistika = () => {
  const lang = useLocale();
  return (
    <div
      className={`${styles.paddingCont} xl:!pt-28 lg:!pt-16 !pt-0 ${styles.flexBetween} lg:justify-between !justify-around relative items-center w-full`}
    >
      {data.map((i, x) => (
        <div
          key={x}
          className={`xl:w-[250px] xl:h-[250px] w-[170px] h-[170px] rounded-full border border-[#6EBB2D] p-5 relative mt-20 ${
            x % 2 !== 0 && "lg:-translate-y-1/2"
          }`}
        >
          <div className="absolute xl:top-5 top-7 xl:right-7 right-0 bg-[#6EBB2D33] w-6 h-6 rounded-full flex items-center justify-center p-2">
            <div className="bg-[#6EBB2D] w-full h-full rounded-full"></div>
          </div>
          <div
            className={`bg-[#E9F6F9] ${styles.flexCol} items-center justify-center w-full h-full rounded-full`}
          >
            <h2 className={`${styles.h2} text-center`}>{i.item}</h2>
            <p className={`${styles.span} text-center`}>{i.title[lang]}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistika;
