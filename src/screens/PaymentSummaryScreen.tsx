import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/api';
import { clearCart } from '../store/slices/cartSlice';
import { 
  createTransaction, 
  checkTransactionStatus, 
  clearCurrentTransaction 
} from '../store/slices/paymentSlice';
import { paymentApi } from '../services/paymentApi';
import { ENV } from '../config/environment';
import LoadingIndicator from '../components/LoadingIndicator';
import CustomModal from '../components/CustomModal';
import { Theme, createStyle } from '../theme';

type PaymentSummaryNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSummary'>;

interface Props {
  navigation: PaymentSummaryNavigationProp;
}

const PaymentSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { cardData, currentTransaction, isProcessing, error } = useSelector((state: RootState) => state.payment);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    icon: '',
    buttons: [] as any[]
  });

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const subtotal = parseFloat(item.product.price) * item.quantity;

    return (
      <View style={styles.cartItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.quantity}>Cantidad: {item.quantity} × {formatPrice(item.product.price)}</Text>
        </View>
        <Text style={styles.subtotal}>{formatPrice(subtotal.toString())}</Text>
      </View>
    );
  };

  const handlePayment = async () => {
    if (!cardData || items.length === 0) {
      setModalConfig({
        title: 'Error',
        message: 'Faltan datos para procesar el pago',
        icon: 'alert-circle-outline',
        buttons: [{ text: 'OK' }]
      });
      setShowModal(true);
      return;
    }

    setShowModal(true);

    // Prepare transaction request
    const transactionRequest = {
      amount_in_cents: paymentApi.formatAmountToCents(totalAmount),
      currency: 'COP' as const,
      customer_email: 'customer@example.com', // TODO: Get from user profile
      reference: paymentApi.generateTransactionReference(),
      card_info: {
        number: cardData.number.replace(/\s/g, ''),
        cvc: cardData.cvv,
        exp_month: cardData.expirationMonth.padStart(2, '0'),
        exp_year: cardData.expirationYear,
        card_holder: cardData.holderName.toUpperCase(),
      },
      customer_data: {
        email: 'customer@example.com',
        full_name: cardData.holderName,
        phone_number: '+573001234567',
        legal_id: '12345678',
        legal_id_type: 'CC' as const,
      },
    };

    try {
      const result = await dispatch(createTransaction(transactionRequest));
      
      if (createTransaction.fulfilled.match(result)) {
        setShowModal(false);
        
        if (result.payload.success) {
          // Clear cart on successful transaction creation
          dispatch(clearCart());
          
          // Navigate to transaction result with the transaction ID
          navigation.replace('TransactionResult', { 
            transactionId: result.payload.transaction.id || '' 
          });
        } else {
          // Handle transaction creation failure
          setModalConfig({
            title: 'Error de Pago',
            message: result.payload.error?.message || 'No se pudo procesar tu pago',
            icon: 'close-circle-outline',
            buttons: [{ text: 'OK' }]
          });
          setShowModal(true);
        }
      } else {
        // Handle rejected promise
        setShowModal(false);
        const errorMessage = result.payload?.message || 'Error desconocido';
        setModalConfig({
          title: 'Error de Pago',
          message: errorMessage,
          icon: 'close-circle-outline',
          buttons: [{ text: 'OK' }]
        });
        setShowModal(true);
      }
    } catch (error: any) {
      setShowModal(false);
      setModalConfig({
        title: 'Error de Conexión',
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        icon: 'wifi-outline',
        buttons: [{ text: 'OK' }]
      });
      setShowModal(true);
    }
  };

  // Effect to handle transaction status updates
  useEffect(() => {
    if (currentTransaction && currentTransaction.status === 'PENDING' && currentTransaction.id) {
      // Poll for transaction status updates
      const interval = setInterval(async () => {
        try {
          await dispatch(checkTransactionStatus(currentTransaction.id!));
        } catch (error) {
          console.error('Error checking transaction status:', error);
        }
      }, ENV.PAYMENT.POLLING_INTERVAL);

      // Clear interval after configured timeout
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, ENV.PAYMENT.POLLING_TIMEOUT);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentTransaction, dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.cardSection}>
        <Text style={styles.paymentSectionTitle}>Método de Pago</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>**** **** **** {cardData?.number?.slice(-4) || '0000'}</Text>
          <Text style={styles.cardText}>{cardData?.holderName || 'Nombre del titular'}</Text>
        </View>
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.productsSectionTitle}>Productos</Text>
        <View style={styles.productListSeparator} />
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product.id}
          style={styles.cartList}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Pagar:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalAmount.toString())}</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Procesando...' : 'Procesar Pago'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Processing Modal */}
      <Modal
        visible={showModal && isProcessing}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LoadingIndicator />
            <Text style={styles.modalText}>Procesando tu pago...</Text>
            <Text style={styles.modalSubtext}>Por favor espera</Text>
          </View>
        </View>
      </Modal>

      {/* Error/Success Modal */}
      <CustomModal
        visible={showModal && !isProcessing && modalConfig.title !== ''}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        buttons={modalConfig.buttons.length > 0 ? modalConfig.buttons : [{ text: 'OK' }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createStyle.layout.screenContainer(),
    paddingHorizontal: 0,
  },
  cardSection: {
    paddingHorizontal: Theme.spacing.layout.containerPadding, // Same as product list
    paddingVertical: Theme.spacing.base,
    // Remove top margin for tighter layout
    backgroundColor: Theme.colors.background.secondary,
    borderRadius: Theme.spacing.card.borderRadius,
    // No shadow for clean Wompi design
  },
  paymentSectionTitle: {
    ...createStyle.text.heading(4),
    marginBottom: Theme.spacing.xl, // Normal spacing for payment section
  },
  productsSectionTitle: {
    ...createStyle.text.heading(4),
    marginBottom: Theme.spacing.sm, // Closer to product list
  },
  cardInfo: {
    backgroundColor: Theme.colors.background.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.base,
    borderWidth: 1,
    borderColor: Theme.colors.border.light,
  },
  cardText: {
    ...Theme.typography.textStyles.body,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: Theme.spacing.layout.containerPadding,
    paddingTop: Theme.spacing.sm,
    // No bottom margin to extend fully to the bottom
  },
  productListSeparator: {
    height: 1,
    backgroundColor: Theme.colors.border.light,
    marginBottom: Theme.spacing.sm,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.base,
    backgroundColor: Theme.colors.background.surface,
    borderRadius: Theme.borderRadius.base,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border.light,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...Theme.typography.textStyles.body,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  quantity: {
    ...Theme.typography.textStyles.bodySmall,
    color: Theme.colors.text.secondary,
  },
  subtotal: {
    ...Theme.typography.textStyles.price,
    color: Theme.colors.secondary.main,
  },
  totalContainer: {
    backgroundColor: '#FAFAFA', // Lighter background
    padding: Theme.spacing.layout.containerPadding,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border.light,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...createStyle.text.heading(4),
  },
  totalAmount: {
    ...Theme.typography.textStyles.priceLarge,
    color: Theme.colors.secondary.main,
  },
  buttonContainer: {
    backgroundColor: '#FAFAFA', // Same lighter background as total container
    padding: Theme.spacing.layout.containerPadding,
  },
  payButton: {
    ...createStyle.button('primary'), // Revert to original green button
    paddingVertical: Theme.spacing.button.paddingLarge,
    // No shadow for clean Wompi design
  },
  payButtonDisabled: {
    backgroundColor: Theme.colors.neutral.gray[400],
  },
  payButtonText: {
    ...createStyle.text.button('large', 'primary'), // Revert to white text
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.background.overlay,
    ...createStyle.layout.centerContent(),
  },
  modalContent: {
    backgroundColor: Theme.colors.background.surface,
    padding: Theme.spacing.modal.padding + Theme.spacing.sm,
    borderRadius: Theme.spacing.modal.borderRadius,
    alignItems: 'center',
    // No shadow for clean Wompi design
  },
  modalText: {
    ...createStyle.text.heading(4),
    marginTop: Theme.spacing.base,
    textAlign: 'center',
  },
  modalSubtext: {
    ...Theme.typography.textStyles.bodySmall,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
});

export default PaymentSummaryScreen;