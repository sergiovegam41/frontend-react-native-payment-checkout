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
import { Theme, createStyle } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

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
  
  // Check if form is valid for button state
  const isFormValid = () => {
    return (
      formData.cardNumber.trim() &&
      validateCardNumber(formData.cardNumber) &&
      formData.holderName.trim().length >= 3 &&
      formData.expirationMonth &&
      formData.expirationYear &&
      validateExpiryDate(formData.expirationMonth, `20${formData.expirationYear}`) &&
      formData.cvv.trim() &&
      validateCVV(formData.cvv)
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Ingresa los datos de tu tarjeta de crédito de forma segura
          </Text>

          <View style={styles.fakeDataContainer}>
            <TouchableOpacity style={styles.fakeDataButton} onPress={generateFakeCardData}>
              <View style={styles.fakeDataButtonContent}>
                <Icon name="document-text-outline" size={16} color={Theme.colors.secondary.main} />
                <Text style={styles.fakeDataButtonText}>Generar Datos de Prueba</Text>
              </View>
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

          <TouchableOpacity 
            style={[
              styles.submitButton, 
              isSubmitting && styles.submittingButton,
              !isFormValid() && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
          >
            <Text style={[
              styles.submitButtonText,
              !isFormValid() && styles.disabledButtonText
            ]}>
              {isSubmitting ? 'Validando...' : 'Continuar al Resumen'}
            </Text>
          </TouchableOpacity>

          <View style={styles.securityNoteContent}>
            <Icon name="shield-checkmark-outline" size={16} color={Theme.colors.text.secondary} />
            <Text style={styles.securityNote}>Tus datos están protegidos con encriptación de extremo a extremo</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  fakeDataContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  fakeDataButton: {
    backgroundColor: Theme.colors.secondary.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999, // Maximally rounded
    borderWidth: 1,
    borderColor: Theme.colors.secondary.main,
  },
  fakeDataButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fakeDataButtonText: {
    color: Theme.colors.secondary.main,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Theme.typography.fontFamily.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    ...createStyle.button('primary'),
    paddingVertical: 16,
    marginBottom: 16,
    // No shadows for clean Wompi design
  },
  submittingButton: {
    backgroundColor: Theme.colors.primary.light,
  },
  disabledButton: {
    backgroundColor: Theme.colors.neutral.gray[300],
  },
  submitButtonText: {
    ...createStyle.text.button('large', 'primary'),
  },
  disabledButtonText: {
    color: Theme.colors.text.disabled,
  },
  securityNoteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  securityNote: {
    fontSize: 12,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CreditCardFormScreen;