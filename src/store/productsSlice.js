import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../api/api';
import { products as initialProducts } from '../data/products';

const loadProducts = () => {
  if (typeof window === 'undefined') return { products: [] };
  const saved = localStorage.getItem('tajashutki-products');
  if (saved) {
    try {
      return { products: JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading products from local storage', e);
    }
  }
  return {
    products: initialProducts.map(p => ({ ...p, siteId: 'site_2' })),
  };
};

const initialState = {
  ...loadProducts(),
  loading: false
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params) => {
    const response = await getProducts(params);
    return response.data.data || [];
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push({
        ...action.payload,
        id: Date.now().toString()
      });
      localStorage.setItem('acharu-products', JSON.stringify(state.products));
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        localStorage.setItem('acharu-products', JSON.stringify(state.products));
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      localStorage.setItem('acharu-products', JSON.stringify(state.products));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) return;
        state.products = action.payload.map(p => ({
          ...p,
          image: p.images && p.images.length > 0 ? p.images[0].image_path : p.image,
          siteId: 'site_2'
        }));
        localStorage.setItem('tajashutki-products', JSON.stringify(state.products));
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { addProduct, updateProduct, deleteProduct, syncInventory } = productsSlice.actions;

export const selectAllProducts = (state) => state.products.products;
export const selectProductsLoading = (state) => state.products.loading;

export const selectProductsBySite = createSelector(
  [selectAllProducts, (state, siteId) => siteId],
  (products, siteId) => {
    // Return early if no products or siteId
    if (!products || !siteId) return [];
    return products.filter(p => p.siteId === siteId);
  }
);

export default productsSlice.reducer;
