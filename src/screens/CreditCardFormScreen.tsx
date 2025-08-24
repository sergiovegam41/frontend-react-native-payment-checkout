import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCreditCard } from '../store/slices/paymentSlice';
import { detectCardType, validateCardNumber, validateCVV, validateExpiryDate } from '../utils/cardValidation';

import CreditCardInput from '../components/CreditCardInput';
import FormInput from '../components/FormInput';
import ExpiryDateInput from '../components/ExpiryDateInput';

type CreditCardFormNavigationProp = StackNavigationProp<RootStackParamList, 'CreditCardForm'>;

interface Props {
  navigation: CreditCardFormNavigationProp;
}

interface FormData {
  cardNumber: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
}

interface FormErrors {
  cardNumber?: string;
  holderName?: string;
  expirationDate?: string;
  cvv?: string;
}

const CreditCardFormScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const currentCard = useAppSelector(state => state.payment.paymentData.creditCard);

  const [formData, setFormData] = useState<FormData>({
    cardNumber: currentCard?.number || '',
    holderName: currentCard?.holderName || '',
    expirationMonth: currentCard?.expirationMonth || '',
    expirationYear: currentCard?.expirationYear || '',
    cvv: currentCard?.cvv || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate fake data for testing
  const generateFakeCardData = () => {
    const fakeCards = [
      {
        number: '4111 1111 1111 1111', // VISA test card
        holder: 'JUAN PEREZ',
        month: '12',
        year: '26',
        cvv: '123',
      },
      {
        number: '5555 5555 5555 4444', // MasterCard test card
        holder: 'MARIA GARCIA',
        month: '08',
        year: '25',
        cvv: '456',
      },
    ];
    
    const randomCard = fakeCards[Math.floor(Math.random() * fakeCards.length)];
    
    setFormData({
      cardNumber: randomCard.number,
      holderName: randomCard.holder,
      expirationMonth: randomCard.month,
      expirationYear: randomCard.year,
      cvv: randomCard.cvv,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate card number
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Número de tarjeta requerido';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    // Validate holder name
    if (!formData.holderName.trim()) {
      newErrors.holderName = 'Nombre del titular requerido';
    } else if (formData.holderName.trim().length < 3) {
      newErrors.holderName = 'Nombre muy corto';
    }

    // Validate expiration date
    if (!formData.expirationMonth || !formData.expirationYear) {
      newErrors.expirationDate = 'Fecha de expiración requerida';
    } else if (!validateExpiryDate(formData.expirationMonth, `20${formData.expirationYear}`)) {
      newErrors.expirationDate = 'Fecha de expiración inválida o expirada';
    }

    // Validate CVV
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV requerido';
    } else if (!validateCVV(formData.cvv)) {
      newErrors.cvv = 'CVV inválido (3-4 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    // Save to Redux store
    const cardType = detectCardType(formData.cardNumber);
    const creditCardData = {
      number: formData.cardNumber,
      holderName: formData.holderName,
      expirationMonth: formData.expirationMonth,
      expirationYear: formData.expirationYear,
      cvv: formData.cvv,
      cardType,
    };

    dispatch(setCreditCard(creditCardData));

    // Simulate processing delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate('PaymentSummary');
    }, 1000);
  };

  const cardType = detectCardType(formData.cardNumber);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Información de Tarjeta</Text>
          <Text style={styles.subtitle}>
            Ingresa los datos de tu tarjeta de crédito de forma segura
          </Text>

          <View style={styles.fakeDataContainer}>
            <TouchableOpacity style={styles.fakeDataButton} onPress={generateFakeCardData}>
              <Text style={styles.fakeDataButtonText}>📝 Generar Datos de Prueba</Text>
            </TouchableOpacity>
          </View>

          <CreditCardInput
            value={formData.cardNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, cardNumber: text }))}
            placeholder="1234 5678 9012 3456"
            label="Número de Tarjeta"
            error={errors.cardNumber}
          />

          <FormInput
            value={formData.holderName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, holderName: text.toUpperCase() }))}
            placeholder="NOMBRE COMO APARECE EN LA TARJETA"
            label="Nombre del Titular"
            error={errors.holderName}
            autoCapitalize="characters"
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <ExpiryDateInput
                month={formData.expirationMonth}
                year={formData.expirationYear}
                onMonthChange={(month) => setFormData(prev => ({ ...prev, expirationMonth: month }))}
                onYearChange={(year) => setFormData(prev => ({ ...prev, expirationYear: year }))}
                error={errors.expirationDate}
              />
            </View>
            <View style={styles.halfWidth}>
              <FormInput
                value={formData.cvv}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cvv: text.replace(/[^0-9]/g, '') }))}
                placeholder="123"
                label="CVV"
                error={errors.cvv}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          {cardType !== 'UNKNOWN' && (
            <View style={styles.cardTypeInfo}>
              <Text style={styles.cardTypeTitle}>Tarjeta Detectada:</Text>
              <Text style={styles.cardTypeName}>{cardType}</Text>
              <Text style={styles.cardTypeDescription}>
                {cardType === 'VISA' ? '✓ Tarjeta VISA válida' : '✓ Tarjeta MasterCard válida'}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submittingButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Validando...' : 'Continuar al Resumen'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.securityNote}>
            🔒 Tus datos están protegidos con encriptación de extremo a extremo
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  fakeDataContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  fakeDataButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  fakeDataButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  cardTypeInfo: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  cardTypeTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  cardTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  cardTypeDescription: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submittingButton: {
    backgroundColor: '#81C784',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  securityNote: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CreditCardFormScreen;