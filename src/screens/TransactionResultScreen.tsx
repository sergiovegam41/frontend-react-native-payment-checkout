import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/slices/cartSlice';
import { RootStackParamList } from '../types/navigation';
import { Theme, createStyle } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { paymentApi, CheckoutWithCardResponse, CheckoutStatusResponse } from '../services/paymentApi';

type TransactionResultNavigationProp = StackNavigationProp<RootStackParamList, 'TransactionResult'>;
type TransactionResultRouteProp = RouteProp<RootStackParamList, 'TransactionResult'>;

interface Props {
  navigation: TransactionResultNavigationProp;
  route: TransactionResultRouteProp;
}

const TransactionResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionData: initialData } = route.params;
  const dispatch = useAppDispatch();
  
  const [transactionData, setTransactionData] = useState<CheckoutWithCardResponse>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;

  const goToHome = () => {
    dispatch(clearCart()); // Ensure cart is completely cleared
    navigation.reset({
      index: 0,
      routes: [{ name: 'ProductsHome' }],
    });
  };

  const formatPrice = (amount: number) => {
    return `${amount.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`;
  };

  const handleUpdateStatus = async (fromTimer: boolean = false) => {
    if (!transactionData.checkout_id) {
      Alert.alert('Error', 'No se encontró el ID del checkout');
      return;
    }

    setIsUpdating(true);
    if (fromTimer) {
      setCountdown(null);
    }
    
    try {
      const apiResponse = await paymentApi.getCheckoutStatus(transactionData.checkout_id);
      const statusResponse = apiResponse.data;
      
      // Map the status response to our transaction data format
      const mappedStatus = statusResponse.status === 'PAID' ? 'APPROVED' : 
                          statusResponse.status === 'FAILED' ? 'DECLINED' : 
                          'PENDING';
      
      // Update transaction data with new status
      setTransactionData(prev => ({
        ...prev,
        transaction_status: mappedStatus,
        total: statusResponse.total
      }));

      // If status changed from PENDING, stop the auto-refresh completely
      if (mappedStatus !== 'PENDING') {
        setCountdown(null);
        setRetryCount(0);
        console.log('Payment finalized with status:', mappedStatus);
      } else if (fromTimer && retryCount < MAX_RETRIES) {
        // Only increment retry count and continue if we haven't exceeded max retries
        setRetryCount(prev => prev + 1);
        console.log(`Status still pending, retry ${retryCount + 1}/${MAX_RETRIES}`);
      } else if (fromTimer && retryCount >= MAX_RETRIES) {
        // Stop retrying if max attempts reached
        setCountdown(null);
        console.log('Max retry attempts reached, stopping auto-refresh');
      }

      if (!fromTimer) {
        Alert.alert(
          'Estado Actualizado', 
          `El estado de la transacción ahora es: ${mappedStatus === 'APPROVED' ? 'PAGADO' : mappedStatus === 'DECLINED' ? 'FALLIDO' : 'PENDIENTE'}`
        );
      }
      
    } catch (error: any) {
      console.error('Update status error:', error);
      if (fromTimer && retryCount >= MAX_RETRIES) {
        setCountdown(null);
      }
      if (!fromTimer) {
        Alert.alert('Error', 'No se pudo actualizar el estado de la transacción');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Auto-refresh countdown effect - starts automatically for PENDING transactions
  useEffect(() => {
    // Only start countdown for PENDING transactions if we haven't exceeded retry limit
    if (transactionData.transaction_status === 'PENDING' && countdown === null && retryCount < MAX_RETRIES && !isUpdating) {
      console.log('Starting countdown timer for retry', retryCount + 1);
      setCountdown(5); // Wait 5 seconds between retries
    }
  }, [transactionData.transaction_status, retryCount, isUpdating]);

  useEffect(() => {
    // Stop countdown if status is not PENDING or max retries reached
    if (transactionData.transaction_status !== 'PENDING' || retryCount >= MAX_RETRIES) {
      if (countdown !== null) {
        console.log('Stopping countdown - Status:', transactionData.transaction_status, 'Retries:', retryCount);
        setCountdown(null);
      }
      return;
    }

    // Don't continue if countdown is null or currently updating
    if (countdown === null || isUpdating) {
      return;
    }

    if (countdown === 0) {
      handleUpdateStatus(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, transactionData.transaction_status, retryCount, isUpdating]);

  const getStatusIcon = () => {
    switch (transactionData.transaction_status) {
      case 'APPROVED':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time-outline';
      case 'DECLINED':
        return 'close-circle';
      case 'ERROR':
        return 'alert-circle';
      default:
        return 'document-text-outline';
    }
  };

  const getStatusMessage = () => {
    switch (transactionData.transaction_status) {
      case 'APPROVED':
        return '¡Pago Exitoso!';
      case 'PENDING':
        return 'Pago Pendiente';
      case 'DECLINED':
        return 'Pago Rechazado';
      case 'ERROR':
        return 'Error en el Pago';
      default:
        return 'Estado del Pago';
    }
  };

  const getStatusDescription = () => {
    switch (transactionData.transaction_status) {
      case 'APPROVED':
        return 'Tu compra ha sido procesada exitosamente.\nRecibirás un email de confirmación en breve.';
      case 'PENDING':
        return 'Tu pago está siendo procesado.\nTe notificaremos cuando se complete.';
      case 'DECLINED':
        return 'El pago fue rechazado.\nIntenta con otro método de pago.';
      case 'ERROR':
        return 'Hubo un error procesando el pago.\nIntenta nuevamente o contacta soporte.';
      default:
        return 'Revisa el estado de tu transacción.';
    }
  };

  const getStatusColor = () => {
    switch (transactionData.transaction_status) {
      case 'APPROVED':
        return Theme.colors.status.success;
      case 'PENDING':
        return Theme.colors.status.pending;
      case 'DECLINED':
      case 'ERROR':
        return Theme.colors.status.error;
      default:
        return Theme.colors.text.secondary;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.statusContainer}>
        <Icon name={getStatusIcon()} size={48} color={getStatusColor()} />
        <Text style={styles.title}>{getStatusMessage()}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.transactionId}>
          Checkout ID: {transactionData.checkout_id || 'N/A'}
        </Text>
        {transactionData.transaction_id && (
          <Text style={styles.transactionId}>
            Transacción: {transactionData.transaction_id}
          </Text>
        )}
        
        {transactionData.payment_method_info && (
          <View style={styles.paymentInfoContainer}>
            <Text style={styles.sectionTitle}>Método de Pago</Text>
            <Text style={styles.paymentMethod}>
              {transactionData.payment_method_info.brand || 'Tarjeta'} **** {transactionData.payment_method_info.last_four || '****'}
            </Text>
            <Text style={styles.cardHolder}>
              {transactionData.payment_method_info.card_holder || 'Titular de la tarjeta'}
            </Text>
          </View>
        )}

        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          {transactionData.subtotal && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatPrice(transactionData.subtotal)}</Text>
            </View>
          )}
          {transactionData.taxes && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Impuestos:</Text>
              <Text style={styles.summaryValue}>{formatPrice(transactionData.taxes)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatPrice(transactionData.total || 0)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
          onPress={() => handleUpdateStatus(false)}
          disabled={isUpdating || countdown !== null}
        >
          <View style={styles.updateButtonContent}>
            <Icon name="refresh-outline" size={16} color="#ffffff" />
            <Text style={styles.updateButtonText}>
              {isUpdating 
                ? 'Actualizando...' 
                : countdown !== null && transactionData.transaction_status === 'PENDING'
                ? `Actualizando en ${countdown}...`
                : 'Actualizar Estado'}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={goToHome}
        >
          <Text style={styles.homeButtonText}>Volver al Comercio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  countdownText: {
    fontSize: 14,
    color: Theme.colors.status.pending,
    marginTop: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    color: Theme.colors.text.primary,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: Theme.colors.background.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Theme.colors.border.light,
  },
  transactionId: {
    fontSize: 12,
    marginBottom: 8,
    color: '#999999',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  paymentInfoContainer: {
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text.primary,
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 16,
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  cardHolder: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  summaryContainer: {
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Theme.colors.text.primary,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: Theme.colors.border.light,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.secondary.main,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666666',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  updateButton: {
    backgroundColor: Theme.colors.secondary.main,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  updateButtonDisabled: {
    backgroundColor: Theme.colors.secondary.light,
  },
  updateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: Theme.colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TransactionResultScreen;