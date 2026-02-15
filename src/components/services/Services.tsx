"use client";
import { ServicesType } from "@/interfaces/services.interface";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { Playfair } from "next/font/google";
// Kerakli barcha ikonkalarni import qilamiz
import {
  Car,
  ShieldCheck,
  Map,
  Globe,
  Briefcase,
  LucideIcon,
  NotepadText,
  ShieldAlert,
} from "lucide-react";

const playfair = Playfair({ subsets: ["latin"], weight: ["400"] });

// 1. Ikonkalar uchun mapping obyekti yaratamiz
const ICON_MAP: Record<string, LucideIcon> = {
  Car: Car,
  Visa: ShieldCheck, // JSON'da "Visa" bo'lsa ShieldCheck chiqadi
  Tours: Map,
  Plan: NotepadText,
  Insurance: ShieldAlert,
  B2B: Briefcase,
};

const Services = () => {
  const t = useTranslations("serviceItems");
  const services = t.raw("items") as ServicesType[];

  return (
    <div className={`${styles.paddingCont}`}>
      <h2 className={`${styles.h2} text-center mb-1`}>{t("title")}</h2>
      <p
        className={`text-center text-3xl text-[#6EBB2D] ${playfair.className} mb-10`}
      >
        {t("desc")}
      </p>

      <div className="flex flex-wrap items-stretch justify-center">
        {services.map((item, i) => {
          // 2. Mantiq: Agar rasm bo'lsa string, bo'lmasa ICON_MAP dan komponentni olamiz
          const isSvg =
            typeof item.img === "string" && item.img.endsWith(".svg");
          const LucideIconComponent = !isSvg
            ? ICON_MAP[item.img as string]
            : null;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-3 w-full sm:w-1/2 lg:w-1/4 sm:p-5 p-3 hover:scale-[1.02] transition-transform"
            >
              {/* Ikonka yoki Rasm konteyneri */}
              <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-2xl mb-2">
                {isSvg ? (
                  <img
                    src={
                      item.img.startsWith("/")
                        ? `/icons/${item.img}`
                        : `/icons/${item.img}`
                    }
                    alt={item.title}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                ) : LucideIconComponent ? (
                  <LucideIconComponent
                    className="w-10 h-10 text-[#056D50]"
                    strokeWidth={1.5}
                  />
                ) : (
                  // Agar na rasm na ikonka topilsa, zaxira ikonka
                  <Globe className="w-10 h-10 text-gray-300" />
                )}
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-center text-gray-600 leading-relaxed px-2">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
