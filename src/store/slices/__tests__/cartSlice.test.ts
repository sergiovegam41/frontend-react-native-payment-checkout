import cartSlice, { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart 
} from '../cartSlice';
import { Product } from '../../../types/api';

describe('cartSlice', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 1000, // 10.00 COP in cents
    stock: 10,
    rating: 4.5,
    images: [{
      url: 'https://example.com/image.jpg',
      altText: 'Test Image',
      position: 0,
      isMain: true
    }]
  };

  const initialState = {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  };

  describe('addToCart', () => {
    it('should add new product to empty cart', () => {
      const action = addToCart(mockProduct);
      const newState = cartSlice(initialState, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].product.id).toBe('1');
      expect(newState.items[0].quantity).toBe(1);
      expect(newState.totalItems).toBe(1);
      expect(newState.totalAmount).toBe(1000);
    });

    it('should increase quantity when adding existing product', () => {
      const stateWithItem = {
        items: [{ product: mockProduct, quantity: 1 }],
        totalItems: 1,
        totalAmount: 1000,
      };

      const action = addToCart(mockProduct);
      const newState = cartSlice(stateWithItem, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].quantity).toBe(2);
      expect(newState.totalItems).toBe(2);
      expect(newState.totalAmount).toBe(2000);
    });

    it('should not add product if total would exceed safe limit', () => {
      const expensiveProduct: Product = {
        ...mockProduct,
        id: '2',
        price: 2100000000, // Over safe limit
      };

      const action = addToCart(expensiveProduct);
      const newState = cartSlice(initialState, action);

      expect(newState.items).toHaveLength(0);
      expect(newState.totalItems).toBe(0);
      expect(newState.totalAmount).toBe(0);
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', () => {
      const stateWithItem = {
        items: [{ product: mockProduct, quantity: 1 }],
        totalItems: 1,
        totalAmount: 1000,
      };

      const action = removeFromCart('1');
      const newState = cartSlice(stateWithItem, action);

      expect(newState.items).toHaveLength(0);
      expect(newState.totalItems).toBe(0);
      expect(newState.totalAmount).toBe(0);
    });

    it('should not affect cart when removing non-existent product', () => {
      const stateWithItem = {
        items: [{ product: mockProduct, quantity: 1 }],
        totalItems: 1,
        totalAmount: 1000,
      };

      const action = removeFromCart('999');
      const newState = cartSlice(stateWithItem, action);

      expect(newState.items).toHaveLength(1);
      expect(newState.totalItems).toBe(1);
      expect(newState.totalAmount).toBe(1000);
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update quantity of existing item', () => {
      const stateWithItem = {
        items: [{ product: mockProduct, quantity: 1 }],
        totalItems: 1,
        totalAmount: 1000,
      };

      const action = updateCartItemQuantity({ productId: '1', quantity: 3 });
      const newState = cartSlice(stateWithItem, action);

      expect(newState.items[0].quantity).toBe(3);
      expect(newState.totalItems).toBe(3);
      expect(newState.totalAmount).toBe(3000);
    });

    it('should not update quantity if it would exceed safe limit', () => {
      const expensiveProduct: Product = {
        ...mockProduct,
        id: '2',
        price: 1000000000, // 10 million COP in cents
      };

      const stateWithExpensiveItem = {
        items: [{ product: expensiveProduct, quantity: 1 }],
        totalItems: 1,
        totalAmount: 1000000000,
      };

      const action = updateCartItemQuantity({ productId: '2', quantity: 3 });
      const newState = cartSlice(stateWithExpensiveItem, action);

      // Should remain unchanged due to overflow protection
      expect(newState.items[0].quantity).toBe(1);
      expect(newState.totalAmount).toBe(1000000000);
    });

    it('should not update quantity for non-existent item', () => {
      const stateWithItem = {
        items: [{ product: mockProduct, quantity: 1 }],
        totalItems: 1,
        totalAmount: 1000,
      };

      const action = updateCartItemQuantity({ productId: '999', quantity: 5 });
      const newState = cartSlice(stateWithItem, action);

      expect(newState.items[0].quantity).toBe(1);
      expect(newState.totalAmount).toBe(1000);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const stateWithItems = {
        items: [
          { product: mockProduct, quantity: 1 },
          { product: { ...mockProduct, id: '2' }, quantity: 2 }
        ],
        totalItems: 3,
        totalAmount: 3000,
      };

      const action = clearCart();
      const newState = cartSlice(stateWithItems, action);

      expect(newState.items).toHaveLength(0);
      expect(newState.totalItems).toBe(0);
      expect(newState.totalAmount).toBe(0);
    });
  });
});