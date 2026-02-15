// components/cart/CartItemCard.tsx
"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CartItem, removeFromCart } from "@/store/cartSlice";
import {
  Timer,
  Trash2,
  ChevronRight,
  Users,
  CalendarDays,
  TicketsPlane,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { styles } from "@/styles/styles";
import { useLocale, useTranslations } from "next-intl";

export default function CartItemCard({ item }: { item: CartItem }) {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const t = useTranslations("cart");
  const locale = useLocale();

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const distance = item.expiresAt - now;

      if (distance <= 0) {
        dispatch(removeFromCart(item.id));
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [item, dispatch]);

  return (
    <div className="bg-white border border-gray-300 border-b-4 border-b-[#6EBB2D] rounded-2xl p-3 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Tour Image */}
      <div className="relative w-full h-48 md:h-auto md:w-48 shrink-0">
        <Image
          src={item.tourImage}
          alt={item.tourTitle}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Tour Details */}
      <div className="flex-1">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded flex items-center gap-2 font-medium w-fit">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>
                {t("reserving")} {timeLeft}
              </span>
            </div>
            <span className="text-[#6EBB2D] font-bold text-xl">
              ${item.price}
            </span>
          </div>

          <h3 className={`${styles.h4} font-bold sm:line-clamp-1 line-clamp-3`}>
            {item.tourTitle}
          </h3>
        </div>

        <div className={`${styles.flexBetween} gap-6 items-end-safe`}>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-[#056D50]" />
                <span>
                  {item.participants.adults !== 0 && (
                    <>
                      {item.participants.adults} {t("adult")},
                    </>
                  )}{" "}
                  {item.participants.children !== 0 && (
                    <>
                      {item.participants.children} {t("child")},
                    </>
                  )}{" "}
                  {item.participants.infants !== 0 && (
                    <>
                      {item.participants.infants} {t("infant")}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-[#056D50]" />
                <span>
                  {item.date && (
                    <>
                      {new Intl.DateTimeFormat(locale, {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(item.date))}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <TicketsPlane className="w-4 h-4 text-[#056D50]" />
                <span>{item.tourType && t(`${item.tourType}`)}</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-3 col-span-1">
            <Link
              href={`/tours/${item.slug}`}
              className="bg-[#6EBB2D] hover:bg-[#5da825] text-white px-4 sm:py-2 py-1 rounded-lg font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-[0.98] flex items-center"
            >
              {t("datail")} <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-red-100 transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
