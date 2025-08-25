import { CheckoutWithCardResponse } from '../services/paymentApi';

export type RootStackParamList = {
  Splash: undefined;
  ProductsHome: undefined;
  ProductDetail: { productId: string };
  ProductSelection: undefined;
  Checkout: undefined;
  CreditCardForm: undefined;
  PaymentSummary: undefined;
  TransactionResult: { transactionData: CheckoutWithCardResponse };
};

export type ScreenName = keyof RootStackParamList;