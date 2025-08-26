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
import { Theme, createStyle } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types/api';
import { productsApi } from '../services/productsApi';

import ImageGallery from '../components/ImageGallery';
import LoadingIndicator from '../components/LoadingIndicator';
import CustomModal from '../components/CustomModal';
import StarRating from '../components/StarRating';

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
  const { items: cartItems } = useAppSelector(state => state.cart);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    icon: '',
    buttons: [] as any[]
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const productDetails = await productsApi.getProductById(productId);
        setProduct(productDetails);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Error al cargar el producto. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const formatPrice = (priceInCents: number): string => {
    // Convert cents to COP (divide by 100)
    const priceInCOP = priceInCents / 100;
    return `${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInCOP)} COP`;
  };

  const getStockStatus = (stock: number): { text: string; color: string; available: boolean } => {
    if (stock === 0) {
      return { text: 'Agotado', color: '#D32F2F', available: false };
    } else if (stock < 20) {
      return { text: `Solo ${stock} disponibles`, color: '#F57C00', available: true };
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
        icon: 'alert-circle-outline',
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
        icon: 'alert-circle-outline',
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
      icon: 'checkmark-circle-outline',
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

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorTitleContainer}>
            <Icon name="warning-outline" size={24} color={Theme.colors.text.secondary} />
            <Text style={styles.errorTitle}>Error</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorTitleContainer}>
            <Icon name="sad-outline" size={24} color={Theme.colors.text.secondary} />
            <Text style={styles.errorTitle}>Producto no encontrado</Text>
          </View>
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
        {product.images && product.images.length > 0 ? (
          <ImageGallery images={product.images} height={width} />
        ) : (
          <View style={styles.noImagePlaceholder} />
        )}

        {/* Product Information */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <StarRating rating={product.rating || 0} size={16} />
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

          <View style={styles.stockContainer}>
            <Text style={[styles.stockText, { color: stockStatus.color }]}>
              {stockStatus.text}
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

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
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    marginTop: 0,
    marginBottom: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 0,
    marginBottom: 8,
    lineHeight: 30,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  ratingContainer: {
    marginTop: 8,
    marginBottom: 16,
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
    borderRadius: 999, // Maximally rounded
    backgroundColor: '#72c571', // Fresh green
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: Theme.colors.neutral.gray[300],
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Theme.typography.fontFamily.primary,
  },
  quantityButtonTextDisabled: {
    color: Theme.colors.text.disabled,
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
    ...createStyle.button('primary'),
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonText: {
    ...createStyle.text.button('normal', 'primary'),
  },
  buyNowButton: {
    ...createStyle.button('outline'),
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowButtonText: {
    ...createStyle.text.button('normal', 'outline'),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    ...createStyle.button('primary'),
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    ...createStyle.text.button('normal', 'primary'),
  },
  noImagePlaceholder: {
    height: 20, // Pequeño espacio cuando no hay imágenes
    backgroundColor: '#F8F9FA',
  },
});

export default ProductDetailScreen;