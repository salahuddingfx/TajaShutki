import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('acharu-cart-redux');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    return [];
  }
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      localStorage.setItem('acharu-cart-redux', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('acharu-cart-redux', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        localStorage.setItem('acharu-cart-redux', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('acharu-cart-redux');
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartWeight = (state) => state.cart.items.reduce((total, item) => total + item.weight * item.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
