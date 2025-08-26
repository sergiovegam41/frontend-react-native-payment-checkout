import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/api';
import { clearCart } from '../store/slices/cartSlice';
import { paymentApi, CheckoutWithCardResponse, ApiResponse } from '../services/paymentApi';
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
  const { cardData } = useSelector((state: RootState) => state.payment);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    icon: '',
    buttons: [] as any[]
  });

  const formatPrice = (priceInCOP: number) => {
    return `${priceInCOP.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const subtotal = item.product.price * item.quantity; // Already in cents

    return (
      <View style={styles.cartItem}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.quantity}>Cantidad: {item.quantity} × {formatPrice(item.product.price)}</Text>
        </View>
        <Text style={styles.subtotal}>{formatPrice(subtotal)}</Text>
      </View>
    );
  };

  const handlePayment = async () => {
    if (!cardData || items.length === 0) {
      setModalConfig({
        title: 'Error',
        message: 'Faltan datos para procesar el pago',
        icon: '⚠️',
        buttons: [{ text: 'OK' }]
      });
      setShowModal(true);
      return;
    }

    // Validate total amount to prevent integer overflow (totalAmount is in cents)
    const totalAmountInCOP = totalAmount / 100;
    if (!paymentApi.validateTotalAmount(totalAmountInCOP)) {
      setModalConfig({
        title: 'Error',
        message: 'El monto total es demasiado alto para procesar. Por favor reduce la cantidad de productos.',
        icon: '⚠️',
        buttons: [{ text: 'OK' }]
      });
      setShowModal(true);
      return;
    }

    setIsProcessing(true);
    setModalConfig({
      title: 'Procesando...',
      message: 'Procesando tu pago...',
      icon: '⏳',
      buttons: []
    });
    setShowModal(true);

    try {
      // Prepare checkout request for new API
      const checkoutRequest = {
        items: items.map(item => ({
          id: item.product.id,
          quantity: item.quantity
        })),
        customer_email: 'cliente@ejemplo.com', // TODO: Get from user profile
        card_data: {
          number: cardData.number.replace(/\s/g, ''), // Remove all spaces
          exp_month: cardData.expirationMonth.padStart(2, '0'), // Ensure 2 digits
          exp_year: cardData.expirationYear.length > 2 ? cardData.expirationYear.slice(-2) : cardData.expirationYear, // Only last 2 digits
          cvc: cardData.cvv,
          card_holder: cardData.holderName.toUpperCase(),
        }
      };

      // Call the new checkout API
      const response: ApiResponse<CheckoutWithCardResponse> = await paymentApi.checkoutWithCard(checkoutRequest);
      
      // Clear cart on successful payment creation
      dispatch(clearCart());
      
      setIsProcessing(false);
      setShowModal(false);
      
      // Navigate to result screen with payment data
      navigation.replace('TransactionResult', { 
        transactionData: response.data
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      
      setIsProcessing(false);
      setShowModal(false);
      
      // Show error modal with generic message
      setModalConfig({
        title: 'Tarjeta Inválida',
        message: 'La tarjeta utilizada no es válida. Por favor verifica los datos o intenta con otra tarjeta.',
        icon: '❌',
        buttons: [{ text: 'OK' }]
      });
      setShowModal(true);
    }
  };


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
          <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
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