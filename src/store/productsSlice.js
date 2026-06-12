import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../api/api';

const initialState = {
  products: [],
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
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    syncInventory: (state, action) => {
      state.products = action.payload;
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
        // Deduplicate by id before storing
        const seen = new Set();
        state.products = action.payload
          .filter(p => {
            if (!p || !p.id || seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          })
          .map(p => ({
            ...p,
            image: p.images && p.images.length > 0 ? p.images[0].image_path : p.image,
            siteId: 'site_2'
          }));
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
    if (!products || !siteId) return [];
    return products.filter(p => p.siteId === siteId);
  }
);

export default productsSlice.reducer;
