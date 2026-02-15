"use client";

import { useState, useEffect, use } from "react";
import { styles } from "@/styles/styles";
import { MoveRight, Search, ChevronUp, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Playfair } from "next/font/google";
import { Link } from "@/i18n/routing";
import DesktopSearchModal from "../helper/DesktopSearchModal";
import { useTypingEffect } from "@/hooks/useTypingEffect";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

interface ImageSlide {
  img: string;
  title: {
    [key: string]: string;
  };
  subTitle: {
    [key: string]: string;
  };
}

const images: ImageSlide[] = [
  {
    img: "/head/Ala-Kul-Trek23-1.jpg",
    title: {
      en: "Where Earth Touches Sky",
      ru: "Там, где Земля встречает Небо",
      de: "Wo die Erde den Himmel berührt",
      ja: "大地が空に触れる場所へ",
      es: "Donde la Tierra Toca el Cielo",
    },
    subTitle: {
      en: "Walk ancient trails through dramatic mountain landscapes. Designed for explorers who seek altitude, silence, and raw nature.",
      ru: "Пройдите древними тропами среди величественных горных пейзажей. Для исследователей, ищущих высоту, тишину и первозданную природу.",
      de: "Wandern Sie auf uralten Pfaden durch dramatische Berglandschaften. Konzipiert für Entdecker, die Höhe, Stille und unberührte Natur suchen.",
      ja: "壮大な山岳風景の中、古代から続くトレイルを歩く旅。高度、静寂、そして手つかずの自然を求める探検者のために。",
      es: "Camina por senderos ancestrales a través de paisajes montañosos impresionantes. Diseñado para exploradores que buscan altura, silencio y naturaleza pura.",
    },
  },
  {
    img: "/head/irina-shishkina-oCraqR8vXlc-unsplash.jpg",
    title: {
      en: "Endless Sands & Horizons",
      ru: "Бескрайние Пески и Горизонты",
      de: "Endlose Sande & Horizonte",
      ja: "果てしない砂と地平線",
      es: "Arenas Infinitas y Horizontes Abiertos",
    },
    subTitle: {
      en: "Vast horizons, open skies, and timeless routes across deserts and steppes. A journey into landscapes where distance reshapes perspective.",
      ru: "Открытые пространства, безграничное небо и вечные маршруты через пустыни и степи. Путешествие, где расстояние меняет восприятие мира.",
      de: "Weite Horizonte, offener Himmel und zeitlose Routen durch Wüsten und Steppen. Eine Reise in Landschaften, in denen Distanz die Perspektive verändert.",
      ja: "広がる地平線、開けた空、砂漠と草原を貫く永遠のルート。距離が視点を変える、壮大な旅へ",
      es: "Horizontes interminables, cielos abiertos y rutas atemporales a través de desiertos y estepas. Un viaje donde la distancia transforma la perspectiva.",
    },
  },
  {
    img: "/head/Picture_of_Kyrgyzstan_4455e2cfef.jpeg",
    title: {
      en: "Born Under Open Skies",
      ru: "Рождённые под Открытым Небом",
      de: "Unter freiem Himmel geboren",
      ja: "大空の下に生きる",
      es: "Nacidos Bajo Cielos Abiertos",
    },
    subTitle: {
      en: "Experience authentic nomadic culture and life beyond modern comfort. Stay in traditional yurts and connect with centuries-old traditions.",
      ru: "Погрузитесь в подлинную кочевую культуру и жизнь вне современного комфорта. Ночёвки в традиционных юртах и связь с вековыми традициями.",
      de: "Erleben Sie authentische nomadische Kultur und ein Leben jenseits modernen Komforts. Übernachten Sie in traditionellen Jurten und verbinden Sie sich mit jahrhundertealten Traditionen.",
      ja: "現代の快適さを離れ、本物の遊牧文化を体験。伝統的なユルトに滞在し、何世紀も続く暮らしとつながる時間。",
      es: "Vive la auténtica cultura nómada y una vida más allá del confort moderno. Alójate en yurtas tradicionales y conecta con tradiciones centenarias.",
    },
  },
  {
    img: "/head/oziel-gomez-AdIHYQ8L6_M-unsplash.jpg",
    title: {
      en: "Above the Clouds",
      ru: "Выше Облаков",
      de: "Über den Wolken",
      ja: "雲の上へ",
      es: "Por Encima de las Nubes",
    },
    subTitle: {
      en: "Challenge your limits in extreme high-altitude environments. Built for serious adventurers chasing remote peaks and pure adrenaline.",
      ru: "Испытайте себя в экстремальных высокогорных условиях. Для настоящих искателей приключений, стремящихся к удалённым вершинам и чистому адреналину.",
      de: "Stellen Sie sich extremen Hochgebirgsumgebungen und testen Sie Ihre Grenzen. Geschaffen für Abenteurer, die abgelegene Gipfel und reines Adrenalin suchen.",
      ja: "極限の高所環境で自らの限界に挑む。人里離れた峰と純粋なアドレナリンを追い求める本格派冒険者のために",
      es: "Pon a prueba tus límites en entornos extremos de gran altitud. Creado para aventureros que persiguen cumbres remotas y pura adrenalina.",
    },
  },
  {
    img: "/head/TWO-TAJIK-1.jpg",
    title: {
      en: "Into the Wild Routes",
      ru: "По Диким Маршрутам",
      de: "Auf wilden Routen",
      ja: "未知なるルートへ",
      es: "Rutas Hacia lo Salvaje",
    },
    subTitle: {
      en: "Travel deep into unreachable terrains by powerful 4x4 routes. Off-road journeys crafted for thrill, freedom, and exploration.",
      ru: "Отправьтесь в самые труднодоступные регионы на мощных внедорожниках 4x4. Off-road-путешествия для свободы, драйва и настоящих открытий.",
      de: "Dringen Sie mit leistungsstarken 4x4-Fahrzeugen in unzugängliche Gebiete vor. Offroad-Reisen für Freiheit, Nervenkitzel und echte Entdeckung.",
      ja: "パワフルな4x4で、通常では辿り着けない地へ。自由、興奮、探検心のために設計されたオフロード体験。",
      es: "Explora territorios inaccesibles a bordo de potentes vehículos 4x4. Viajes off-road diseñados para la libertad, la emoción y la exploración total.",
    },
  },
];

const Head = () => {
  const t = useTranslations("buttons");
  const placeholderText = useTranslations("search");

  const placeholderTexts = [
    placeholderText("placeholderExplore"),
    placeholderText("placeholderFind"),
    placeholderText("placeholderQuestion"),
    placeholderText("placeholderAdventure"),
    placeholderText("placeholderImpressions"),
  ];

  const placeholder = useTypingEffect(placeholderTexts, 50, 30, 4000);

  const [current, setCurrent] = useState(0);
  const lang = useLocale();

  // DESKTOP search
  const [desktopSearchOpen, setDesktopSearchOpen] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrent(index);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <header className="pt-24 relative w-full">
      {/* Slider */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(to right,#0D0D0C80,#0D0D0C80), url(${img.img})`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className={`${styles.paddingCont} relative space-y-10 z-20`}>
        <div
          className={`absolute md:flex hidden z-40 top-1/2 -translate-y-1/2 right-20 ${styles.flexCol} items-center gap-3`}
        >
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition"
          >
            <ChevronUp size={24} />
          </button>
          <div className={`${styles.flexCol} transform gap-2 z-20`}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-0.5 h-5 transition-colors rounded-4xl ${
                  current === index ? "bg-[#6EBB2D]" : "bg-white"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full transition"
          >
            <ChevronDown size={24} />
          </button>
        </div>
        <div>
          <div
            key={current}
            className="
    transition-opacity duration-700 ease-in-out animate-fadeIn
    space-y-2
    min-h-[280px] md:min-h-[320px] lg:min-h-[360px]
    flex flex-col justify-center
  "
          >
            <h1
              className={`${styles.h1} md:w-5/6 text-white w-full md:text-left text-center`}
            >
              {images[current].title[lang]}
            </h1>
            <p
              className={`${playfair.className} ${styles.h3} text-white md:text-left text-center mb-5 md:w-4/5 w-full`}
            >
              {images[current].subTitle[lang]}
            </p>
          </div>
          <div
            className={`${styles.flex} md:justify-start justify-center flex-wrap gap-5`}
          >
            <Link
              href={"/tours"}
              className={`active:scale-95 bg-[#6EBB2D] border-2 border-[#6EBB2D] hover:bg-transparent hover:border-white transition xl:px-6 px-4 py-2 sm:text-xl text-md rounded-full text-white ${styles.flex} gap-2`}
            >
              {t("headBtn1")}
              <MoveRight />
            </Link>
            <Link
              href={"/services"}
              className={`active:scale-95 border-2 border-white transition hover:bg-[#6EBB2D] hover:border-[#6EBB2D] xl:px-6 px-4 py-2 sm:text-xl text-md rounded-full text-white ${styles.flex} gap-2`}
            >
              {t("headBtn2")}
              <MoveRight />
            </Link>
          </div>
        </div>

        <div
          className={`${styles.flexBetween} relative bg-white rounded-full md:w-[60%] mx-auto p-2`}
        >
          <input
            id="hero-search"
            aria-label="hero-search"
            onChange={(e) => setDesktopSearchOpen(e.target.value)}
            placeholder={placeholder}
            type="text"
            className={`outline-none sm:text-xl text-md px-3 py-2 sm:px-6 w-[95%]`}
          />
          <button
            className={`${styles.flexCenter} absolute right-2 sm:w-12 sm:h-12 w-10 h-10 text-white bg-[#6EBB2D] rounded-full`}
          >
            <Search />
          </button>
          <DesktopSearchModal
            value={desktopSearchOpen}
            onClose={() => setDesktopSearchOpen("")}
          />
        </div>
      </div>
    </header>
  );
};

export default Head;
