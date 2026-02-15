// components/tour/AddOnsSelector.tsx
"use client";

import { AddOns } from "@/interfaces/addOns.interface";
import { styles } from "@/styles/styles";
import { Check, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddOnsSelectorProps {
  addOns: AddOns[];
  participants: {
    adults: number;
    children: number;
    infants: number;
  };
  selectedAddOns: Record<number, number>;
  onSelectAddOn: (addOnId: number) => void;
  onQuantityChange: (addOnId: number, quantity: number) => void;
}

const AddOnsSelector = ({
  addOns,
  selectedAddOns,
  onSelectAddOn,
  onQuantityChange,
  participants,
}: AddOnsSelectorProps) => {
  const t = useTranslations("addOns");

  return (
    <div className="space-y-4 mt-6">
      <h3 className={`${styles.h4}`}>{t("title")}</h3>
      <div className="space-y-3">
        {addOns
          .filter((addOn) => addOn.isActive)
          .map((addOn) => {
            const isSelected = !!selectedAddOns[addOn.id];
            const quantity = selectedAddOns[addOn.id] || 0;

            return (
              <div
                key={addOn.id}
                className={`border rounded-xl p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-[#6EBB2D] bg-green-50"
                    : "border-gray-200 hover:border-green-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`${styles.h4}`}>{addOn.name}</h4>
                        <p className={`${styles.p}`}>{addOn.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectAddOn(addOn.id)}
                        className={`border ml-4 p-1 rounded w-9 h-9 ${
                          isSelected
                            ? "border-[#6EBB2D] text-[#6EBB2D]"
                            : "text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected ? <Check /> : <Plus />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#6EBB2D]">
                          ${addOn.price} {addOn.currency}
                        </span>
                        <span className={`${styles.span}`}>
                          {addOn.chargeType === "per_person"
                            ? t("perPerson")
                            : t("perGroup")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity selector faqat tanlangan bo'lsa */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className={`${styles.span}`}>{t("quantity")}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            onQuantityChange(addOn.id, quantity - 1)
                          }
                          className="w-8 h-8 flex items-center p-1 justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          <Minus />
                        </button>
                        <span className="font-medium">{quantity}</span>
                        <button
                          disabled={
                            addOn.chargeType === "per_person"
                              ? quantity >=
                                participants.adults +
                                  participants.children +
                                  participants.infants
                              : false
                          }
                          type="button"
                          onClick={() =>
                            onQuantityChange(addOn.id, quantity + 1)
                          }
                          className="w-8 h-8 flex items-center p-1 justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                          <Plus />
                        </button>
                      </div>
                    </div>
                    {addOn.chargeType === "per_person" && (
                      <div className={`${styles.span}`}>
                        {t("total")}: ${addOn.price * quantity}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AddOnsSelector;
