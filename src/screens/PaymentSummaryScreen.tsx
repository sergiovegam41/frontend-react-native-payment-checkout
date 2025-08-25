import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/api';
import { clearCart } from '../store/slices/cartSlice';
import LoadingIndicator from '../components/LoadingIndicator';

type PaymentSummaryNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSummary'>;

interface Props {
  navigation: PaymentSummaryNavigationProp;
}

const PaymentSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { cardData } = useSelector((state: RootState) => state.payment);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    setIsProcessing(true);
    setShowModal(true);

    try {
      // Simular llamada a API de pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular éxito o fallo aleatorio
      const isSuccess = Math.random() > 0.3; // 70% éxito
      
      if (isSuccess) {
        const transactionId = Date.now().toString();
        dispatch(clearCart());
        setShowModal(false);
        navigation.replace('TransactionResult', { transactionId });
      } else {
        throw new Error('Error procesando el pago');
      }
    } catch (error) {
      setShowModal(false);
      Alert.alert(
        'Error de Pago',
        'No se pudo procesar tu pago. Por favor intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Método de Pago</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>**** **** **** {cardData?.number?.slice(-4) || '0000'}</Text>
          <Text style={styles.cardText}>{cardData?.name || 'Nombre del titular'}</Text>
        </View>
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Productos</Text>
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
          <Text style={styles.totalLabel}>Total a Pagar:</Text>
          <Text style={styles.totalAmount}>{formatPrice(totalAmount.toString())}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <Text style={styles.payButtonText}>
          {isProcessing ? 'Procesando...' : 'Procesar Pago'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cardSection: {
    margin: 20,
    marginTop: 30,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 24,
  },
  cardInfo: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cardText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 4,
  },
  productsSection: {
    flex: 1,
    margin: 20,
    marginTop: 30,
  },
  cartList: {
    maxHeight: 200,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#666666',
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  totalContainer: {
    backgroundColor: '#f0f2f5',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  payButton: {
    backgroundColor: '#F57C00',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  payButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    textAlign: 'center',
  },
  modalSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PaymentSummaryScreen;