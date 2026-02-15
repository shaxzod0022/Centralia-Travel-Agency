"use client";

import { useState } from "react";
import type { FC } from "react";
import { ChevronDown } from "lucide-react";
import { FaqsItem } from "@/interfaces/tour.interface";
import { styles } from "@/styles/styles";

interface FaqsProps {
  data: FaqsItem[];
}

const Faqs: FC<FaqsProps> = ({ data }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const sortedFaqs = [...data].sort((a, b) => a.displayOrder - b.displayOrder);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      {sortedFaqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div key={faq.id} className="border-b border-gray-400">
            {/* QUESTION */}
            <button
              type="button"
              onClick={() => toggle(faq.id)}
              className={`${styles.flexBetween} gap-2 ${styles.p} text-gray-900 font-semibold !flex-nowrap w-full p-2 text-left`}
            >
              <span>{faq.question}</span>

              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* ANSWER (animated) */}
            <div
              className={`px-2 overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
              `}
            >
              <p className={`${styles.p} pb-2 leading-relaxed`}>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Faqs;
