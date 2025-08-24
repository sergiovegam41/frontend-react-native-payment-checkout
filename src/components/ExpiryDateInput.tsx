import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import FormInput from './FormInput';
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
      <View style={styles.row}>
        <View style={styles.monthContainer}>
          <FormInput
            value={month}
            onChangeText={handleMonthChange}
            placeholder="MM"
            label=""
            keyboardType="numeric"
            maxLength={2}
            error={error && !isValid ? 'Mes inválido' : undefined}
          />
        </View>
        <Text style={styles.separator}>/</Text>
        <View style={styles.yearContainer}>
          <FormInput
            value={year}
            onChangeText={handleYearChange}
            placeholder="YY"
            label=""
            keyboardType="numeric"
            maxLength={2}
            error={error && !isValid ? 'Año inválido' : undefined}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthContainer: {
    flex: 1,
  },
  yearContainer: {
    flex: 1,
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginHorizontal: 12,
    marginTop: -8,
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
    color: '#D32F2F',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
});

export default ExpiryDateInput;