import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./langSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
