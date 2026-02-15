// components/tours/TourFilters.tsx
"use client";

import { useState } from "react";
import { FilterFacets, FilterState } from "@/interfaces/filter.interface";
import FilterDropdown from "./FilterDropDown";
import { styles } from "@/styles/styles";
import { useTranslations } from "next-intl";
import ActiveFilters from "./ActiveFilters";
import { SlidersHorizontal, X } from "lucide-react";
import { createPortal } from "react-dom";
import FilterOptionsList from "./FilterOptionsList";

interface Props {
  onFilterChange: (filters: FilterState) => void;
  total: number;
  facets: FilterFacets | null;
  initialFilters?: FilterState;
}

export default function TourFilters({ onFilterChange, total, facets, initialFilters }: Props) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const t = useTranslations("filter");

  if (!facets) return null;

  const updateFilter = (key: keyof FilterState, value: (string | number)[]) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const removeFilter = (key: keyof FilterState, value: string) => {
    const updatedValues = filters[key]?.filter((v) => v !== value) || [];
    const updated = { ...filters, [key]: updatedValues };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearAll = () => {
    setFilters({});
    onFilterChange({});
  };

  const filtersConfig = [
    { key: "country", label: t("country"), data: facets.countries, },
    { key: "destination", label: t("destination"), data: facets.destinations },
    { key: "category", label: t("category"), data: facets.categories },
    { key: "duration", label: t("duration"), data: facets.duration },
    { key: "season", label: t("season"), data: facets.season },
    { key: "technical", label: t("technical"), data: facets.technical },
    { key: "fitness", label: t("fitness"), data: facets.fitness },
    { key: "price", label: t("price"), data: facets.price },
  ] as const;

  return (
    <div className={`${styles.paddingCont} !pb-0`}>
      <div
        className={`px-4 flex flex-col-reverse md:flex-row md:justify-between items-start md:items-center gap-4`}
      >
        {/* LEFT FILTERS (DESKTOP) & MOBILE BUTTON */}
        <div className={`w-full md:w-auto flex justify-between items-center md:block`}>
          {/* MOBILE TOTAL (Visible on left) */}
          <div className="text-lg font-semibold whitespace-nowrap md:hidden">
            {total} {t("tours")}
          </div>

          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={20} />
          </button>

          {/* DESKTOP FILTERS LIST */}
          <div className="hidden md:flex flex-wrap gap-3">
            {filtersConfig.map((conf) => (
              <FilterDropdown
                key={conf.key}
                title={conf.label}
                options={conf.data.map((item) => ({
                  value: item.value,
                  label: conf.key === 'duration' ? `${item.label}` : item.label,
                  count: item.count,
                  disabled: item.disabled,
                }))}
                selected={filters[conf.key] || []}
                onChange={(v) => updateFilter(conf.key, v)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT TOTAL (DESKTOP) */}
        <div className="hidden md:block text-lg font-semibold whitespace-nowrap">
          {total} {t("tours")}
        </div>
      </div>

      {/* ACTIVE FILTERS (Desktop & Mobile) */}
      <div className="px-4 mt-3">
        <ActiveFilters
          filters={filters}
          facets={facets}
          onRemove={removeFilter}
          onClear={clearAll}
        />
      </div>

      {/* MOBILE GLOBAL FILTER DRAWER */}
      {mobileFiltersOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end md:hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-white transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* DRAWER CONTENT */}
          <div className="relative w-full h-[100dvh] bg-white flex flex-col animate-slideUp">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="text-xl font-semibold">{t("filter")}</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {filtersConfig.map((conf) => (
                <div key={conf.key}>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">{conf.label}</h3>
                  <FilterOptionsList
                    options={conf.data
                      .filter((item) => !item.disabled || (filters[conf.key] || []).includes(item.value))
                      .map((item) => ({
                        value: item.value,
                        label: conf.key === "duration" ? `${item.label}` : item.label,
                        count: item.count,
                        disabled: item.disabled,
                      }))}
                    selected={filters[conf.key] || []}
                    onChange={(v) => updateFilter(conf.key, v)}
                  />
                  <div className="h-px bg-gray-100 mt-4" />
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
              <button
                onClick={clearAll}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition"
              >
                {t("clear")}
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#6EBB2D] text-white font-medium hover:bg-[#5da524] transition"
              >
                {t("show")} ({total})
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
