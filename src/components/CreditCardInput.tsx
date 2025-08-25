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
import { Theme } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

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
    return (
      <Icon 
        name="card-outline" 
        size={24} 
        color={Theme.colors.primary.main}
      />
    );
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
          <View style={styles.cardTypeIconContainer}>{getCardTypeIcon()}</View>
          {cardType !== 'UNKNOWN' && (
            <Text style={styles.cardTypeText}>{cardType}</Text>
          )}
          {value.length > 12 && (
            <View style={styles.validationIconContainer}>
              <Icon 
                name={isValid ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={isValid ? Theme.colors.status.success : Theme.colors.status.error}
              />
            </View>
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
    borderColor: '#F26464', // Consistent soft red
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
  cardTypeIconContainer: {
    marginRight: 4,
  },
  cardTypeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: 'bold',
    marginRight: 8,
  },
  validationIconContainer: {
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#F26464', // Consistent soft red
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