"use client";

import { X } from "lucide-react";
import { FilterFacets, FilterState } from "@/interfaces/filter.interface";
import { useTranslations } from "next-intl";

interface Props {
  filters: FilterState;
  facets: FilterFacets | null;
  onRemove: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
}

export default function ActiveFilters({
  filters,
  facets,
  onRemove,
  onClear,
}: Props) {
  const t = useTranslations("filter");
  if (!facets) return null;

  const chips: {
    key: keyof FilterState;
    value: string;
    label: string;
  }[] = [];

  const pushChip = (key: keyof FilterState, value: string, label: string) => {
    chips.push({ key, value, label });
  };

  const mapFacetLabel = (key: keyof FilterState, value: string): string => {
    const facetMap = {
      country: facets.countries,
      destination: facets.destinations,
      category: facets.categories,
      duration: facets.duration,
      season: facets.season,
      technical: facets.technical,
      fitness: facets.fitness,
      price: facets.price,
    };

    const found = facetMap[key]?.find((f) => f.value === value);
    return found ? found.label : value;
  };

  (Object.keys(filters) as (keyof FilterState)[]).forEach((key) => {
    filters[key]?.forEach((value) => {
      pushChip(key, value, mapFacetLabel(key, value));
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
      {chips.map((chip, i) => (
        <div
          key={`${chip.key}-${chip.value}-${i}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <span className="sm:text-sm text-xs md:text-md">
            <span className="font-medium capitalize mr-1">
              {t(`${chip.key}`)}:
            </span>
            {chip.label}
          </span>

          <button
            onClick={() => onRemove(chip.key, chip.value)}
            className="text-gray-400 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <button
        onClick={onClear}
        className="hidden md:block sm:text-sm text-xs md:text-md px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        {t("clear")}
      </button>
    </div>
  );
}
