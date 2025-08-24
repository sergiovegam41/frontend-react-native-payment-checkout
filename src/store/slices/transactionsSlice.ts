import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  paymentMethod: string;
  createdAt: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  wompiTransactionId?: string;
}

interface TransactionsState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  currentTransaction: null,
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    createTransaction: (state, action: PayloadAction<Omit<Transaction, 'id' | 'createdAt'>>) => {
      const transaction: Transaction = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      state.transactions.push(transaction);
      state.currentTransaction = transaction;
    },
    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Transaction> }>
    ) => {
      const index = state.transactions.findIndex(
        transaction => transaction.id === action.payload.id
      );
      
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload.updates,
        };
        
        if (state.currentTransaction?.id === action.payload.id) {
          state.currentTransaction = state.transactions[index];
        }
      }
    },
    setCurrentTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.currentTransaction = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  createTransaction,
  updateTransaction,
  setCurrentTransaction,
  setLoading,
  setError,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;