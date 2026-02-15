"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Playfair } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400"],
});

interface Item {
  image: string;
  country: string;
  dest: string;
}

const data: Item[] = [
  {
    image: "https://media.centraliatours.com/gallery/azamat-e-F8RPA3u1_n8-unsplash.jpg",
    country: "Kyrgyzstan",
    dest: "Naryn River",
  },
  {
    image: "https://media.centraliatours.com/gallery/duman-shaker-20G7A0qFScU-unsplash.jpg",
    country: "Kazakhstan",
    dest: "Katon-Karagay",
  },
  {
    image: "https://media.centraliatours.com/gallery/encal-media-ngXERIGWBns-unsplash.jpg",
    country: "Tajikistan",
    dest: "Ismail Somoni Peak",
  },
  {
    image: "https://media.centraliatours.com/gallery/evgeny-matveev-HGjJgqTjy44-unsplash.jpg",
    country: "Kazakhstan",
    dest: "Kolsai Lake",
  },
  {
    image: "https://media.centraliatours.com/gallery/IMG_7242.jpg",
    country: "Tajikistan",
    dest: "Seven Lakes",
  },
  {
    image: "https://media.centraliatours.com/gallery/kaijun-qiu-QBqP0K7kRro-unsplash.jpg",
    country: "Uzbekistan",
    dest: "Charvak",
  },
  {
    image: "https://media.centraliatours.com/gallery/mike-dudin-2QOzZDO_1oo-unsplash.jpg",
    country: "Kyrgyzstan",
    dest: "Issyk-Kul",
  },
  {
    image: "https://media.centraliatours.com/gallery/nodir-khalilov-SIGsDjceLwc-unsplash.jpg",
    country: "Uzbekistan",
    dest: "Tavaksay",
  },
];

const slides = [...data, ...data]; // INFINITE

export default function Gallery() {
  const t = useTranslations("gallery");
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  const next = () => setIndex((i) => (i + 1) % data.length);
  const prev = () => setIndex((i) => (i - 1 + data.length) % data.length);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* ===== GALLERY ===== */}
      <h2 className={`${styles.h2} text-center text-[#056D50] mb-1`}>
        {t("title")}
      </h2>
      <p
        className={`mb-10 text-center ${styles.h3} !text-[#056D50] ${playfair.className}`}
      >
        {t("desc")}
      </p>
      <div className="w-full overflow-hidden">
        {/* TOP */}
        <div className="gallery-track left">
          {slides.map((item, i) => (
            <Slide
              key={i}
              item={item}
              onClick={() => {
                setIndex(i % data.length);
                setOpen(true);
              }}
            />
          ))}
        </div>

        {/* BOTTOM */}
        <div className="gallery-track right">
          {slides.map((item, i) => (
            <Slide
              key={i}
              item={item}
              onClick={() => {
                setIndex(i % data.length);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* ===== FULLSCREEN ===== */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={32} />
          </button>

          <button onClick={prev} className="absolute z-50 left-6 text-white">
            <ChevronLeft size={40} />
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw] w-full h-full flex items-center justify-center">
            <Image
              src={data[index].image}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              alt="Centralia images"
              width={1200}
              height={800}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <button onClick={next} className="absolute z-50 right-6 text-white">
            <ChevronRight size={40} />
          </button>

          <div className="absolute bottom-10 text-center text-white">
            <h3 className="text-2xl font-semibold">{data[index].dest}</h3>
            <p className="opacity-80">{data[index].country}</p>
          </div>
        </div>
      )}

      {/* ===== STYLES ===== */}
      <style jsx>{`
        .gallery-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }

        .gallery-track.left {
          animation: scroll-left 90s linear infinite;
        }

        .gallery-track.right {
          animation: scroll-right 90s linear infinite;
        }

        @keyframes scroll-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes scroll-right {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </>
  );
}

function Slide({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="
        relative cursor-pointer overflow-hidden shrink-0
        w-[50vw] md:w-[33.333vw] xl:w-[25vw]
        md:h-[350px]  h-48
      "
    >
      <Image
        src={item.image}
        className="object-cover"
        alt={`${item.dest}`}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />

      <div className="absolute bottom-4 w-full text-center text-white bg-black/40">
        <h4 className="font-semibold">{item.dest}</h4>
        <p className="text-sm">{item.country}</p>
      </div>
    </div>
  );
}
