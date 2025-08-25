// Payment types following Wompi API structure and requirements

export interface WompiCustomer {
  email: string;
  full_name: string;
  phone_number: string;
  legal_id: string;
  legal_id_type: 'CC' | 'CE' | 'NIT' | 'PP';
}

export interface WompiShippingAddress {
  address_line_1: string;
  address_line_2?: string;
  country: 'CO'; // Colombia only for now
  region: string;
  city: string;
  name: string;
  phone_number: string;
  postal_code?: string;
}

export interface WompiPaymentMethod {
  type: 'CARD';
  token?: string; // For tokenized cards
  installments?: number;
}

export interface WompiCardInfo {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface WompiTransaction {
  amount_in_cents: number;
  currency: 'COP';
  customer_email: string;
  payment_method: WompiPaymentMethod;
  reference: string;
  customer_data?: WompiCustomer;
  shipping_address?: WompiShippingAddress;
  redirect_url?: string;
  payment_source_id?: number;
}

export interface WompiTransactionResponse {
  id: string;
  amount_in_cents: number;
  currency: 'COP';
  customer_email: string;
  reference: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
  status_message: string;
  shipping_address?: WompiShippingAddress;
  payment_method_type: 'CARD';
  payment_method?: {
    type: 'CARD';
    extra: {
      bin: string;
      name: string;
      brand: string;
      exp_year: string;
      exp_month: string;
      last_four: string;
      card_holder: string;
    };
  };
  created_at: string;
  finalized_at?: string;
}

export interface PaymentSource {
  id: number;
  type: 'CARD';
  status: 'AVAILABLE' | 'UNAVAILABLE';
  customer_email: string;
  created_at: string;
  card?: {
    bin: string;
    exp_year: string;
    exp_month: string;
    last_four: string;
    card_holder: string;
    brand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DINERS';
  };
}

// Local application types
export interface CreditCardForm {
  number: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  holderName: string;
  cardType?: 'VISA' | 'MASTERCARD' | 'UNKNOWN';
}

export interface PaymentRequest {
  amount: number;
  currency: 'COP';
  customer_email: string;
  card: CreditCardForm;
  reference: string;
  customer_data?: Partial<WompiCustomer>;
}

export interface TransactionState {
  id?: string;
  status: 'IDLE' | 'CREATING' | 'PENDING' | 'PROCESSING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  reference: string;
  amount_in_cents: number;
  currency: 'COP';
  customer_email: string;
  error_message?: string;
  wompi_transaction?: WompiTransactionResponse;
  created_at?: string;
  finalized_at?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

// API Response types for our backend
export interface CreateTransactionRequest {
  amount_in_cents: number;
  currency: 'COP';
  customer_email: string;
  reference: string;
  card_info: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  };
  customer_data?: Partial<WompiCustomer>;
}

export interface CreateTransactionResponse {
  success: boolean;
  transaction: TransactionState;
  error?: PaymentError;
}

export interface CheckTransactionStatusResponse {
  success: boolean;
  transaction: TransactionState;
  error?: PaymentError;
}