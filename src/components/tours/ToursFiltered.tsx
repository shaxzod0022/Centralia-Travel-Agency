"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

import { FilterFacets, FilterState } from "@/interfaces/filter.interface";
import TourFilters from "./FilterTours";
import { FilterService } from "@/rest/filter.service";
import { Tour } from "@/interfaces/tour.interface";
import Tours from "./Tours";
import { mapBackendFacetsToUI } from "@/utils/mapper";
import CardSkeleton from "../helper/CardSkeleton";
import EmptyState from "../helper/EmptyState";
import { styles } from "@/styles/styles";
import { usePathname, useSearchParams } from "next/navigation";

const ToursFiltered = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [total, setTotal] = useState<number>(0);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [facets, setFacets] = useState<FilterFacets | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

  // Construct initial filters
  const pathParts = pathname.split("/");
  const type = pathParts[3];
  const id = pathParts[4];

  const initialFilters: FilterState = {};
  if (id && type === "country") initialFilters.country = [id];
  if (id && type === "destination") initialFilters.destination = [id];

  const countryParam = searchParams.get("country");
  const destinationParam = searchParams.get("destination");

  if (countryParam) initialFilters.country = [countryParam];
  if (destinationParam) initialFilters.destination = [destinationParam];

  const onFilterChange = async (filters: FilterState) => {
    try {
      setLoading(true);
      const pathParts = pathname.split("/");
      const type = pathParts[3];
      const id = pathParts[4];

      const pathParams: { country?: string; destination?: string } = {};

      if (id) {
        if (type === "country") {
          pathParams.country = id;
        } else if (type === "destination") {
          pathParams.destination = id;
        }
      }

      const res = await FilterService.getFilteredTours({
        language: locale,
        ...pathParams,
        ...filters,
      });

      setTours(res.data.tours);
      setTotal(res.data.total);
      setFacets(mapBackendFacetsToUI(res.facets));
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    onFilterChange({});
  }, [locale, pathname]); // Pathname o'zgarganda ham qayta yuklanishi uchun

  return (
    <div className="relative z-10">
      <TourFilters
        total={total}
        facets={facets}
        onFilterChange={onFilterChange}
        initialFilters={initialFilters}
      />

      {/* Tours list */}
      <section>
        {loading ? (
          <div
            className={`${styles.paddingCont} !pt-5 ${styles.flex} flex-wrap`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : hasLoadedOnce && tours.length === 0 ? (
          <EmptyState onReset={() => onFilterChange({})} />
        ) : (
          <Tours data={tours} newClass="!pt-3" />
        )}
      </section>
    </div>
  );
};

export default ToursFiltered;
