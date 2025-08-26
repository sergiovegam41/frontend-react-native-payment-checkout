import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import CustomModal from '../CustomModal';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockProps = {
  visible: true,
  onClose: jest.fn(),
  title: 'Test Modal',
  message: 'Test Content',
  icon: 'checkmark-circle',
};

describe('CustomModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const component = render(<CustomModal {...mockProps} />);
    expect(component).toBeTruthy();
  });

  it('displays title when provided', () => {
    const { getByText } = render(<CustomModal {...mockProps} />);
    expect(getByText('Test Modal')).toBeTruthy();
  });

  it('renders message content', () => {
    const { getByText } = render(<CustomModal {...mockProps} />);
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(<CustomModal {...mockProps} visible={false} />);
    expect(queryByText('Test Modal')).toBeNull();
  });
});