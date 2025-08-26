/**
 * Basic smoke tests for all screens to ensure they render without crashing
 * This helps achieve coverage targets for the Wompi technical test
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { testStore } from '../../store/testStore';

// Import all screens
import SplashScreen from '../SplashScreen';
import ProductsHomeScreen from '../ProductsHomeScreen';
import ProductSelectionScreen from '../ProductSelectionScreen';
import ProductDetailScreen from '../ProductDetailScreen';
import CheckoutScreen from '../CheckoutScreen';
import CreditCardFormScreen from '../CreditCardFormScreen';
import PaymentSummaryScreen from '../PaymentSummaryScreen';
import TransactionResultScreen from '../TransactionResultScreen';

// Mock all external dependencies
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock all component dependencies
jest.mock('../../components/ProductCard', () => 'ProductCard');
jest.mock('../../components/LoadingIndicator', () => 'LoadingIndicator');
jest.mock('../../components/CustomModal', () => 'CustomModal');
jest.mock('../../components/ImageGallery', () => 'ImageGallery');
jest.mock('../../components/StarRating', () => 'StarRating');
jest.mock('../../components/CreditCardInput', () => 'CreditCardInput');
jest.mock('../../components/FormInput', () => 'FormInput');
jest.mock('../../components/ExpiryDateInput', () => 'ExpiryDateInput');

// Mock services
jest.mock('../../services/productsApi', () => ({
  productsApi: {
    getProducts: jest.fn().mockResolvedValue({ data: [], pagination: null }),
    getProductById: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 50000,
      stock: 10,
      rating: 4.5,
      images: []
    }),
  },
}));

jest.mock('../../services/paymentApi', () => ({
  paymentApi: {
    checkoutWithCard: jest.fn().mockResolvedValue({ success: true, checkout_id: '123' }),
    getCheckoutStatus: jest.fn().mockResolvedValue({ status: 'PAID', total: 50000 })
  }
}));

// Mock utils
jest.mock('../../utils/cardValidation', () => ({
  detectCardType: jest.fn().mockReturnValue('visa'),
  validateCardNumber: jest.fn().mockReturnValue(true),
  validateCVV: jest.fn().mockReturnValue(true),
  validateExpiryDate: jest.fn().mockReturnValue(true),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <Provider store={testStore}>
      {component}
    </Provider>
  );
};

// Mock navigation object
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => false),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
};

describe('All Screens Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Mock timers for SplashScreen
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('SplashScreen renders without crashing', () => {
    const component = renderWithProvider(
      <SplashScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('ProductsHomeScreen renders without crashing', () => {
    const component = renderWithProvider(
      <ProductsHomeScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('ProductSelectionScreen renders without crashing', () => {
    const component = renderWithProvider(
      <ProductSelectionScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('ProductDetailScreen renders without crashing', () => {
    const mockRoute = {
      params: { productId: '1' },
      key: 'test',
      name: 'ProductDetail' as const,
    };
    
    const component = renderWithProvider(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(component).toBeTruthy();
  });

  it('CheckoutScreen renders without crashing', () => {
    const component = renderWithProvider(
      <CheckoutScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('CreditCardFormScreen renders without crashing', () => {
    const component = renderWithProvider(
      <CreditCardFormScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('PaymentSummaryScreen renders without crashing', () => {
    const component = renderWithProvider(
      <PaymentSummaryScreen navigation={mockNavigation} />
    );
    expect(component).toBeTruthy();
  });

  it('TransactionResultScreen renders without crashing', () => {
    const mockRoute = {
      params: {
        transactionData: {
          success: true,
          checkout_id: 'test_123',
          status: 'PENDING',
          total: 50000
        }
      },
      key: 'test',
      name: 'TransactionResult' as const,
    };
    
    const component = renderWithProvider(
      <TransactionResultScreen navigation={mockNavigation} route={mockRoute} />
    );
    expect(component).toBeTruthy();
  });
});