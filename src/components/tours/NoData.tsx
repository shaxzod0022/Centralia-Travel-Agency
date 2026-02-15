"use client";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function EmptyState() {
  const router = useRouter();
  const t = useTranslations("emptyState");

  return (
    <div
      className={`min-h-screen ${styles.flexCenter} bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 text-center !pt-28 ${styles.paddingCont}`}
    >
      <div className="max-w-md mx-auto">
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-100 to-emerald-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <svg
              className="w-16 h-16 [#6EBB2D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t("title")}
        </h3>

        <p className="text-gray-600 text-lg mb-8">{t("description")}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/tours")}
            className="px-6 py-3 bg-[#6EBB2D] text-white font-semibold rounded-xl hover:[#6EBB2D] transition-colors shadow-md"
          >
            {t("viewOtherTours")}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
          >
            {t("goBack")}
          </button>
        </div>
      </div>
    </div>
  );
}
