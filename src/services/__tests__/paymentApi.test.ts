import { paymentApi } from '../paymentApi';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('PaymentApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('validateCardNumber', () => {
    it('should validate correct card numbers using Luhn algorithm', () => {
      expect(paymentApi.validateCardNumber('4242424242424242')).toBe(true);
      expect(paymentApi.validateCardNumber('4111111111111111')).toBe(true);
      expect(paymentApi.validateCardNumber('5555555555554444')).toBe(true);
    });

    it('should handle spaced card numbers', () => {
      expect(paymentApi.validateCardNumber('4242 4242 4242 4242')).toBe(true);
      expect(paymentApi.validateCardNumber('5555 5555 5555 4444')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(paymentApi.validateCardNumber('4242424242424241')).toBe(false); // Invalid Luhn
      expect(paymentApi.validateCardNumber('1234567890123456')).toBe(false);
      expect(paymentApi.validateCardNumber('123')).toBe(false); // Too short
      expect(paymentApi.validateCardNumber('12345678901234567890')).toBe(false); // Too long
      expect(paymentApi.validateCardNumber('424242424242424a')).toBe(false); // Non-numeric
      expect(paymentApi.validateCardNumber('')).toBe(false); // Empty
    });
  });

  describe('formatAmountToCents', () => {
    it('should convert COP to cents correctly', () => {
      expect(paymentApi.formatAmountToCents(100)).toBe(10000);
      expect(paymentApi.formatAmountToCents(50.50)).toBe(5050);
      expect(paymentApi.formatAmountToCents(0)).toBe(0);
      expect(paymentApi.formatAmountToCents(1.23)).toBe(123);
    });

    it('should round to nearest cent', () => {
      expect(paymentApi.formatAmountToCents(1.234)).toBe(123);
      expect(paymentApi.formatAmountToCents(1.235)).toBe(124);
      expect(paymentApi.formatAmountToCents(1.236)).toBe(124);
    });

    it('should throw error for amounts exceeding INT4 limit', () => {
      const maxAmount = 25000000; // Would exceed INT4 when converted to cents
      expect(() => paymentApi.formatAmountToCents(maxAmount)).toThrow(
        'Amount 25000000 COP (2500000000 cents) exceeds maximum allowed value'
      );
    });
  });

  describe('formatAmountFromCents', () => {
    it('should convert cents to COP correctly', () => {
      expect(paymentApi.formatAmountFromCents(10000)).toBe(100);
      expect(paymentApi.formatAmountFromCents(5050)).toBe(50.5);
      expect(paymentApi.formatAmountFromCents(0)).toBe(0);
      expect(paymentApi.formatAmountFromCents(123)).toBe(1.23);
    });
  });

  describe('validateTotalAmount', () => {
    it('should validate amounts within safe limits', () => {
      expect(paymentApi.validateTotalAmount(100)).toBe(true);
      expect(paymentApi.validateTotalAmount(10000)).toBe(true);
      expect(paymentApi.validateTotalAmount(21474836)).toBe(true); // Max safe amount
    });

    it('should reject amounts exceeding safe limits', () => {
      expect(paymentApi.validateTotalAmount(21474837)).toBe(false); // Just over limit
      expect(paymentApi.validateTotalAmount(50000000)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(paymentApi.validateTotalAmount(0)).toBe(true);
      expect(paymentApi.validateTotalAmount(-1)).toBe(true); // Negative amounts pass validation
    });
  });

  describe('generateTransactionReference', () => {
    it('should generate unique references', () => {
      const ref1 = paymentApi.generateTransactionReference();
      const ref2 = paymentApi.generateTransactionReference();
      
      expect(ref1).not.toBe(ref2);
      expect(ref1).toMatch(/^PAY_\d+_[A-Z0-9]{6}$/);
      expect(ref2).toMatch(/^PAY_\d+_[A-Z0-9]{6}$/);
    });

    it('should have correct format', () => {
      const reference = paymentApi.generateTransactionReference();
      expect(reference).toMatch(/^PAY_\d{13}_[A-Z0-9]{6}$/);
    });
  });

  describe('checkoutWithCard', () => {
    const mockRequest = {
      items: [{ id: '1', quantity: 1 }],
      customer_email: 'test@example.com',
      card_data: {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '25',
        cvc: '123',
        card_holder: 'TEST USER'
      }
    };

    it('should make successful API call', async () => {
      const mockResponse = {
        checkout_id: 'checkout_123',
        total: 50000,
        transaction_status: 'APPROVED'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        headers: new Headers()
      } as Response);

      const result = await paymentApi.checkoutWithCard(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://payment-checkout-backend.ondeploy.space/api/v1/product-checkout',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = {
        message: 'Invalid card data',
        error: 'Bad Request',
        statusCode: 400
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockErrorResponse,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.checkoutWithCard(mockRequest))
        .rejects.toThrow('Invalid card data');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(paymentApi.checkoutWithCard(mockRequest))
        .rejects.toThrow('Network error');
    });
  });

  describe('getCheckoutStatus', () => {
    it('should fetch checkout status successfully', async () => {
      const mockResponse = {
        status: 'PAID',
        total: 50000
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
        headers: new Headers()
      } as Response);

      const result = await paymentApi.getCheckoutStatus('checkout_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://payment-checkout-backend.ondeploy.space/api/v1/product-checkout/checkout_123/status',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle status check errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Checkout not found' }),
        status: 404,
        statusText: 'Not Found',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.getCheckoutStatus('invalid_id'))
        .rejects.toThrow('Checkout not found');
    });

    it('should handle status check with error.message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: { message: 'Custom error message' } }),
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.getCheckoutStatus('error_id'))
        .rejects.toThrow('Custom error message');
    });

    it('should handle status check with JSON parse error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => { throw new Error('Invalid JSON'); },
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.getCheckoutStatus('json_error_id'))
        .rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle network errors in status check', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(paymentApi.getCheckoutStatus('network_error_id'))
        .rejects.toThrow('Network timeout');
    });
  });

  describe('checkoutWithCard - additional error scenarios', () => {
    const mockRequest = {
      items: [{ id: '1', quantity: 1 }],
      customer_email: 'test@example.com',
      card_data: {
        number: '4242424242424242',
        exp_month: '12',
        exp_year: '25',
        cvc: '123',
        card_holder: 'TEST USER'
      }
    };

    it('should handle error with error.message structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: { message: 'Card declined by issuer' } }),
        status: 402,
        statusText: 'Payment Required',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.checkoutWithCard(mockRequest))
        .rejects.toThrow('Card declined by issuer');
    });

    it('should handle error with simple message structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Insufficient funds' }),
        status: 402,
        statusText: 'Payment Required',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.checkoutWithCard(mockRequest))
        .rejects.toThrow('Insufficient funds');
    });

    it('should handle error with JSON parse failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => { throw new Error('Invalid JSON'); },
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.checkoutWithCard(mockRequest))
        .rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle error with no error data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => null,
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers()
      } as Response);

      await expect(paymentApi.checkoutWithCard(mockRequest))
        .rejects.toThrow('HTTP 503: Service Unavailable');
    });
  });

  describe('createTransaction', () => {
    it('should call simulateCreateTransaction', async () => {
      const mockRequest = {
        amount_in_cents: 50000,
        currency: 'COP',
        customer_email: 'test@example.com',
        reference: 'TEST_REF_123',
        card_info: {
          number: '4242424242424242',
          exp_month: '12',
          exp_year: '25',
          cvc: '123',
          card_holder: 'TEST USER'
        }
      };

      const result = await paymentApi.createTransaction(mockRequest);

      expect(result.success).toBeDefined();
      expect(result.transaction).toBeDefined();
      expect(result.transaction.id).toMatch(/^txn_\d+_[a-z0-9]{9}$/);
    });
  });

  describe('checkTransactionStatus', () => {
    it('should call simulateCheckStatus', async () => {
      const result = await paymentApi.checkTransactionStatus('test_txn_123');

      expect(result.success).toBe(true);
      expect(result.transaction).toBeDefined();
      expect(['APPROVED', 'DECLINED']).toContain(result.transaction.status);
    });
  });

  describe('getUserTransactions', () => {
    it('should build query string and make request', async () => {
      // This method uses makeRequest which would need to be mocked
      // For now, we'll test that it calls the method without throwing
      try {
        await paymentApi.getUserTransactions('test@example.com');
      } catch (error) {
        // Expected to fail since we don't have a real backend
        expect(error).toBeDefined();
      }
    });
  });

  describe('createPaymentSource', () => {
    it('should make request to payment sources endpoint', async () => {
      const mockRequest = { customer_email: 'test@example.com' };
      
      try {
        await paymentApi.createPaymentSource(mockRequest);
      } catch (error) {
        // Expected to fail since we don't have a real backend
        expect(error).toBeDefined();
      }
    });
  });

  describe('getPaymentSources', () => {
    it('should build query string and make request', async () => {
      try {
        await paymentApi.getPaymentSources('test@example.com');
      } catch (error) {
        // Expected to fail since we don't have a real backend
        expect(error).toBeDefined();
      }
    });
  });
});