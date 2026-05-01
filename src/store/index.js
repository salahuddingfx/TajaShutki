import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/cartSlice';
import settingsReducer from '@/store/settingsSlice';
import productsReducer from '@/store/productsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    settings: settingsReducer,
    products: productsReducer,
  },
});
