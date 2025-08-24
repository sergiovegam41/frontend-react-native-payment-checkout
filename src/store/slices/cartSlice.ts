import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../../types/api';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum: number, item: CartItem) => sum + (parseFloat(item.product.price) * item.quantity),
    0
  );
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item: CartItem) => item.product.id === action.payload.id
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item: CartItem) => item.product.id !== action.payload
      );
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item: CartItem) => item.product.id === action.payload.productId
      );
      
      if (item) {
        item.quantity = action.payload.quantity;
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;