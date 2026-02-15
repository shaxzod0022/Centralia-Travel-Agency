"use client";
import React, { useState, useMemo, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import {
  getDaysInMonth,
  isSameDay,
  isWithinRange,
  addDays,
  formatDateKey,
} from "@/utils/dateUtils";
import {
  SeasonalPricing,
  SelectedRange,
} from "@/interfaces/calendar.interface";
import { TourOption } from "@/interfaces/calendar.interface";
import { useLocale, useTranslations } from "next-intl";
import { styles } from "@/styles/styles";
import { Link } from "@/i18n/routing";
import { CalendarDays } from "lucide-react";

interface GlobalCalendarProps {
  tourOptions: TourOption;
  selectedRange: SelectedRange;
  onRangeChange: (range: SelectedRange) => void;
  onDateSelect?: (payload: { date: Date; type: "group" | "private" }) => void;
}

const GlobalCalendar: React.FC<GlobalCalendarProps> = ({
  tourOptions,
  onDateSelect,
  selectedRange,
  onRangeChange,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    // Reset time for comparison
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    if (!tourOptions?.options || tourOptions.options.length === 0) return now;

    // 1. Check for "always available" private tours (no date ranges)
    const hasOpenPrivate = tourOptions.options.some(
      (opt) =>
        opt.isActive &&
        opt.type === "private" &&
        (!opt.dateRanges || opt.dateRanges.length === 0),
    );

    if (hasOpenPrivate) return now;

    // 2. Find earliest date among date ranges
    let earliest: Date | null = null;
    tourOptions.options.forEach((opt) => {
      if (!opt.isActive) return;
      opt.dateRanges?.forEach((range) => {
        if (!range.isActive) return;
        const d = new Date(range.startDate);
        // Compare with todayStart to include tours starting today
        if (d >= todayStart) {
          if (!earliest || d < earliest) {
            earliest = d;
          }
        }
      });
    });

    return earliest || now;
  });
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const locale = useLocale();
  const t = useTranslations("tourDetails");
  const [call, setCall] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calculateFinalPrice = (
    basePrice: number,
    date: Date,
    seasonal: SeasonalPricing[],
  ) => {
    if (!seasonal || seasonal.length === 0) return basePrice;
    const activeModifier = seasonal.find((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return date >= start && date <= end;
    });
    if (!activeModifier) return basePrice;
    if (activeModifier.modifierType === "percentage") {
      return Math.round(basePrice * (1 + activeModifier.modifier / 100));
    } else {
      return basePrice + activeModifier.modifier;
    }
  };

  const dayPricingInfo = useMemo(() => {
    const info: Record<string, { price: number; type: "group" | "private" }> =
      {};
    const daysList = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth(),
    );

    daysList.forEach((day) => {
      if (!day.isCurrentMonth || day.date < today) return;

      const key = formatDateKey(day.date);
      let bestPrice = Infinity;
      let bestType: "group" | "private" = "private";

      if (!tourOptions?.options || tourOptions.options.length === 0)
        return info;

      tourOptions.options.forEach((opt) => {
        if (!opt.isActive) return;

        let basePrice = 0;
        if (opt.pricing.mode === "PER_PERSON") {
          basePrice =
            opt.pricing.ageCategories.find((c) => c.category === "adult")
              ?.price || 0;
        } else {
          basePrice = opt.pricing.personRanges[0]?.price || 0;
        }

        if (basePrice <= 0) return;
        const finalPrice = calculateFinalPrice(
          basePrice,
          day.date,
          opt.pricing.seasonalPricing || [],
        );

        if (opt.type === "private") {
          if (finalPrice < bestPrice) {
            bestPrice = finalPrice;
            bestType = "private";
          }
        } else {
          const isMatch = opt.dateRanges?.some(
            (r) => r.isActive && isSameDay(new Date(r.startDate), day.date),
          );
          if (isMatch && finalPrice < bestPrice) {
            bestPrice = finalPrice;
            bestType = "group";
          }
        }
      });

      if (bestPrice !== Infinity) {
        info[key] = { price: bestPrice, type: bestType };
      }
    });
    return info;
  }, [currentDate, tourOptions, today]);

  const days = useMemo(
    () => getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );

  const handleDayClick = (date: Date) => {
    if (date < today) return;
    const info = dayPricingInfo[formatDateKey(date)];
    if (!info) return;
    const start = new Date(date);
    let duration = 1;
    const bestOption = tourOptions.options.find((opt) => {
      if (!opt.isActive) return false;
      if (info.type === "group" && opt.type === "group") {
        return opt.dateRanges.some((r) =>
          isSameDay(new Date(r.startDate), date),
        );
      }
      return info.type === "private" && opt.type === "private";
    });
    if (bestOption) {
      if (info.type === "group") {
        const match = bestOption.dateRanges.find((r) =>
          isSameDay(new Date(r.startDate), date),
        );
        if (match) {
          const d1 = new Date(match.startDate);
          const d2 = new Date(match.endDate);
          d1.setHours(0, 0, 0, 0);
          d2.setHours(0, 0, 0, 0);
          duration = Math.round(
            (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
          );
        }
      } else if (tourOptions.days > 0) {
        duration = Math.max(0, tourOptions.days - 1);
      }
    }

    const newRange = {
      start,
      end: addDays(start, duration),
    };

    onRangeChange(newRange);
    setSelectedPrice(info.price);
    onDateSelect?.({
      date: start,
      type: info.type,
    });
  };

  const weekdayNames = useMemo(() => {
    const baseDate = new Date(2025, 0, 5);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      // Normalize to lowercase to prevent hydration mismatch between server/client
      return new Intl.DateTimeFormat(locale, { weekday: "short" })
        .format(date)
        .replace(".", "")
        .toLowerCase();
    });
  }, [locale]);

  const formatPrice = () => {
    let minPrice: number | undefined;

    for (const option of tourOptions.options) {
      if (option.type === "group") {
        const price = option.pricing.ageCategories.find(
          (cat) => cat.category === "adult",
        )?.price;
        if (price && (minPrice === undefined || price < minPrice)) {
          minPrice = price;
        }
      } else {
        const price = option.pricing.personRanges[0]?.price;
        if (price && (minPrice === undefined || price < minPrice)) {
          minPrice = price;
        }
      }
    }

    return minPrice ? `$${minPrice}` : "N/A";
  };

  if (!isMounted) {
    return (
      <div className="py-8 px-4 space-y-4">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-20 bg-gray-200 rounded-xl w-full"></div>
          <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 space-y-4">
      <div className={`${styles.flexBetween}`}>
        <div>
          <p className={`${styles.p} font-semibold`}>{t("price")}</p>
          <p className={`${styles.h3} font-bold !text-black !leading-6`}>
            {t("from")}
          </p>
        </div>
        <p className={`${styles.h2} font-bold text-black`}>{formatPrice()}</p>
      </div>
      <div
        className={`${styles.flexCenter} mb-4 gap-3 border-y border-gray-300`}
      >
        <button
          onClick={() => setCall(false)}
          className={`w-[40%] py-4 ${!call ? "text-[#6EBB2D]" : "text-gray-700"}`}
        >
          {t("enquery")}
        </button>
        <span className="h-6 w-[1px] bg-gray-300"></span>
        <button
          onClick={() => setCall(true)}
          className={`w-[40%] py-4 ${call ? "text-[#6EBB2D]" : "text-gray-700"}`}
        >
          {t("bookingCall")}
        </button>
      </div>
      {call ? (
        <div
          className={`border border-[#6EBB2D] rounded-xl p-4 gap-3 ${styles.flex}`}
        >
          <div className="overflow-hidden w-20 h-20 shrink-0 rounded-full">
            <img
              className="w-full"
              src="/icons/tour-operator.jpg"
              alt="Centralia Travel Agency Tour Operator"
            />
          </div>
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="font-bold">{t("agentName")}</span>
              <img
                className="inline"
                src="/icons/check.svg"
                alt="Centralia Travel Agency Tour Operator"
              />
              <span>{t("travelAgent")}</span>
            </div>
            <Link
              className="bg-[#383838] flex justify-center text-center gap-2 text-white py-1 px-5 rounded-md"
              href={`tel:+998 94 501 92 72`}
            >
              <CalendarDays className="w-5" />
              {t("bookingCall")}
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <CalendarHeader
            currentDate={currentDate}
            locale={locale}
            onPrevMonth={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1,
                ),
              )
            }
            onNextMonth={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1,
                ),
              )
            }
          />

          <div className="grid grid-cols-7 mb-4 border-b-2 border-[#6EBB2D] pb-2">
            {weekdayNames.map((day, i) => (
              <div
                key={i}
                className="text-center font-bold text-xs text-slate-400 uppercase tracking-widest"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day, index) => {
              const key = formatDateKey(day.date);
              const info = dayPricingInfo[key];
              const isSelectedStart = selectedRange.start
                ? isSameDay(day.date, selectedRange.start)
                : false;
              const isSelectedEnd = selectedRange.end
                ? isSameDay(day.date, selectedRange.end)
                : false;
              const isInRange =
                selectedRange.start && selectedRange.end
                  ? isWithinRange(
                    day.date,
                    selectedRange.start,
                    selectedRange.end,
                  )
                  : false;

              let displayPrice = info?.price;
              if (isInRange) {
                displayPrice =
                  isSelectedStart || isSelectedEnd
                    ? (selectedPrice ?? info?.price)
                    : 0;
              }

              return (
                <CalendarDay
                  key={index}
                  date={day.date}
                  isCurrentMonth={day.isCurrentMonth}
                  price={displayPrice}
                  isGroup={info?.type === "group"}
                  isSelectedStart={isSelectedStart}
                  isSelectedEnd={isSelectedEnd}
                  isInRange={isInRange}
                  isDisabled={day.date < today || (!info && day.isCurrentMonth)}
                  onClick={handleDayClick}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalCalendar;
