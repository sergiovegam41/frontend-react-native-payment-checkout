import transactionsSlice, { 
  createTransaction, 
  updateTransaction, 
  setCurrentTransaction,
  setLoading,
  setError
} from '../transactionsSlice';

describe('transactionsSlice', () => {
  const initialState = {
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
  };

  const mockTransactionData = {
    amount: 50000,
    status: 'PENDING' as const,
    paymentMethod: 'credit_card',
    products: [
      {
        id: '1',
        name: 'Test Product',
        price: 50000,
        quantity: 1
      }
    ]
  };

  describe('createTransaction', () => {
    it('should create and add transaction', () => {
      const action = createTransaction(mockTransactionData);
      const newState = transactionsSlice(initialState, action);

      expect(newState.transactions).toHaveLength(1);
      expect(newState.transactions[0]).toMatchObject(mockTransactionData);
      expect(newState.transactions[0].id).toBeDefined();
      expect(newState.transactions[0].createdAt).toBeDefined();
      expect(newState.currentTransaction).toEqual(newState.transactions[0]);
    });

    it('should add multiple transactions', () => {
      const firstTransactionData = { ...mockTransactionData, amount: 30000 };
      const secondTransactionData = { ...mockTransactionData, amount: 70000 };

      let state = transactionsSlice(initialState, createTransaction(firstTransactionData));
      state = transactionsSlice(state, createTransaction(secondTransactionData));

      expect(state.transactions).toHaveLength(2);
      expect(state.transactions[0].amount).toBe(30000);
      expect(state.transactions[1].amount).toBe(70000);
      expect(state.currentTransaction).toEqual(state.transactions[1]);
    });
  });

  describe('updateTransaction', () => {
    it('should update existing transaction', () => {
      // First create a transaction
      const createAction = createTransaction(mockTransactionData);
      let state = transactionsSlice(initialState, createAction);
      const transactionId = state.transactions[0].id;

      // Then update it
      const updatePayload = { 
        id: transactionId, 
        updates: { status: 'APPROVED' as const, wompiTransactionId: 'wompi-123' } 
      };
      const updateAction = updateTransaction(updatePayload);
      const newState = transactionsSlice(state, updateAction);

      expect(newState.transactions[0].status).toBe('APPROVED');
      expect(newState.transactions[0].wompiTransactionId).toBe('wompi-123');
      expect(newState.currentTransaction?.status).toBe('APPROVED');
    });

    it('should not update non-existing transaction', () => {
      const createAction = createTransaction(mockTransactionData);
      let state = transactionsSlice(initialState, createAction);

      const updatePayload = { id: 'non-existent', updates: { status: 'APPROVED' as const } };
      const updateAction = updateTransaction(updatePayload);
      const newState = transactionsSlice(state, updateAction);

      expect(newState.transactions[0].status).toBe('PENDING'); // Should remain unchanged
    });

    it('should handle empty transactions array', () => {
      const updatePayload = { id: 'tx-123', updates: { status: 'APPROVED' as const } };
      const action = updateTransaction(updatePayload);
      const newState = transactionsSlice(initialState, action);

      expect(newState.transactions).toHaveLength(0);
    });
  });

  describe('setCurrentTransaction', () => {
    it('should set current transaction', () => {
      const mockTransaction = {
        id: 'tx-123',
        amount: 50000,
        status: 'PENDING' as const,
        paymentMethod: 'credit_card',
        createdAt: '2025-01-01T00:00:00Z',
        products: []
      };

      const action = setCurrentTransaction(mockTransaction);
      const newState = transactionsSlice(initialState, action);

      expect(newState.currentTransaction).toEqual(mockTransaction);
    });

    it('should clear current transaction', () => {
      const stateWithTransaction = {
        ...initialState,
        currentTransaction: {
          id: 'tx-123',
          amount: 50000,
          status: 'PENDING' as const,
          paymentMethod: 'credit_card',
          createdAt: '2025-01-01T00:00:00Z',
          products: []
        }
      };

      const action = setCurrentTransaction(null);
      const newState = transactionsSlice(stateWithTransaction, action);

      expect(newState.currentTransaction).toBe(null);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const action = setLoading(true);
      const newState = transactionsSlice(initialState, action);

      expect(newState.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = setLoading(false);
      const newState = transactionsSlice(stateWithLoading, action);

      expect(newState.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Transaction failed';
      const action = setError(errorMessage);
      const newState = transactionsSlice(initialState, action);

      expect(newState.error).toBe(errorMessage);
    });

    it('should clear error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = setError(null);
      const newState = transactionsSlice(stateWithError, action);

      expect(newState.error).toBe(null);
    });
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = transactionsSlice(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
    });
  });
});