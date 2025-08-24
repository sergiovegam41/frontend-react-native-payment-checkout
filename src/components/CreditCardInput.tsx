import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { detectCardType, formatCardNumber, validateCardNumber } from '../utils/cardValidation';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  label: string;
  error?: string;
}

const CreditCardInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const cardType = detectCardType(value);
  const isValid = validateCardNumber(value);

  const handleTextChange = (text: string) => {
    const formatted = formatCardNumber(text);
    onChangeText(formatted);
  };

  const getCardTypeIcon = () => {
    switch (cardType) {
      case 'VISA':
        return '💳'; // In real app, use actual VISA logo
      case 'MASTERCARD':
        return '💳'; // In real app, use actual MasterCard logo
      default:
        return '💳';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          keyboardType="numeric"
          maxLength={19} // 16 digits + 3 spaces
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View style={styles.cardTypeContainer}>
          <Text style={styles.cardTypeIcon}>{getCardTypeIcon()}</Text>
          {cardType !== 'UNKNOWN' && (
            <Text style={styles.cardTypeText}>{cardType}</Text>
          )}
          {value.length > 12 && (
            <Text style={[styles.validationIcon, isValid ? styles.valid : styles.invalid]}>
              {isValid ? '✓' : '✗'}
            </Text>
          )}
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {cardType !== 'UNKNOWN' && (
        <Text style={styles.cardTypeLabel}>Tarjeta detectada: {cardType}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 56,
  },
  focused: {
    borderColor: '#2E7D32',
  },
  error: {
    borderColor: '#D32F2F',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333333',
    fontFamily: 'monospace',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTypeIcon: {
    fontSize: 24,
    marginRight: 4,
  },
  cardTypeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: 'bold',
    marginRight: 8,
  },
  validationIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  valid: {
    color: '#2E7D32',
  },
  invalid: {
    color: '#D32F2F',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  cardTypeLabel: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default CreditCardInput;