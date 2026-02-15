"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import XBtn from "./XBtn";
import { styles } from "@/styles/styles";
import Results from "./SearchResults";
import { SearchPreviewResponse } from "@/interfaces/search.interface";
import { useTypingEffect } from "@/hooks/useTypingEffect";

interface Props {
  show: boolean;
  onClose: () => void;
}

const MobileSearchModal = ({ show, onClose }: Props) => {
  const t = useTranslations("search");
  const ref = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchPreviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const placeholderTexts = [
    t("placeholderExplore"),
    t("placeholderFind"),
    t("placeholderQuestion"),
    t("placeholderAdventure"),
    t("placeholderImpressions"),
  ];

  const placeholder = useTypingEffect(placeholderTexts, 50, 30, 4000);

  /* ===== prevent close when tapping inside ===== */
  useEffect(() => {
    if (!show) return;

    const handler = (e: TouchEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    document.addEventListener("touchstart", handler, { capture: true });
    return () =>
      document.removeEventListener("touchstart", handler, { capture: true });
  }, [show]);

  /* ===== search debounce ===== */
  useEffect(() => {
    if (query.length <= 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_URI
          }/api/search/preview?q=${encodeURIComponent(query)}`,
        );
        const data: SearchPreviewResponse = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      className={`md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
      ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        ref={ref}
        className={`fixed top-10 left-0 right-0 min-h-screen bg-white
        rounded-t-3xl border border-[#6EBB2D]
        transition-transform duration-500 p-4 overflow-y-auto
        ${show ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* INPUT */}
        <div className={`${styles.flex} gap-3 mb-6`}>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full h-12 pl-10 pr-4 border-2 border-[#6EBB2D]
              rounded-full outline-none font-semibold text-lg"
            />
          </div>
          <XBtn onClick={onClose} />
        </div>

        <Results results={results} onItemClick={onClose} />
      </div>
    </div>
  );
};

export default MobileSearchModal;
