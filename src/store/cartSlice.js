import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem('tajashutki-cart-redux');
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
      const { product, quantity = 1, selectedVariation } = action.payload;
      
      const cartItemId = selectedVariation 
        ? `${product.id}-${selectedVariation.id}` 
        : product.id;

      const existingItem = state.items.find(item => item.cartItemId === cartItemId || item.id === cartItemId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const itemPrice = selectedVariation ? selectedVariation.price : product.price;
        const itemWeight = selectedVariation ? selectedVariation.weight : product.weight;

        state.items.push({ 
          ...product, 
          cartItemId,
          variation_id: selectedVariation ? selectedVariation.id : null,
          variation_info: selectedVariation ? selectedVariation.weight : null,
          price: itemPrice,
          weight: itemWeight,
          original_product_weight: product.weight,
          quantity 
        });
      }
      localStorage.setItem('tajashutki-cart-redux', JSON.stringify(state.items));
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => (item.cartItemId || item.id) !== action.payload);
      localStorage.setItem('tajashutki-cart-redux', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => (item.cartItemId || item.id) === id);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          state.items = state.items.filter(i => (i.cartItemId || i.id) !== id);
        }
        localStorage.setItem('tajashutki-cart-redux', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('tajashutki-cart-redux');
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
