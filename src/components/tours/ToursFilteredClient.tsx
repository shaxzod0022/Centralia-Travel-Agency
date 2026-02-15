// ToursFilteredClient.tsx - Client component for tours list with filters
// Receives initial data from server, handles subsequent filter updates client-side
"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

import { FilterFacets, FilterState } from "@/interfaces/filter.interface";
import TourFilters from "./FilterTours";
import { FilterService } from "@/rest/filter.service";
import { Tour } from "@/interfaces/tour.interface";
import Tours from "./Tours";
import { mapBackendFacetsToUI } from "@/utils/mapper";
import CardSkeleton from "../helper/CardSkeleton";
import EmptyState from "../helper/EmptyState";
import { styles } from "@/styles/styles";

interface ToursFilteredClientProps {
    initialTours: Tour[];
    initialTotal: number;
    initialFacets: FilterFacets | null;
}

const ToursFilteredClient = ({
    initialTours,
    initialTotal,
    initialFacets,
}: ToursFilteredClientProps) => {
    const locale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialFiltersFromParams: FilterState = {};
    const countryParam = searchParams.get("country");
    const destinationParam = searchParams.get("destination");

    if (countryParam) initialFiltersFromParams.country = [countryParam];
    if (destinationParam) initialFiltersFromParams.destination = [destinationParam];

    const [total, setTotal] = useState<number>(initialTotal);
    const [tours, setTours] = useState<Tour[]>(initialTours);
    const [loading, setLoading] = useState<boolean>(false);
    const [facets, setFacets] = useState<FilterFacets | null>(initialFacets);
    const [hasFiltered, setHasFiltered] = useState<boolean>(
        !!(countryParam || destinationParam)
    );

    const onFilterChange = async (filters: FilterState) => {
        // Skip if no filters applied (initial load handled by server)
        if (Object.keys(filters).length === 0 && !hasFiltered) {
            return;
        }

        try {
            setLoading(true);
            setHasFiltered(true);

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
        } finally {
            setLoading(false);
        }
    };

    // Sync state with props when server refetches (e.g. navigation)
    useEffect(() => {
        setTours(initialTours);
        setTotal(initialTotal);
        setFacets(initialFacets);
        // Only update 'hasFiltered' if we purely navigated, but we control it via onFilterChange usually.
        // Actually, if we navigate to ?country=X, initialTours are filtered, so loading is done.
        setLoading(false);
    }, [initialTours, initialTotal, initialFacets]);

    // Only refetch on internal filter changes that didn't come from server navigation
    // We remove the useEffect that watched [pathname] because server component handles navigation updates
    // and passes new props.
    // If we want to support browser Back/Forward without server roundtrip (soft nav), 
    // Next.js might retain state, but typically it re-renders server component for searchParams changes.

    return (
        <div className="relative z-10">
            <TourFilters
                total={total}
                facets={facets}
                onFilterChange={onFilterChange}
                initialFilters={initialFiltersFromParams}
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
                ) : tours.length === 0 ? (
                    <EmptyState onReset={() => onFilterChange({})} />
                ) : (
                    <Tours data={tours} newClass="!pt-3" />
                )}
            </section>
        </div>
    );
};

export default ToursFilteredClient;
