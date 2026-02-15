"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { SearchPreviewResponse } from "@/interfaces/search.interface";
import { MapPin } from "lucide-react";

interface DesktopSearchModalProps {
  show?: boolean;
  value: string;
  onClose: () => void;
}

const DesktopSearchModal = ({
  value,
  onClose,
  show,
}: DesktopSearchModalProps) => {
  const t = useTranslations("search");
  const ref = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<SearchPreviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ===== MODAL OCHILISH SHARTI ===== */
  const safeValue = value ?? "";
  const isOpen = safeValue.trim().length >= 3;

  /* ===== OUTSIDE CLICK ===== */
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  /* ===== API SEARCH ===== */
  useEffect(() => {
    if (!isOpen) {
      setResults(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URI
          }/api/search/preview?q=${encodeURIComponent(value)}`,
        );
        const data: SearchPreviewResponse = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, isOpen]);

  /* ===== MODAL YOPIQ ===== */
  if (!results) return null;

  if (loading)
    return (
      <div
        className={`absolute top-14 left-1/2 -translate-x-1/2
      ${!show ? "w-full" : "xl:w-full lg:w-[500px]"} bg-white border border-[#6EBB2D]
      rounded-2xl shadow-2xl z-50 !p-16`}
      >
        <p className={`${styles.p} text-center`}>{t("searching")}</p>
      </div>
    );

  /* ===== UI ===== */
  return (
    <div
      ref={ref}
      className={`absolute top-14 left-1/2 -translate-x-1/2
      ${!show ? "w-full" : "xl:w-full md:w-[500px]"} bg-white border border-[#6EBB2D]
      rounded-2xl shadow-2xl z-50`}
    >
      <div className="max-h-[70vh] overflow-y-auto p-4 space-y-3">
        {!loading &&
          results &&
          !results.countries.length &&
          !results.destinations.length &&
          !results.tours.length && (
            <div
              className={`${styles.flexCol} items-center gap-2 text-center py-8`}
            >
              <Image src="/search-not-found.svg" alt="Search not found" width={200} height={200} />
              <h4 className={styles.h4}>{t("noResults")}</h4>
              <p className={styles.p}>{t("subDesc")}</p>
            </div>
          )}

        {/* COUNTRY */}
        {!!results?.countries.length && (
          <div>
            <h5 className="text-sm font-semibold text-gray-500 mb-2">
              {t("countries")}
            </h5>
            {results.countries.map((d) => (
              <a
                key={d.id}
                href={`/tours?country=${d.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#6EBB2D]/10"
              >
                <Image
                  src={d.image || ""}
                  alt={d.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover shrink-0 aspect-square"
                />
                <span className={`${styles.flexCol}`}>
                  <span className={`${styles.h4} line-clamp-1`}>{d.name}</span>
                  <span className=" text-gray-500 text-sm">{t("country")}</span>
                </span>
              </a>
            ))}
          </div>
        )}

        {/* DESTINATIONS */}
        {!!results?.destinations.length && (
          <div>
            <h5 className="text-sm font-semibold text-gray-500 mb-2">
              {t("destinations")}
            </h5>
            {results.destinations.map((d) => (
              <a
                key={d.id}
                href={`/tours?destination=${d.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#6EBB2D]/10"
              >
                <Image
                  src={d.image || ""}
                  alt={d.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover shrink-0 aspect-square"
                />
                <span>
                  <span className={`${styles.h4} line-clamp-1`}>{d.name}</span>
                  {d.country && (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {d.country}
                    </span>
                  )}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* TOURS */}
        {!!results?.tours.length && (
          <div>
            <h5 className="text-sm font-semibold text-gray-500 mb-2">
              {t("tours")}
            </h5>
            {results.tours.map((tItem) => (
              <a
                target="_blank"
                key={tItem.id}
                href={`/tours/${tItem.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#6EBB2D]/10"
              >
                <Image
                  src={tItem.coverImage || ""}
                  alt={tItem.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover shrink-0 aspect-square"
                />
                <span className={`${styles.flexCol}`}>
                  <span
                    className={
                      styles.p + " !text-gray-700 font-semibold line-clamp-1"
                    }
                  >
                    {tItem.name}
                  </span>
                  <span className="text-gray-500 text-sm">{t("tour")}</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopSearchModal;
