import paymentSlice, { 
  setCreditCard, 
  clearPaymentData, 
  setPaymentError,
  clearCurrentTransaction,
  addToTransactionHistory,
  createTransaction,
  checkTransactionStatus
} from '../paymentSlice';

describe('paymentSlice', () => {
  const mockCardData = {
    number: '4242 4242 4242 4242',
    holderName: 'JOHN DOE',
    expirationMonth: '12',
    expirationYear: '25',
    cvv: '123',
  };

  const initialState = {
    cardData: null,
    currentTransaction: null,
    isProcessing: false,
    error: null,
    transactionHistory: [],
  };

  describe('setCreditCard', () => {
    it('should set credit card data', () => {
      const action = setCreditCard(mockCardData);
      const newState = paymentSlice(initialState, action);

      expect(newState.cardData).toEqual(mockCardData);
      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.currentTransaction).toBe(null);
      expect(newState.transactionHistory).toEqual([]);
    });

    it('should update existing credit card data', () => {
      const stateWithCard = {
        ...initialState,
        cardData: mockCardData,
      };

      const updatedCardData = {
        ...mockCardData,
        holderName: 'JANE DOE',
        cvv: '456',
      };

      const action = setCreditCard(updatedCardData);
      const newState = paymentSlice(stateWithCard, action);

      expect(newState.cardData).toEqual(updatedCardData);
      expect(newState.cardData?.holderName).toBe('JANE DOE');
      expect(newState.cardData?.cvv).toBe('456');
    });

    it('should handle partial card data updates', () => {
      const partialCardData = {
        number: '4111 1111 1111 1111',
        holderName: 'TEST USER',
        expirationMonth: '08',
        expirationYear: '26',
        cvv: '789',
      };

      const action = setCreditCard(partialCardData);
      const newState = paymentSlice(initialState, action);

      expect(newState.cardData).toEqual(partialCardData);
    });
  });

  describe('clearPaymentData', () => {
    it('should clear payment data', () => {
      const stateWithData = {
        cardData: mockCardData,
        currentTransaction: { id: 'tx-123', status: 'completed' } as any,
        isProcessing: true,
        error: { code: 'SOME_ERROR', message: 'Some error' },
        transactionHistory: [{ id: 'tx-123', status: 'completed' } as any],
      };

      const action = clearPaymentData();
      const newState = paymentSlice(stateWithData, action);

      expect(newState.cardData).toBe(null);
      expect(newState.currentTransaction).toBe(null);
      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.transactionHistory).toEqual([{ id: 'tx-123', status: 'completed' }]);
    });

    it('should not affect already empty state', () => {
      const action = clearPaymentData();
      const newState = paymentSlice(initialState, action);

      expect(newState.cardData).toBe(null);
      expect(newState.currentTransaction).toBe(null);
      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.transactionHistory).toEqual([]);
    });
  });

  describe('setPaymentError', () => {
    it('should set payment error', () => {
      const error = {
        code: 'PAYMENT_FAILED',
        message: 'Payment processing failed',
      };

      const action = setPaymentError(error);
      const newState = paymentSlice(initialState, action);

      expect(newState.error).toEqual(error);
      expect(newState.cardData).toBe(null);
      expect(newState.isProcessing).toBe(false);
    });

    it('should clear payment error when null', () => {
      const stateWithError = {
        ...initialState,
        error: { code: 'SOME_ERROR', message: 'Some error' },
      };

      const action = setPaymentError(null);
      const newState = paymentSlice(stateWithError, action);

      expect(newState.error).toBe(null);
    });
  });

  describe('clearCurrentTransaction', () => {
    it('should clear current transaction and related state', () => {
      const stateWithTransaction = {
        ...initialState,
        currentTransaction: { id: 'tx-123', status: 'completed' } as any,
        isProcessing: true,
        error: { code: 'SOME_ERROR', message: 'Some error' },
      };

      const action = clearCurrentTransaction();
      const newState = paymentSlice(stateWithTransaction, action);

      expect(newState.currentTransaction).toBe(null);
      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toBe(null);
      expect(newState.cardData).toBe(null); // Should not affect cardData
      expect(newState.transactionHistory).toEqual([]);
    });
  });

  describe('addToTransactionHistory', () => {
    const mockTransaction = {
      id: 'tx-123',
      status: 'completed',
      amount: 50000,
      currency: 'COP',
    } as any;

    it('should add transaction to history', () => {
      const action = addToTransactionHistory(mockTransaction);
      const newState = paymentSlice(initialState, action);

      expect(newState.transactionHistory).toHaveLength(1);
      expect(newState.transactionHistory[0]).toEqual(mockTransaction);
    });

    it('should prepend new transaction to existing history', () => {
      const existingTransaction = { id: 'tx-456', status: 'pending' } as any;
      const stateWithHistory = {
        ...initialState,
        transactionHistory: [existingTransaction],
      };

      const action = addToTransactionHistory(mockTransaction);
      const newState = paymentSlice(stateWithHistory, action);

      expect(newState.transactionHistory).toHaveLength(2);
      expect(newState.transactionHistory[0]).toEqual(mockTransaction);
      expect(newState.transactionHistory[1]).toEqual(existingTransaction);
    });

    it('should limit history to 50 transactions', () => {
      const manyTransactions = Array.from({ length: 50 }, (_, i) => ({
        id: `tx-${i}`,
        status: 'completed'
      })) as any[];

      const stateWithMaxHistory = {
        ...initialState,
        transactionHistory: manyTransactions,
      };

      const newTransaction = { id: 'tx-new', status: 'completed' } as any;
      const action = addToTransactionHistory(newTransaction);
      const newState = paymentSlice(stateWithMaxHistory, action);

      expect(newState.transactionHistory).toHaveLength(50);
      expect(newState.transactionHistory[0]).toEqual(newTransaction);
      expect(newState.transactionHistory[49].id).toBe('tx-48'); // Last one should be tx-48 (tx-49 gets removed since we added a new one at position 0)
    });
  });

  describe('createTransaction async thunk', () => {

    it('should handle pending state', () => {
      const action = { type: createTransaction.pending.type };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(true);
      expect(newState.error).toBe(null);
    });

    it('should handle successful transaction creation', () => {
      const mockTransaction = { id: 'tx-123', status: 'completed' } as any;
      const mockResponse = {
        success: true,
        transaction: mockTransaction,
      };

      const action = {
        type: createTransaction.fulfilled.type,
        payload: mockResponse,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.currentTransaction).toEqual(mockTransaction);
      expect(newState.transactionHistory).toHaveLength(1);
      expect(newState.transactionHistory[0]).toEqual(mockTransaction);
      expect(newState.error).toBe(null);
    });

    it('should handle failed transaction creation with error in response', () => {
      const mockError = { code: 'PAYMENT_FAILED', message: 'Payment failed' };
      const mockResponse = {
        success: false,
        error: mockError,
      };

      const action = {
        type: createTransaction.fulfilled.type,
        payload: mockResponse,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.currentTransaction).toBe(null);
      expect(newState.error).toEqual(mockError);
    });

    it('should handle rejected transaction', () => {
      const mockError = { code: 'NETWORK_ERROR', message: 'Network failed' };
      const action = {
        type: createTransaction.rejected.type,
        payload: mockError,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toEqual(mockError);
    });

    it('should handle rejected transaction without payload', () => {
      const action = {
        type: createTransaction.rejected.type,
        payload: undefined,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      });
    });
  });

  describe('checkTransactionStatus async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: checkTransactionStatus.pending.type };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(true);
    });

    it('should handle successful status check', () => {
      const mockTransaction = { id: 'tx-123', status: 'completed' } as any;
      const action = {
        type: checkTransactionStatus.fulfilled.type,
        payload: mockTransaction,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.currentTransaction).toEqual(mockTransaction);
    });

    it('should update transaction in history if exists', () => {
      const existingTransaction = { id: 'tx-123', status: 'pending' } as any;
      const updatedTransaction = { id: 'tx-123', status: 'completed' } as any;
      
      const stateWithHistory = {
        ...initialState,
        transactionHistory: [existingTransaction],
      };

      const action = {
        type: checkTransactionStatus.fulfilled.type,
        payload: updatedTransaction,
      };
      const newState = paymentSlice(stateWithHistory, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.currentTransaction).toEqual(updatedTransaction);
      expect(newState.transactionHistory[0]).toEqual(updatedTransaction);
    });

    it('should handle rejected status check', () => {
      const mockError = { code: 'STATUS_FAILED', message: 'Status check failed' };
      const action = {
        type: checkTransactionStatus.rejected.type,
        payload: mockError,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toEqual(mockError);
    });

    it('should handle rejected status check without payload', () => {
      const action = {
        type: checkTransactionStatus.rejected.type,
        payload: undefined,
      };
      const newState = paymentSlice(initialState, action);

      expect(newState.isProcessing).toBe(false);
      expect(newState.error).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Failed to check transaction status',
      });
    });
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = paymentSlice(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
    });
  });
});