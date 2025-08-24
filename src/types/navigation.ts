export type RootStackParamList = {
  Splash: undefined;
  ProductsHome: undefined;
  ProductSelection: undefined;
  Checkout: undefined;
  CreditCardForm: undefined;
  PaymentSummary: undefined;
  TransactionResult: { transactionId: string };
};

export type ScreenName = keyof RootStackParamList;