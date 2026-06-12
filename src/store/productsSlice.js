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
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    let safetyCounter = 0;
    const seenIds = new Set();
    
    while (hasMore && safetyCounter < 50) {
      safetyCounter++;
      const response = await getProducts({ ...params, page });
      const paginatedData = response?.data;
      
      if (paginatedData && Array.isArray(paginatedData.data) && paginatedData.data.length > 0) {
        for (const item of paginatedData.data) {
          if (item && item.id && !seenIds.has(item.id)) {
            seenIds.add(item.id);
            allProducts.push(item);
          }
        }
        if (paginatedData.current_page >= paginatedData.last_page) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }
    return allProducts;
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
