import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, PaginationInfo } from '../../types/api';

interface ProductsState {
  products: Product[];
  pagination: PaginationInfo | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialState: ProductsState = {
  products: [],
  pagination: null,
  loading: false,
  loadingMore: false,
  error: null,
  refreshing: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    appendProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = [...state.products, ...action.payload];
    },
    setPagination: (state, action: PayloadAction<PaginationInfo>) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.loadingMore = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
      state.pagination = null;
      state.error = null;
    },
  },
});

export const { 
  setProducts, 
  appendProducts, 
  setPagination, 
  setLoading, 
  setLoadingMore, 
  setRefreshing, 
  setError, 
  clearProducts 
} = productsSlice.actions;

export default productsSlice.reducer;