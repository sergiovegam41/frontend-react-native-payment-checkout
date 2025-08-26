import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import paymentReducer from './slices/paymentSlice';
import transactionsReducer from './slices/transactionsSlice';

// Simple store for testing without persistence
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  payment: paymentReducer,
  transactions: transactionsReducer,
});

export const testStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type TestRootState = ReturnType<typeof testStore.getState>;
export type TestAppDispatch = typeof testStore.dispatch;