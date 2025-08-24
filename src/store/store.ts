import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import EncryptedStorage from 'react-native-encrypted-storage';
import { combineReducers } from '@reduxjs/toolkit';

import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import transactionsReducer from './slices/transactionsSlice';
import paymentReducer from './slices/paymentSlice';

const persistConfig = {
  key: 'root',
  storage: EncryptedStorage,
  whitelist: ['cart', 'transactions', 'payment'],
};

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  transactions: transactionsReducer,
  payment: paymentReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;