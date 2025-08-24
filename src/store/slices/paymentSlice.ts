import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CreditCard {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  holderName: string;
  cardType?: 'VISA' | 'MASTERCARD' | 'UNKNOWN';
}

export interface PaymentData {
  creditCard: CreditCard | null;
  amount: number;
  currency: string;
}

interface PaymentState {
  paymentData: PaymentData;
  isProcessing: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentData: {
    creditCard: null,
    amount: 0,
    currency: 'COP',
  },
  isProcessing: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCreditCard: (state, action: PayloadAction<CreditCard>) => {
      state.paymentData.creditCard = action.payload;
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.paymentData.amount = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setPaymentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearPaymentData: (state) => {
      state.paymentData = {
        creditCard: null,
        amount: 0,
        currency: 'COP',
      };
      state.error = null;
    },
  },
});

export const {
  setCreditCard,
  setAmount,
  setProcessing,
  setPaymentError,
  clearPaymentData,
} = paymentSlice.actions;

export default paymentSlice.reducer;