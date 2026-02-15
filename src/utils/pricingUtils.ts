import { Option } from "@/interfaces/calendar.interface";

export interface Participants {
    adults: number;
    children: number;
    infants: number;
}

export const formatPrice = (option: Option): string => {
    if (option.pricing.mode === "PER_PERSON") {
        const adultPrice = option.pricing.ageCategories.find(
            (cat) => cat.category === "adult"
        )?.price;
        return adultPrice ? `$${adultPrice}` : "N/A";
    } else {
        const minPrice = option.pricing.personRanges[0]?.price;
        return minPrice ? `$${minPrice}` : "N/A";
    }
};

export const getPriceLabel = (
    option: Option,
    t: (key: string) => string
): string => {
    return option.pricing.mode === "PER_PERSON"
        ? t("perPerson")
        : t("perGroup");
};

export const calculateTotalPrice = (
    option: Option | undefined,
    participants: Participants,
    selectedDate: Date | null
): { basePrice: number; seasonalPrice: number | null } => {
    if (!option) {
        return { basePrice: 0, seasonalPrice: null };
    }

    let baseTotal = 0;

    /* ================= BASE PRICE ================= */

    if (option.pricing.mode === "PER_PERSON") {
        baseTotal +=
            (participants.adults || 0) *
            (option.pricing.ageCategories.find((cat) => cat.category === "adult")
                ?.price || 0);

        baseTotal +=
            (participants.children || 0) *
            (option.pricing.ageCategories.find((cat) => cat.category === "child")
                ?.price || 0);

        baseTotal +=
            (participants.infants || 0) *
            (option.pricing.ageCategories.find((cat) => cat.category === "infant")
                ?.price || 0);
    } else {
        const totalParticipants =
            (participants.adults || 0) +
            (participants.children || 0) +
            (participants.infants || 0);

        const priceRange = option.pricing.personRanges.find(
            (range) =>
                totalParticipants >= range.fromPerson &&
                totalParticipants <= range.toPerson
        );

        baseTotal = priceRange?.price || 0;
    }

    /* ================= SEASONAL PRICE ================= */

    let seasonalPrice: number | null = null;

    if (selectedDate && option.pricing.seasonalPricing?.length) {
        const selectedTime = selectedDate.getTime();

        const seasonal = option.pricing.seasonalPricing.find((season) => {
            const start = new Date(season.startDate).getTime();
            const end = new Date(season.endDate).getTime();
            return selectedTime >= start && selectedTime <= end;
        });

        if (seasonal) {
            let modifiedTotal = baseTotal;

            if (seasonal.modifierType === "percentage") {
                modifiedTotal += (baseTotal * seasonal.modifier) / 100;
            } else if (seasonal.modifierType === "fixed") {
                modifiedTotal += seasonal.modifier;
            }

            seasonalPrice = Math.max(0, Math.round(modifiedTotal));
        }
    }

    return {
        basePrice: Math.max(0, Math.round(baseTotal)),
        seasonalPrice,
    };
};
