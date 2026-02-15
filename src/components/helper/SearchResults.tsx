"use client";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { SearchPreviewResponse } from "@/interfaces/search.interface";

const SearchResults = ({
  results,
  onItemClick,
}: {
  results: SearchPreviewResponse | null;
  onItemClick: () => void;
}) => {
  const t = useTranslations("search");

  if (
    results &&
    !results.countries.length &&
    !results.destinations.length &&
    !results.tours.length
  ) {
    return (
      <div className={`${styles.flexCol} items-center text-center gap-2 py-8`}>
        <Image src="/search-not-found.svg" alt="Search Not Found" width={200} height={200} />
        <h4 className={styles.h4}>{t("noResults")}</h4>
        <p className={styles.p}>{t("subDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* COUNTRY */}
      {results?.countries.length ? (
        <div>
          <h5 className="text-sm font-semibold text-gray-500 mb-2">
            {t("countries")}
          </h5>
          {results.countries.map((d) => (
            <a
              key={d.id}
              href={`/tours?country=${d.id}`}
              onClick={onItemClick}
              className="flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#6EBB2D]/10"
            >
              <Image
                src={d.image || ""}
                alt={d.name}
                width={48}
                height={48}
                className="rounded-md object-cover aspect-square shrink-0"
              />
              <span className={`${styles.flexCol}`}>
                <span className={`${styles.h4} line-clamp-1`}>{d.name}</span>
                <span className=" text-gray-500 text-sm">{t("country")}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}

      {/* DESTINATIONS */}
      {results?.destinations.length ? (
        <div>
          <h5 className="text-sm font-semibold text-gray-500 mb-2">
            {t("destinations")}
          </h5>
          {results.destinations.map((d) => (
            <a
              key={d.id}
              href={`/tours?destination=${d.id}`}
              onClick={onItemClick}
              className="flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#6EBB2D]/10"
            >
              <Image
                src={d.image || ""}
                alt={d.name}
                width={48}
                height={48}
                className="rounded-md object-cover aspect-square shrink-0"
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
      ) : null}

      {/* TOURS */}
      {results?.tours.length ? (
        <div>
          <h5 className="text-sm font-semibold text-gray-500 mb-2">
            {t("tours")}
          </h5>
          {results.tours.map((tItem) => (
            <a
              target="_blank"
              key={tItem.id}
              href={`/tours/${tItem.slug}`}
              onClick={onItemClick}
              className="flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#6EBB2D]/10"
            >
              <Image
                src={tItem.coverImage || ""}
                alt={tItem.name}
                width={48}
                height={48}
                className="rounded-md object-cover aspect-square shrink-0"
              />
              <span className={`${styles.flexCol}`}>
                <span
                  className={
                    styles.p + " !text-gray-700 font-semibold line-clamp-1"
                  }
                >
                  {tItem.name}
                </span>
                <span className=" text-gray-500 text-sm">{t("tour")}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SearchResults;
