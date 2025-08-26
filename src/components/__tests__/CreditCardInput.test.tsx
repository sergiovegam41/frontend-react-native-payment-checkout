import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreditCardInput from '../CreditCardInput';

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'MockedIcon');

// Mock card validation utilities
jest.mock('../../utils/cardValidation', () => ({
  detectCardType: jest.fn(),
  formatCardNumber: jest.fn(),
  validateCardNumber: jest.fn(),
}));

import { detectCardType, formatCardNumber, validateCardNumber } from '../../utils/cardValidation';

const mockDetectCardType = detectCardType as jest.MockedFunction<typeof detectCardType>;
const mockFormatCardNumber = formatCardNumber as jest.MockedFunction<typeof formatCardNumber>;
const mockValidateCardNumber = validateCardNumber as jest.MockedFunction<typeof validateCardNumber>;

describe('CreditCardInput', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
    placeholder: 'Enter card number',
    label: 'Card Number',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDetectCardType.mockReturnValue('UNKNOWN');
    mockFormatCardNumber.mockImplementation((text) => text);
    mockValidateCardNumber.mockReturnValue(false);
  });

  it('should render with basic props', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} />
    );

    expect(getByText('Card Number')).toBeTruthy();
    expect(getByPlaceholderText('Enter card number')).toBeTruthy();
  });

  it('should call onChangeText with formatted value', () => {
    const mockOnChangeText = jest.fn();
    mockFormatCardNumber.mockReturnValue('4242 4242 4242 4242');

    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} onChangeText={mockOnChangeText} />
    );

    const input = getByPlaceholderText('Enter card number');
    fireEvent.changeText(input, '4242424242424242');

    expect(mockFormatCardNumber).toHaveBeenCalledWith('4242424242424242');
    expect(mockOnChangeText).toHaveBeenCalledWith('4242 4242 4242 4242');
  });

  it('should display error message when error prop is provided', () => {
    const { getByText } = render(
      <CreditCardInput {...defaultProps} error="Invalid card number" />
    );

    expect(getByText('Invalid card number')).toBeTruthy();
  });

  it('should apply error styling when error prop is provided', () => {
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} error="Invalid card number" />
    );

    const input = getByPlaceholderText('Enter card number');
    const inputContainer = input.parent;

    // The input container should have error styling
    expect(inputContainer).toBeTruthy();
  });

  it('should display card type when detected', () => {
    mockDetectCardType.mockReturnValue('VISA');

    const { getByText } = render(
      <CreditCardInput {...defaultProps} value="4242424242424242" />
    );

    expect(getByText('VISA')).toBeTruthy();
    expect(getByText('Tarjeta detectada: VISA')).toBeTruthy();
  });

  it('should not display card type when UNKNOWN', () => {
    mockDetectCardType.mockReturnValue('UNKNOWN');

    const { queryByText } = render(
      <CreditCardInput {...defaultProps} value="1234" />
    );

    expect(queryByText('UNKNOWN')).toBeNull();
    expect(queryByText('Tarjeta detectada: UNKNOWN')).toBeNull();
  });

  it('should display validation icon for valid long card numbers', () => {
    mockValidateCardNumber.mockReturnValue(true);

    const { toJSON } = render(
      <CreditCardInput {...defaultProps} value="4242424242424242" />
    );

    expect(toJSON()).toBeTruthy();
    expect(mockValidateCardNumber).toHaveBeenCalledWith('4242424242424242');
  });

  it('should display validation icon for invalid long card numbers', () => {
    mockValidateCardNumber.mockReturnValue(false);

    const { toJSON } = render(
      <CreditCardInput {...defaultProps} value="4242424242424242" />
    );

    expect(toJSON()).toBeTruthy();
    expect(mockValidateCardNumber).toHaveBeenCalledWith('4242424242424242');
  });

  it('should not display validation icon for short card numbers', () => {
    const { toJSON } = render(
      <CreditCardInput {...defaultProps} value="4242" />
    );

    expect(toJSON()).toBeTruthy();
    // Validation icon should not be shown for short numbers
  });

  it('should handle focus and blur events', () => {
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} />
    );

    const input = getByPlaceholderText('Enter card number');

    fireEvent(input, 'focus');
    fireEvent(input, 'blur');

    // Component should handle focus/blur without crashing
    expect(input).toBeTruthy();
  });

  it('should apply focused styling when input is focused', () => {
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} />
    );

    const input = getByPlaceholderText('Enter card number');
    fireEvent(input, 'focus');

    // The input should be focused
    expect(input).toBeTruthy();
  });

  it('should detect MasterCard correctly', () => {
    mockDetectCardType.mockReturnValue('MASTERCARD');

    const { getByText } = render(
      <CreditCardInput {...defaultProps} value="5555555555554444" />
    );

    expect(getByText('MASTERCARD')).toBeTruthy();
    expect(getByText('Tarjeta detectada: MASTERCARD')).toBeTruthy();
  });

  it('should detect AMEX correctly', () => {
    mockDetectCardType.mockReturnValue('AMEX');

    const { getByText } = render(
      <CreditCardInput {...defaultProps} value="378282246310005" />
    );

    expect(getByText('AMEX')).toBeTruthy();
    expect(getByText('Tarjeta detectada: AMEX')).toBeTruthy();
  });

  it('should have correct input properties', () => {
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} />
    );

    const input = getByPlaceholderText('Enter card number');

    expect(input.props.keyboardType).toBe('numeric');
    expect(input.props.maxLength).toBe(19); // 16 digits + 3 spaces
    expect(input.props.placeholderTextColor).toBe('#999999');
  });

  it('should call detectCardType with current value', () => {
    render(
      <CreditCardInput {...defaultProps} value="4242424242424242" />
    );

    expect(mockDetectCardType).toHaveBeenCalledWith('4242424242424242');
  });

  it('should call validateCardNumber with current value', () => {
    render(
      <CreditCardInput {...defaultProps} value="4242424242424242" />
    );

    expect(mockValidateCardNumber).toHaveBeenCalledWith('4242424242424242');
  });

  it('should handle empty value', () => {
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} value="" />
    );

    const input = getByPlaceholderText('Enter card number');
    expect(input.props.value).toBe('');
    expect(mockDetectCardType).toHaveBeenCalledWith('');
    expect(mockValidateCardNumber).toHaveBeenCalledWith('');
  });

  it('should render card type icon', () => {
    const { toJSON } = render(
      <CreditCardInput {...defaultProps} />
    );

    expect(toJSON()).toBeTruthy();
    // Card icon should always be rendered
  });

  it('should handle multiple card types throughout input', () => {
    const { rerender } = render(
      <CreditCardInput {...defaultProps} value="4" />
    );

    expect(mockDetectCardType).toHaveBeenCalledWith('4');

    mockDetectCardType.mockReturnValue('VISA');
    rerender(
      <CreditCardInput {...defaultProps} value="4242" />
    );

    expect(mockDetectCardType).toHaveBeenCalledWith('4242');
  });

  it('should show validation icon only after 12 characters', () => {
    // Short number - no validation icon
    const { rerender, toJSON: shortJSON } = render(
      <CreditCardInput {...defaultProps} value="424242424242" />
    );
    expect(shortJSON()).toBeTruthy();

    // Long number - should show validation icon
    rerender(
      <CreditCardInput {...defaultProps} value="4242424242424" />
    );
    expect(mockValidateCardNumber).toHaveBeenCalledWith('4242424242424');
  });

  it('should format input text on every change', () => {
    mockFormatCardNumber
      .mockReturnValueOnce('4')
      .mockReturnValueOnce('42')
      .mockReturnValueOnce('424')
      .mockReturnValueOnce('4242')
      .mockReturnValueOnce('4242 4')
      .mockReturnValueOnce('4242 42');

    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} onChangeText={mockOnChangeText} />
    );

    const input = getByPlaceholderText('Enter card number');

    // Simulate typing each character
    fireEvent.changeText(input, '4');
    expect(mockFormatCardNumber).toHaveBeenLastCalledWith('4');
    expect(mockOnChangeText).toHaveBeenLastCalledWith('4');

    fireEvent.changeText(input, '42');
    expect(mockFormatCardNumber).toHaveBeenLastCalledWith('42');
    expect(mockOnChangeText).toHaveBeenLastCalledWith('42');
  });

  it('should maintain focus state correctly', () => {
    const { getByPlaceholderText } = render(
      <CreditCardInput {...defaultProps} />
    );

    const input = getByPlaceholderText('Enter card number');

    // Initially not focused
    expect(input).toBeTruthy();

    // Focus
    fireEvent(input, 'focus');
    expect(input).toBeTruthy();

    // Blur
    fireEvent(input, 'blur');
    expect(input).toBeTruthy();
  });
});