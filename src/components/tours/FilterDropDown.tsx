// components/tours/FilterDropDown.tsx
"use client";

import { ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import FilterOptionsList from "./FilterOptionsList";

interface Option {
  value: string | number;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface Props {
  title: string;
  options: Option[];
  selected: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  multiSelect?: boolean;
}

export default function FilterDropdown({
  title,
  options,
  selected,
  onChange,
  multiSelect = true,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dan tashqariga click qilganda yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const enabledOptions = options.filter(
    (opt) => !opt.disabled || selected.includes(opt.value)
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 transition-all duration-200 py-2 rounded-lg border 
          ${open || selected.length ? "border-[#6EBB2D]" : "border-gray-200"} 
          hover:border-[#6EBB2D]/50 group`}
      >
        <span className="font-medium transition-all duration-200 group-hover:text-[#6EBB2D]">
          {title}
        </span>
        <ChevronUp
          size={18}
          className={`${open && "-rotate-180"} transition-all duration-200 group-hover:text-[#6EBB2D]`}
        />
      </button>

      {/* DROPDOWN (ONLY DESKTOP logic kept simplified, mobile handled by Global Filter in FilterTours) */}
      {open && enabledOptions.length > 0 && (
        <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 max-h-96 overflow-y-auto">
          <FilterOptionsList
            options={enabledOptions}
            selected={selected}
            onChange={onChange}
            multiSelect={multiSelect}
          />
        </div>
      )}
    </div>
  );
}
