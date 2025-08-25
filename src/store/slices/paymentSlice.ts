import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  CreditCardForm, 
  TransactionState, 
  PaymentError, 
  CreateTransactionRequest,
  CreateTransactionResponse 
} from '../../types/payment';
import { paymentApi } from '../../services/paymentApi';

interface PaymentState {
  cardData: CreditCardForm | null;
  currentTransaction: TransactionState | null;
  isProcessing: boolean;
  error: PaymentError | null;
  transactionHistory: TransactionState[];
}

const initialState: PaymentState = {
  cardData: null,
  currentTransaction: null,
  isProcessing: false,
  error: null,
  transactionHistory: [],
};

// Async thunks for payment processing
export const createTransaction = createAsyncThunk<
  CreateTransactionResponse,
  CreateTransactionRequest,
  { rejectValue: PaymentError }
>(
  'payment/createTransaction',
  async (request, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createTransaction(request);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: 'TRANSACTION_FAILED',
        message: error.message || 'Failed to create transaction',
        details: error,
      });
    }
  }
);

export const checkTransactionStatus = createAsyncThunk<
  TransactionState,
  string,
  { rejectValue: PaymentError }
>(
  'payment/checkTransactionStatus',
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await paymentApi.checkTransactionStatus(transactionId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to check status');
      }
      return response.transaction;
    } catch (error: any) {
      return rejectWithValue({
        code: 'STATUS_CHECK_FAILED',
        message: error.message || 'Failed to check transaction status',
        details: error,
      });
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCreditCard: (state, action: PayloadAction<CreditCardForm>) => {
      state.cardData = action.payload;
      state.error = null;
    },
    setPaymentError: (state, action: PayloadAction<PaymentError | null>) => {
      state.error = action.payload;
    },
    clearPaymentData: (state) => {
      state.cardData = null;
      state.currentTransaction = null;
      state.error = null;
      state.isProcessing = false;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
      state.error = null;
      state.isProcessing = false;
    },
    addToTransactionHistory: (state, action: PayloadAction<TransactionState>) => {
      state.transactionHistory.unshift(action.payload);
      // Keep only last 50 transactions
      if (state.transactionHistory.length > 50) {
        state.transactionHistory = state.transactionHistory.slice(0, 50);
      }
    },
  },
  extraReducers: (builder) => {
    // Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload.success) {
          state.currentTransaction = action.payload.transaction;
          state.transactionHistory.unshift(action.payload.transaction);
        } else {
          state.error = action.payload.error || null;
        }
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        };
      });

    // Check Transaction Status
    builder
      .addCase(checkTransactionStatus.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(checkTransactionStatus.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentTransaction = action.payload;
        
        // Update in history if exists
        const historyIndex = state.transactionHistory.findIndex(
          t => t.id === action.payload.id
        );
        if (historyIndex !== -1) {
          state.transactionHistory[historyIndex] = action.payload;
        }
      })
      .addCase(checkTransactionStatus.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload || {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to check transaction status',
        };
      });
  },
});

export const {
  setCreditCard,
  setPaymentError,
  clearPaymentData,
  clearCurrentTransaction,
  addToTransactionHistory,
} = paymentSlice.actions;

export default paymentSlice.reducer;