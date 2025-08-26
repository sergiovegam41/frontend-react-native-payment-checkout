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
  // Prices are now in cents, so we multiply directly without parsing
  const totalAmount = items.reduce(
    (sum: number, item: CartItem) => sum + (item.product.price * item.quantity),
    0
  );
  
  // Validate that total amount doesn't exceed maximum safe value (in cents)
  // PostgreSQL INT4 max value is 2,147,483,647 cents
  const MAX_SAFE_AMOUNT = 2000000000; // ~2 billion cents (~20 million COP)
  if (totalAmount > MAX_SAFE_AMOUNT) {
    const amountInCOP = totalAmount / 100;
    console.warn(`Cart total ${amountInCOP} COP (${totalAmount} cents) exceeds safe limit`);
  }
  
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
      
      // Create a temporary copy to test the new total
      let tempItems = [...state.items];
      if (existingItem) {
        tempItems = tempItems.map(item => 
          item.product.id === action.payload.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        tempItems.push({ product: action.payload, quantity: 1 });
      }
      
      const tempTotals = calculateTotals(tempItems);
      const MAX_SAFE_AMOUNT = 2000000000; // ~2 billion cents (~20 million COP)
      
      // Only update if it won't exceed the limit
      if (tempTotals.totalAmount <= MAX_SAFE_AMOUNT) {
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ product: action.payload, quantity: 1 });
        }
        
        state.totalItems = tempTotals.totalItems;
        state.totalAmount = tempTotals.totalAmount;
      } else {
        console.warn('Cannot add item: would exceed maximum cart value');
      }
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
        // Create a temporary copy to test the new total
        const tempItems = state.items.map(cartItem =>
          cartItem.product.id === action.payload.productId
            ? { ...cartItem, quantity: action.payload.quantity }
            : cartItem
        );
        
        const tempTotals = calculateTotals(tempItems);
        const MAX_SAFE_AMOUNT = 2000000000; // ~2 billion cents (~20 million COP)
        
        // Only update if it won't exceed the limit
        if (tempTotals.totalAmount <= MAX_SAFE_AMOUNT) {
          item.quantity = action.payload.quantity;
          state.totalItems = tempTotals.totalItems;
          state.totalAmount = tempTotals.totalAmount;
        } else {
          console.warn('Cannot update quantity: would exceed maximum cart value');
        }
      }
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