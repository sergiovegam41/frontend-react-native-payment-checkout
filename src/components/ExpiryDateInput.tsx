import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { validateExpiryDate } from '../utils/cardValidation';

interface Props {
  month: string;
  year: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  error?: string;
}

const ExpiryDateInput: React.FC<Props> = ({
  month,
  year,
  onMonthChange,
  onYearChange,
  error,
}) => {
  const [monthFocused, setMonthFocused] = useState(false);
  const [yearFocused, setYearFocused] = useState(false);
  const handleMonthChange = (text: string) => {
    // Only allow numbers and limit to 2 digits
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 2) {
      // Auto-format: if user types "1", show "01"
      if (numericText.length === 1 && parseInt(numericText) > 1) {
        onMonthChange(`0${numericText}`);
      } else if (numericText.length === 2 && parseInt(numericText) > 12) {
        onMonthChange('12');
      } else {
        onMonthChange(numericText);
      }
    }
  };

  const handleYearChange = (text: string) => {
    // Only allow numbers and limit to 2 digits
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 2) {
      onYearChange(numericText);
    }
  };

  const isValid = validateExpiryDate(month, `20${year}`);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha de Expiración</Text>
      <View style={[
        styles.inputContainer,
        (monthFocused || yearFocused) && styles.focused,
        error && styles.error,
      ]}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={month}
            onChangeText={handleMonthChange}
            placeholder="MM"
            placeholderTextColor="#999999"
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setMonthFocused(true)}
            onBlur={() => setMonthFocused(false)}
          />
          <Text style={styles.separator}>/</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={handleYearChange}
            placeholder="YY"
            placeholderTextColor="#999999"
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setYearFocused(true)}
            onBlur={() => setYearFocused(false)}
          />
        </View>
      </View>
      {month.length === 2 && year.length === 2 && (
        <Text style={[styles.validationText, isValid ? styles.valid : styles.invalid]}>
          {isValid ? '✓ Fecha válida' : '✗ Fecha expirada o inválida'}
        </Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 56,
    justifyContent: 'center',
  },
  focused: {
    borderColor: '#2E7D32',
  },
  error: {
    borderColor: '#F26464', // Consistent soft red
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginHorizontal: 8,
  },
  validationText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  valid: {
    color: '#2E7D32',
  },
  invalid: {
    color: '#F26464', // Consistent soft red
  },
  errorText: {
    fontSize: 12,
    color: '#F26464', // Consistent soft red
    marginTop: 4,
  },
});

export default ExpiryDateInput;