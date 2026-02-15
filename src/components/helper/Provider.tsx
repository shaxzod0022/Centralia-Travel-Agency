"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { initializeCart } from "@/store/cartSlice";

// 1. Ma'lumotni yuklovchi ichki komponent
function CartInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Endi useDispatch xato bermaydi, chunki u Provider ichida
    dispatch(initializeCart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeCart());

    // Har 1 daqiqada muddati o'tgan itemlarni tekshirish
    const interval = setInterval(() => {
      dispatch(initializeCart()); // initializeCart ichida expiry filtrini yozgan bo'lsangiz
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return <>{children}</>;
}

// 2. Asosiy Providers komponenti
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartInitializer>{children}</CartInitializer>
    </Provider>
  );
}
