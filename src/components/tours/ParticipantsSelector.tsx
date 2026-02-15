"use client";
import { Minus, Plus } from "lucide-react";
import { Option } from "@/interfaces/calendar.interface";
import { useTranslations } from "next-intl";

interface ParticipantsSelectorProps {
  selectedOption?: Option;
  ageRanges: {
    min: number;
    max: number;
  };
  participants: {
    adults: number;
    children: number;
    infants: number;
  };
  onChange: (participants: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
}

export default function ParticipantsSelector({
  selectedOption,
  participants,
  onChange,
  ageRanges,
}: ParticipantsSelectorProps) {
  const updateParticipants = (
    type: "adults" | "children" | "infants",
    value: number,
  ) => {
    const newValue = Math.max(0, value);
    onChange({
      ...participants,
      [type]: newValue,
    });
  };

  if (!selectedOption) return null;

  const isPerGroupPricing = selectedOption.pricing.mode === "PER_GROUP";
  const totalParticipants =
    participants.adults + participants.children + participants.infants;
  // For group tours, check min/max participants
  if (isPerGroupPricing && totalParticipants < selectedOption.minParticipants) {
    // Auto-adjust to min participants
    if (totalParticipants < selectedOption.minParticipants) {
      const needed = selectedOption.minParticipants - totalParticipants;
      onChange({
        ...participants,
        adults: participants.adults + needed,
      });
    }
  }

  const t = useTranslations("tourDetails");

  const adultMinAge =
    selectedOption.pricing.ageCategories.find((cat) => cat.category === "adult")
      ?.ageMin || 0;
  const adultMaxAge =
    selectedOption.pricing.ageCategories.find((cat) => cat.category === "adult")
      ?.ageMax || 0;
  const adultPrice =
    selectedOption.pricing.ageCategories.find((cat) => cat.category === "adult")
      ?.price || 0;

  const childMinAge =
    selectedOption.pricing.ageCategories.find((cat) => cat.category === "child")
      ?.ageMin || 0;
  const childMaxAge =
    selectedOption.pricing.ageCategories.find((cat) => cat.category === "child")
      ?.ageMax || 0;
  const childPrice = selectedOption.pricing.ageCategories.find(
    (cat) => cat.category === "child",
  )?.price;

  const infantMinAge =
    selectedOption.pricing.ageCategories.find(
      (cat) => cat.category === "infant",
    )?.ageMin || 0;
  const infantMaxAge =
    selectedOption.pricing.ageCategories.find(
      (cat) => cat.category === "infant",
    )?.ageMax || 0;
  const infantPrice =
    selectedOption.pricing.ageCategories.find(
      (cat) => cat.category === "infant",
    )?.price || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{t("selectPar")}</h3>

      {isPerGroupPricing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">
                {t("groupSize")}{" "}
                {selectedOption.pricing.personRanges?.map((range, idx) => (
                  <span
                    key={idx}
                    className={`text-[#6EBB2D] ${
                      totalParticipants >= range.fromPerson &&
                      totalParticipants <= range.toPerson
                        ? "inline"
                        : "hidden"
                    }`}
                  >
                    (${range.price})
                  </span>
                ))}
              </p>
              <p className="text-sm text-gray-500">
                {t("min")}: {selectedOption.minParticipants}, {t("max")}:{" "}
                {selectedOption.maxParticipants}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  updateParticipants("adults", participants.adults - 1)
                }
                disabled={totalParticipants <= selectedOption.minParticipants}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-gray-900">
                {totalParticipants}
              </span>
              <button
                onClick={() =>
                  updateParticipants("adults", participants.adults + 1)
                }
                disabled={totalParticipants >= selectedOption.maxParticipants}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Adults */}
          {adultMinAge >= ageRanges.min && adultMaxAge <= ageRanges.max && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  {t("adults")} ({adultMinAge || 13} - {adultMaxAge || 60})
                </p>
                <p className="text-sm text-gray-500">
                  ${adultPrice || 0} {t("perPerson")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    updateParticipants("adults", participants.adults - 1)
                  }
                  disabled={participants.adults <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-gray-900">
                  {participants.adults}
                </span>
                <button
                  onClick={() =>
                    updateParticipants("adults", participants.adults + 1)
                  }
                  disabled={totalParticipants >= selectedOption.maxParticipants}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Children */}
          {childMinAge >= ageRanges.min && childMaxAge <= ageRanges.max && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  {t("children")} ({childMinAge || 6} - {childMaxAge || 12})
                </p>
                <p className="text-sm text-gray-500">
                  ${childPrice || 0} {t("perPerson")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    updateParticipants("children", participants.children - 1)
                  }
                  disabled={participants.children <= 0}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-gray-900">
                  {participants.children}
                </span>
                <button
                  onClick={() =>
                    updateParticipants("children", participants.children + 1)
                  }
                  disabled={totalParticipants >= selectedOption.maxParticipants}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Infants */}
          {infantMinAge >= ageRanges.min && infantMaxAge <= ageRanges.max && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">
                  {t("infants")} ({infantMinAge || 0} - {infantMaxAge || 5})
                </p>
                {selectedOption.pricing.ageCategories.find(
                  (cat) => cat.category === "infant",
                )?.price === 0 ? (
                  <p className="text-sm text-gray-500">{t("free")}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    ${infantPrice || 0} {t("perPerson")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    updateParticipants("infants", participants.infants - 1)
                  }
                  disabled={participants.infants <= 0}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-gray-900">
                  {participants.infants}
                </span>
                <button
                  onClick={() =>
                    updateParticipants("infants", participants.infants + 1)
                  }
                  disabled={totalParticipants >= selectedOption.maxParticipants}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Total Participants Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">{t("totalPar")}:</span>
          <span className="font-bold text-gray-900">{totalParticipants}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-600">{t("availFor")}:</span>
          <span className="font-medium text-gray-700">
            {selectedOption.minParticipants}-{selectedOption.maxParticipants}{" "}
            {t("people")}
          </span>
        </div>
      </div>
    </div>
  );
}
