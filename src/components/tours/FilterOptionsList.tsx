// components/tours/FilterOptionsList.tsx
"use client";

import { styles } from "@/styles/styles";
import {
    CheckCircle,
    CheckSquare,
    Circle,
    Square,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Option {
    value: string | number;
    label: string;
    count?: number;
    disabled?: boolean;
}

interface Props {
    options: Option[];
    selected: (string | number)[];
    onChange: (values: (string | number)[]) => void;
    multiSelect?: boolean;
}

export default function FilterOptionsList({
    options,
    selected,
    onChange,
    multiSelect = true,
}: Props) {
    const t = useTranslations("filter");

    const toggle = (value: string | number) => {
        if (multiSelect) {
            if (selected.includes(value)) {
                onChange(selected.filter((v) => v !== value));
            } else {
                onChange([...selected, value]);
            }
        } else {
            // Single select
            if (selected.includes(value)) {
                onChange([]);
            } else {
                onChange([value]);
            }
        }
    };

    return (
        <>
            {options.map((opt) => {
                const isSelected = selected.includes(opt.value);

                return (
                    <label
                        key={opt.value}
                        onClick={() => !opt.disabled && toggle(opt.value)}
                        className={`flex items-center justify-between gap-1 cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-50 ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <div className="flex items-center gap-2">
                            {/* ICON */}
                            {multiSelect ? (
                                isSelected ? (
                                    <CheckSquare size={18} className="shrink-0 text-[#6EBB2D]" />
                                ) : (
                                    <Square size={18} className="shrink-0 text-gray-400" />
                                )
                            ) : isSelected ? (
                                <CheckCircle size={18} className="shrink-0 text-[#6EBB2D]" />
                            ) : (
                                <Circle size={18} className="shrink-0 text-gray-400" />
                            )}

                            <span className="text-sm select-none">
                                {opt.label === "jan" ||
                                    opt.label === "feb" ||
                                    opt.label === "mar" ||
                                    opt.label === "apr" ||
                                    opt.label === "may" ||
                                    opt.label === "jun" ||
                                    opt.label === "jul" ||
                                    opt.label === "aug" ||
                                    opt.label === "sep" ||
                                    opt.label === "oct" ||
                                    opt.label === "nov" ||
                                    opt.label === "dec"
                                    ? t(`${opt.label}`)
                                    : opt.label}
                            </span>
                        </div>
                        {opt.count !== undefined && (
                            <span
                                className={`${styles.flexCenter} shrink-0 text-xs w-5 h-5 border border-gray-200 bg-gray-100 rounded-full`}
                            >
                                {opt.count}
                            </span>
                        )}
                    </label>
                );
            })}
        </>
    );
}
