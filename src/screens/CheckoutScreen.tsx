import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/api';

type CheckoutNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface Props {
  navigation: CheckoutNavigationProp;
}

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const mainImage = item.product.images.find(img => img.isMain) || item.product.images[0];
    const subtotal = parseFloat(item.product.price) * item.quantity;

    return (
      <View style={styles.cartItem}>
        <Image 
          source={{ uri: mainImage?.url }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(item.product.price)}</Text>
          <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
        </View>
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotal}>{formatPrice(subtotal.toString())}</Text>
        </View>
      </View>
    );
  };

  const handleContinueToPayment = () => {
    if (items.length === 0) {
      return;
    }
    navigation.navigate('CreditCardForm');
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id}
            style={styles.cartList}
            contentContainerStyle={styles.cartListContent}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{formatPrice(totalAmount.toString())}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.payButton}
            onPress={handleContinueToPayment}
          >
            <Text style={styles.payButtonText}>Continuar al Pago</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartListContent: {
    paddingTop: 24,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 12,
    color: '#999999',
  },
  subtotalContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    backgroundColor: '#1976D2',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
});

export default CheckoutScreen;