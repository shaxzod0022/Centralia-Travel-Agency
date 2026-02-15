import { LocationPoint } from "@/interfaces/calendar.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string; // Noyob ID qo'shildi
  slug: string;
  price: number;
  calendarRange: { start: string | null; end: string | null };
  showOption: boolean;
  tourType: "group" | "private" | null;
  optionId: number | null;
  tourImage: string;
  tourTitle: string;
  tourId: number;
  date: string;
  expiresAt: number;
  participants: {
    adults: number;
    children: number;
    infants: number;
  };
  addOns: { id: number; quantity: number }[];
  meetingPointData: LocationPoint | null;
  pickupLocationData: { lat: number; lng: number } | null;
}

interface CartState {
  data: CartItem[];
  isLoaded: boolean; // SSR uchun flag
}

const initialState: CartState = {
  data: [],
  isLoaded: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeFromCartById: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      saveToLocalStorage(state.data);
    },
    // LocalStorage-dan yuklash uchun maxsus action
    initializeCart: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("cart");
        if (stored) {
          const parsedData: CartItem[] = JSON.parse(stored);
          const now = Date.now();
          // Faqat muddati tugamaganlarini saqlab qolamiz
          const validData = parsedData.filter((item) => item.expiresAt > now);

          state.data = validData;
          // Tozalangan ma'lumotni qayta saqlaymiz
          localStorage.setItem("cart", JSON.stringify(validData));
        }
        state.isLoaded = true;
      }
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Bir xil tur va sanadagi element borligini tekshirish (ixtiyoriy)
      const existingIdx = state.data.findIndex(
        (item) =>
          item.slug === action.payload.slug &&
          item.date === action.payload.date,
      );

      if (existingIdx > -1) {
        // Agar bo'lsa, ustiga yozish yoki sonini oshirish mumkin
        state.data[existingIdx] = action.payload;
      } else {
        state.data.push(action.payload);
      }

      saveToLocalStorage(state.data);
    },

    updateCartItem: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<CartItem> }>,
    ) => {
      const { id, changes } = action.payload;
      const idx = state.data.findIndex((i) => i.id === id);
      if (idx !== -1) {
        state.data[idx] = { ...state.data[idx], ...changes };
        saveToLocalStorage(state.data);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      saveToLocalStorage(state.data);
    },

    clearCart: (state) => {
      state.data = [];
      localStorage.removeItem("cart");
    },
  },
});

// Helper funksiyani slice ichida ishlatish uchun
const saveToLocalStorage = (data: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(data));
  }
};

export const {
  initializeCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  removeFromCartById,
} = cartSlice.actions;
export default cartSlice.reducer;
