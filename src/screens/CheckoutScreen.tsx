import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { CartItem } from '../types/api';
import { Theme, createStyle } from '../theme';

type CheckoutNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface Props {
  navigation: CheckoutNavigationProp;
}

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`;
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
          <View style={styles.productsSection}>
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
              style={styles.payButton}
              onPress={handleContinueToPayment}
            >
              <Text style={styles.payButtonText}>Continuar al Pago</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.primary,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: Theme.spacing.layout.containerPadding,
    paddingTop: Theme.spacing.lg, // Add more top margin to product list
    // No bottom margin to extend fully to the bottom
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
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
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
  productPrice: {
    ...Theme.typography.textStyles.bodySmall,
    color: Theme.colors.text.secondary,
    marginBottom: 2,
  },
  quantity: {
    ...Theme.typography.textStyles.bodySmall,
    color: Theme.colors.text.secondary,
  },
  subtotalContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  subtotal: {
    ...Theme.typography.textStyles.price,
    color: Theme.colors.secondary.main, // Dark blue for prices
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
    color: Theme.colors.secondary.main, // Dark blue for prices
  },
  buttonContainer: {
    backgroundColor: '#FAFAFA', // Same lighter background as total container
    padding: Theme.spacing.layout.containerPadding,
  },
  payButton: {
    ...createStyle.button('primary'), // Revert to original green button
    paddingVertical: Theme.spacing.base,
    // No shadow for clean design
  },
  payButtonText: {
    ...createStyle.text.button('large', 'primary'), // Revert to white text
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