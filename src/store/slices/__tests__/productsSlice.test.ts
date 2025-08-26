import productsSlice, { 
  setProducts, 
  appendProducts,
  setPagination,
  setLoading, 
  setLoadingMore,
  setRefreshing,
  setError,
  clearProducts 
} from '../productsSlice';
import { Product } from '../../../types/api';

describe('productsSlice', () => {
  const initialState = {
    products: [],
    pagination: null,
    loading: false,
    loadingMore: false,
    error: null,
    refreshing: false,
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Description 1',
      price: 50000,
      stock: 10,
      rating: 4.5,
      images: []
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Description 2',
      price: 75000,
      stock: 5,
      rating: 3.8,
      images: []
    }
  ];

  describe('setProducts', () => {
    it('should set products', () => {
      const action = setProducts(mockProducts);
      const newState = productsSlice(initialState, action);

      expect(newState.products).toEqual(mockProducts);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should handle empty products array', () => {
      const action = setProducts([]);
      const newState = productsSlice(initialState, action);

      expect(newState.products).toEqual([]);
    });
  });

  describe('appendProducts', () => {
    it('should append products to existing list', () => {
      const stateWithProducts = { ...initialState, products: [mockProducts[0]] };
      const newProducts = [mockProducts[1]];
      
      const action = appendProducts(newProducts);
      const newState = productsSlice(stateWithProducts, action);

      expect(newState.products).toHaveLength(2);
      expect(newState.products[0]).toEqual(mockProducts[0]);
      expect(newState.products[1]).toEqual(mockProducts[1]);
    });

    it('should append to empty products array', () => {
      const action = appendProducts(mockProducts);
      const newState = productsSlice(initialState, action);

      expect(newState.products).toEqual(mockProducts);
    });
  });

  describe('setPagination', () => {
    it('should set pagination info', () => {
      const pagination = { hasMore: true, cursor: 'test-cursor', total: 100 };
      const action = setPagination(pagination);
      const newState = productsSlice(initialState, action);

      expect(newState.pagination).toEqual(pagination);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const action = setLoading(true);
      const newState = productsSlice(initialState, action);

      expect(newState.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const action = setLoading(false);
      const newState = productsSlice(stateWithLoading, action);

      expect(newState.loading).toBe(false);
    });
  });

  describe('setLoadingMore', () => {
    it('should set loadingMore to true', () => {
      const action = setLoadingMore(true);
      const newState = productsSlice(initialState, action);

      expect(newState.loadingMore).toBe(true);
    });

    it('should set loadingMore to false', () => {
      const stateWithLoadingMore = { ...initialState, loadingMore: true };
      const action = setLoadingMore(false);
      const newState = productsSlice(stateWithLoadingMore, action);

      expect(newState.loadingMore).toBe(false);
    });
  });

  describe('setRefreshing', () => {
    it('should set refreshing to true', () => {
      const action = setRefreshing(true);
      const newState = productsSlice(initialState, action);

      expect(newState.refreshing).toBe(true);
    });

    it('should set refreshing to false', () => {
      const stateWithRefreshing = { ...initialState, refreshing: true };
      const action = setRefreshing(false);
      const newState = productsSlice(stateWithRefreshing, action);

      expect(newState.refreshing).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Failed to load products';
      const action = setError(errorMessage);
      const newState = productsSlice(initialState, action);

      expect(newState.error).toBe(errorMessage);
    });

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = setError(null);
      const newState = productsSlice(stateWithError, action);

      expect(newState.error).toBe(null);
    });
  });

  describe('clearProducts', () => {
    it('should reset products state', () => {
      const stateWithData = {
        products: mockProducts,
        pagination: { hasMore: false, cursor: 'some-cursor', total: 100 },
        loading: false,
        loadingMore: false,
        error: 'Some error',
        refreshing: false,
      };

      const action = clearProducts();
      const newState = productsSlice(stateWithData, action);

      expect(newState.products).toEqual([]);
      expect(newState.pagination).toBe(null);
      expect(newState.error).toBe(null);
      expect(newState.loading).toBe(false); // Should not be reset by clearProducts
      expect(newState.loadingMore).toBe(false); // Should not be reset by clearProducts
      expect(newState.refreshing).toBe(false); // Should not be reset by clearProducts
    });
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = productsSlice(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
    });
  });
});