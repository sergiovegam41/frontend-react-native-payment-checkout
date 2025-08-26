import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  CheckTransactionStatusResponse,
  PaymentError,
  TransactionState,
} from '../types/payment';
import { BaseApiService, API_CONFIG } from './apiConfig';

interface CheckoutWithCardRequest {
  items: Array<{
    id: string;
    quantity: number;
  }>;
  customer_email: string;
  card_data: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
    card_holder: string;
  };
}

interface CheckoutWithCardResponse {
  checkout_id: string;
  items: Array<{
    product_id: string;
    name: string;
    unit_price: number;
    quantity: number;
    total_price: number;
  }>;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  transaction_id: string;
  transaction_status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  payment_method_info: {
    type: string;
    last_four: string;
    card_holder: string;
    brand?: string;
  };
  payment_url?: string;
}

class PaymentApiService extends BaseApiService {

  /**
   * Process payment with card - New API endpoint
   */
  async checkoutWithCard(request: CheckoutWithCardRequest): Promise<CheckoutWithCardResponse> {
    try {
      const url = 'https://backend-nest-payment-checkout.ondeploy.space/api/v1/product-checkout';
      console.log('Making request to:', url);
      console.log('Request payload:', JSON.stringify(request, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        
        // Extract meaningful error message
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Checkout with card error:', error);
      throw error;
    }
  }

  /**
   * Get checkout status by checkout_id
   */
  async getCheckoutStatus(checkoutId: string): Promise<CheckoutStatusResponse> {
    try {
      const url = `https://backend-nest-payment-checkout.ondeploy.space/api/v1/product-checkout/${checkoutId}/status`;
      console.log('Getting checkout status from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Status response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Status error response:', errorData);
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('Status response data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('Get checkout status error:', error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    try {
      // When backend is ready, use this:
      // return await this.makeRequest<CreateTransactionResponse>(
      //   API_CONFIG.ENDPOINTS.TRANSACTIONS, 
      //   {
      //     method: 'POST',
      //     body: JSON.stringify(request),
      //   }
      // );

      // For now, simulate the API call with proper structure
      return this.simulateCreateTransaction(request);
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  }

  /**
   * Check transaction status
   */
  async checkTransactionStatus(transactionId: string): Promise<CheckTransactionStatusResponse> {
    try {
      // When backend is ready, use this:
      // return await this.makeRequest<CheckTransactionStatusResponse>(
      //   `${API_CONFIG.ENDPOINTS.TRANSACTIONS}/${transactionId}`,
      //   { method: 'GET' }
      // );

      // For now, simulate the API call
      return this.simulateCheckStatus(transactionId);
    } catch (error) {
      console.error('Check transaction status error:', error);
      throw error;
    }
  }

  /**
   * Get all transactions for a user
   */
  async getUserTransactions(customerEmail: string): Promise<TransactionState[]> {
    const queryString = this.buildQueryString({ customer_email: customerEmail });
    
    try {
      return await this.makeRequest<TransactionState[]>(
        `${API_CONFIG.ENDPOINTS.TRANSACTIONS}${queryString}`,
        { method: 'GET' }
      );
    } catch (error) {
      console.error('Get user transactions error:', error);
      throw error;
    }
  }

  /**
   * Create payment source (for future tokenization)
   */
  async createPaymentSource(request: any): Promise<any> {
    try {
      return await this.makeRequest(
        API_CONFIG.ENDPOINTS.PAYMENT_SOURCES,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
    } catch (error) {
      console.error('Create payment source error:', error);
      throw error;
    }
  }

  /**
   * Get user payment sources
   */
  async getPaymentSources(customerEmail: string): Promise<any[]> {
    const queryString = this.buildQueryString({ customer_email: customerEmail });
    
    try {
      return await this.makeRequest(
        `${API_CONFIG.ENDPOINTS.PAYMENT_SOURCES}${queryString}`,
        { method: 'GET' }
      );
    } catch (error) {
      console.error('Get payment sources error:', error);
      throw error;
    }
  }

  // SIMULATION METHODS - Remove when backend is ready
  private async simulateCreateTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(resolve, 2000));

    // Generate a fake transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate random success/failure for testing
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (!isSuccess) {
      return {
        success: false,
        transaction: {
          id: transactionId,
          status: 'ERROR',
          reference: request.reference,
          amount_in_cents: request.amount_in_cents,
          currency: request.currency,
          customer_email: request.customer_email,
          error_message: 'Simulated payment error for testing',
          created_at: new Date().toISOString(),
        },
        error: {
          code: 'PAYMENT_DECLINED',
          message: 'Your payment was declined. Please try with a different card.',
          details: 'Simulated error for testing purposes',
        },
      };
    }

    return {
      success: true,
      transaction: {
        id: transactionId,
        status: 'PENDING',
        reference: request.reference,
        amount_in_cents: request.amount_in_cents,
        currency: request.currency,
        customer_email: request.customer_email,
        created_at: new Date().toISOString(),
        wompi_transaction: {
          id: `wompi_${transactionId}`,
          amount_in_cents: request.amount_in_cents,
          currency: request.currency,
          customer_email: request.customer_email,
          reference: request.reference,
          status: 'PENDING',
          status_message: 'Transaction pending approval',
          payment_method_type: 'CARD',
          payment_method: {
            type: 'CARD',
            extra: {
              bin: request.card_info.number.substr(0, 6),
              name: 'Simulated Card',
              brand: request.card_info.number.startsWith('4') ? 'VISA' : 'MASTERCARD',
              exp_year: `20${request.card_info.exp_year}`,
              exp_month: request.card_info.exp_month,
              last_four: request.card_info.number.slice(-4),
              card_holder: request.card_info.card_holder,
            },
          },
          created_at: new Date().toISOString(),
        },
      },
    };
  }

  private async simulateCheckStatus(transactionId: string): Promise<CheckTransactionStatusResponse> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(resolve, 1500));

    // Simulate random final status
    const finalStatuses = ['APPROVED', 'DECLINED'] as const;
    const finalStatus = finalStatuses[Math.floor(Math.random() * finalStatuses.length)];

    return {
      success: true,
      transaction: {
        id: transactionId,
        status: finalStatus,
        reference: `ref_${transactionId}`,
        amount_in_cents: 50000, // $500 COP
        currency: 'COP',
        customer_email: 'customer@example.com',
        finalized_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        ...(finalStatus === 'DECLINED' && {
          error_message: 'Transaction was declined by the issuer'
        }),
      },
    };
  }

  /**
   * Generate a unique reference for transactions
   */
  generateTransactionReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `PAY_${timestamp}_${random}`;
  }

  /**
   * Validate card number using Luhn algorithm
   */
  validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!/^\d+$/.test(cleanNumber) || cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Format amount from COP to cents with overflow protection
   */
  formatAmountToCents(amount: number): number {
    const cents = Math.round(amount * 100);
    // PostgreSQL INT4 max value is 2,147,483,647
    const MAX_INT4 = 2147483647;
    if (cents > MAX_INT4) {
      throw new Error(`Amount ${amount} COP (${cents} cents) exceeds maximum allowed value`);
    }
    return cents;
  }

  /**
   * Format amount from cents to COP
   */
  formatAmountFromCents(amountInCents: number): number {
    return amountInCents / 100;
  }

  /**
   * Validate total amount before sending to backend (amount in COP)
   */
  validateTotalAmount(amountInCOP: number): boolean {
    const MAX_AMOUNT_COP = 21474836; // ~21 million COP to stay under INT4 limit in cents
    return amountInCOP <= MAX_AMOUNT_COP;
  }
}

export const paymentApi = new PaymentApiService();

// Export types
interface CheckoutStatusResponse {
  status: 'PAID' | 'FAILED' | 'PENDING';
  total: number;
}

export type { CheckoutWithCardRequest, CheckoutWithCardResponse, CheckoutStatusResponse };