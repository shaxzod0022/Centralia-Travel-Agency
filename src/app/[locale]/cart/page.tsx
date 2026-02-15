// app/[locale]/cart/page.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CartItemCard } from "@/components";
import { styles } from "@/styles/styles";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.data);
  const t = useTranslations("cart");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div
        className={`${styles.paddingCont} xl:!pt-32 !pt-24 text-center py-32`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6EBB2D] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className={`${styles.paddingCont} min-h-screen xl:!pt-32 !pt-24`}>
      {cartItems.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className={`${styles.h2}`}>{t("emptyTitle")}</h2>
          <p className={`${styles.p} mb-6`}>{t("emptyDesc")}</p>
          <Link
            href="/tours"
            className="bg-[#6EBB2D] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5da825] transition-colors"
          >
            {t("goTours")}
          </Link>
        </div>
      ) : (
        <div>
          <h2 className={`${styles.h2} mb-5`}>{t("shoppingCart")}</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
