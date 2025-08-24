import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../store/slices/cartSlice';
import { CartItem } from '../types/api';

type ProductSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'ProductSelection'>;

interface Props {
  navigation: ProductSelectionNavigationProp;
}

const ProductSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalAmount } = useAppSelector(state => state.cart);

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleQuantityChange = (itemId: string, increment: boolean) => {
    const item = items.find(item => item.product.id === itemId);
    if (!item) return;

    if (increment && item.quantity < item.product.stock) {
      dispatch(updateCartItemQuantity({ productId: itemId, quantity: item.quantity + 1 }));
    } else if (!increment && item.quantity > 1) {
      dispatch(updateCartItemQuantity({ productId: itemId, quantity: item.quantity - 1 }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const item = items.find(item => item.product.id === itemId);
    if (!item) return;

    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de que quieres eliminar ${item.product.name} del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(itemId))
        }
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que quieres vaciar todo el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Vaciar', 
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito antes de continuar');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleContinueShopping = () => {
    navigation.navigate('ProductsHome');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        {item.product.images && item.product.images.length > 0 ? (
          <Image 
            source={{ uri: item.product.images[0].url }} 
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📷</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemPrice}>
          {formatPrice(item.product.price)}
        </Text>
        <Text style={styles.itemStock}>
          Stock: {item.product.stock} unidades
        </Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
            onPress={() => handleQuantityChange(item.product.id, false)}
            disabled={item.quantity <= 1}
          >
            <Text style={[styles.quantityButtonText, item.quantity <= 1 && styles.quantityButtonTextDisabled]}>−</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={[styles.quantityButton, item.quantity >= item.product.stock && styles.quantityButtonDisabled]}
            onPress={() => handleQuantityChange(item.product.id, true)}
            disabled={item.quantity >= item.product.stock}
          >
            <Text style={[styles.quantityButtonText, item.quantity >= item.product.stock && styles.quantityButtonTextDisabled]}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.product.id)}
        >
          <Text style={styles.removeButtonText}>Eliminar</Text>
        </TouchableOpacity>

        <Text style={styles.itemTotal}>
          {formatPrice((parseFloat(item.product.price) * item.quantity).toString())}
        </Text>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyText}>
        Explora nuestros productos y agrega los que más te gusten
      </Text>
      <TouchableOpacity style={styles.continueShoppingButton} onPress={handleContinueShopping}>
        <Text style={styles.continueShoppingButtonText}>Continuar comprando</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Mi Carrito</Text>
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearButton}>Vaciar carrito</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </Text>
            <Text style={styles.totalAmount}>
              Total: {formatPrice(totalAmount.toString())}
            </Text>
          </View>

          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.bottomContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total a pagar:</Text>
              <Text style={styles.totalPrice}>
                {formatPrice(totalAmount.toString())}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleContinueShopping}
              >
                <Text style={styles.continueButtonText}>Seguir comprando</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.checkoutButton} 
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  clearButton: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#666666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  listContent: {
    paddingBottom: 20,
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  itemStock: {
    fontSize: 12,
    color: '#666666',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 100,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quantityButtonTextDisabled: {
    color: '#999999',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    marginBottom: 8,
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductSelectionScreen;