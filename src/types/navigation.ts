export type RootStackParamList = {
  Splash: undefined;
  ProductsHome: undefined;
  ProductDetail: { productId: string };
  ProductSelection: undefined;
  Checkout: undefined;
  CreditCardForm: undefined;
  PaymentSummary: undefined;
  TransactionResult: { transactionId: string };
};

export type ScreenName = keyof RootStackParamList;