import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  CheckTransactionStatusResponse,
  PaymentError,
  TransactionState,
} from '../types/payment';

// This will be updated when backend is ready
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class PaymentApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment API Error:', error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    // For now, simulate the API call with proper structure
    // This will be replaced with actual API call when backend is ready
    return this.simulateCreateTransaction(request);
  }

  /**
   * Check transaction status
   */
  async checkTransactionStatus(transactionId: string): Promise<CheckTransactionStatusResponse> {
    // For now, simulate the API call
    // This will be replaced with actual API call when backend is ready
    return this.simulateCheckStatus(transactionId);
  }

  /**
   * Get all transactions for a user (future feature)
   */
  async getUserTransactions(customerEmail: string): Promise<TransactionState[]> {
    try {
      return await this.makeRequest<TransactionState[]>(
        `/transactions?customer_email=${encodeURIComponent(customerEmail)}`
      );
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }

  // SIMULATION METHODS - Remove when backend is ready
  private async simulateCreateTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

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
    await new Promise(resolve => setTimeout(resolve, 1500));

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
   * Format amount from COP to cents
   */
  formatAmountToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Format amount from cents to COP
   */
  formatAmountFromCents(amountInCents: number): number {
    return amountInCents / 100;
  }
}

export const paymentApi = new PaymentApiService();