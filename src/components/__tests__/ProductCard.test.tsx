import React from 'react';
import { render } from '@testing-library/react-native';
import ProductCard from '../ProductCard';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 50000,
  stock: 10,
  rating: 4.5,
  images: [{ url: 'test.jpg', altText: 'test', position: 0, isMain: true }]
};

const mockProps = {
  product: mockProduct,
  onPress: jest.fn(),
  onAddToCart: jest.fn(),
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const component = render(<ProductCard {...mockProps} />);
    expect(component).toBeTruthy();
  });

  it('displays product name', () => {
    const { getByText } = render(<ProductCard {...mockProps} />);
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('displays product description', () => {
    const { getByText } = render(<ProductCard {...mockProps} />);
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('displays formatted price', () => {
    const { getByText } = render(<ProductCard {...mockProps} />);
    // The price is rendered with a line break, so we need to match the exact text
    expect(getByText(/\$ 50\.000/)).toBeTruthy();
  });

  it('displays stock information', () => {
    const { getByText } = render(<ProductCard {...mockProps} />);
    expect(getByText('Pocas unidades')).toBeTruthy();
  });
});