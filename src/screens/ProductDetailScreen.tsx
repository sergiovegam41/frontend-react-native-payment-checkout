import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types/api';

import ImageGallery from '../components/ImageGallery';
import LoadingIndicator from '../components/LoadingIndicator';
import CustomModal from '../components/CustomModal';

type ProductDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductDetailNavigationProp;
  route: ProductDetailRouteProp;
}

const { width } = Dimensions.get('window');

const ProductDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.products);
  const { items: cartItems } = useAppSelector(state => state.cart);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    icon: '',
    buttons: [] as any[]
  });

  useEffect(() => {
    // Find product in the Redux store (from products list)
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [productId, products]);

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getStockStatus = (stock: number): { text: string; color: string; available: boolean } => {
    if (stock === 0) {
      return { text: 'Agotado', color: '#D32F2F', available: false };
    } else if (stock < 10) {
      return { text: `Solo ${stock} disponibles`, color: '#F57C00', available: true };
    } else if (stock < 20) {
      return { text: 'Pocas unidades disponibles', color: '#F57C00', available: true };
    }
    return { text: 'En stock', color: '#2E7D32', available: true };
  };

  const handleQuantityChange = (increment: boolean) => {
    if (!product) return;
    
    if (increment && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addProductToCart = () => {
    if (!product) return false;

    if (product.stock < quantity) {
      setModalConfig({
        title: 'Stock insuficiente',
        message: 'No hay suficientes unidades disponibles',
        icon: '⚠️',
        buttons: [{ text: 'OK' }]
      });
      setModalVisible(true);
      return false;
    }

    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.product.id === product.id);
    const totalQuantityInCart = existingItem ? existingItem.quantity : 0;
    
    if (totalQuantityInCart + quantity > product.stock) {
      setModalConfig({
        title: 'Stock insuficiente',
        message: `Ya tienes ${totalQuantityInCart} unidades en el carrito. Solo puedes agregar ${product.stock - totalQuantityInCart} más.`,
        icon: '⚠️',
        buttons: [{ text: 'OK' }]
      });
      setModalVisible(true);
      return false;
    }

    // Add to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }

    return true;
  };

  const handleAddToCart = () => {
    const success = addProductToCart();
    if (!success) return;

    setModalConfig({
      title: '¡Agregado al carrito!',
      message: `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product!.name} agregadas al carrito`,
      icon: '✅',
      buttons: [
        { text: 'Seguir comprando', style: 'cancel' },
        { text: 'Ir al carrito', onPress: () => navigation.navigate('ProductSelection') }
      ]
    });
    setModalVisible(true);

    setQuantity(1); // Reset quantity after adding
  };

  const handleBuyNow = () => {
    const success = addProductToCart();
    if (!success) return;

    setQuantity(1); // Reset quantity after adding
    // Navigate directly to checkout without modal
    navigation.navigate('Checkout');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator loading={true} text="Cargando producto..." size="large" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>😞 Producto no encontrado</Text>
          <Text style={styles.errorText}>El producto que buscas no está disponible</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ImageGallery images={product.images} height={width} />

        {/* Product Information */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>


          <View style={styles.stockContainer}>
            <Text style={[styles.stockText, { color: stockStatus.color }]}>
              {stockStatus.text}
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Quantity Selector */}
          {stockStatus.available && (
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Cantidad:</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => handleQuantityChange(false)}
                  disabled={quantity <= 1}
                >
                  <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>−</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantityText}>{quantity}</Text>
                
                <TouchableOpacity
                  style={[styles.quantityButton, quantity >= product.stock && styles.quantityButtonDisabled]}
                  onPress={() => handleQuantityChange(true)}
                  disabled={quantity >= product.stock}
                >
                  <Text style={[styles.quantityButtonText, quantity >= product.stock && styles.quantityButtonTextDisabled]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {stockStatus.available && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>
              Agregar al carrito
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowButtonText}>Comprar ahora</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 30,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  stockContainer: {
    marginBottom: 20,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quantityButtonTextDisabled: {
    color: '#999999',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;