import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Product } from '../types/api';

interface Props {
  product: Product;
  onPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const HORIZONTAL_CARD_MARGIN = 12; // 6px on each side (increased by ~50%)
const CARD_WIDTH = (width - CARD_MARGIN * 2 - HORIZONTAL_CARD_MARGIN * 2) / 2;

const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  
  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getStockStatus = (stock: number): { text: string; color: string } => {
    if (stock === 0) {
      return { text: 'Agotado', color: '#D32F2F' };
    } else if (stock < 10) {
      return { text: `Solo ${stock} disponibles`, color: '#F57C00' };
    } else if (stock < 20) {
      return { text: 'Pocas unidades', color: '#F57C00' };
    }
    return { text: 'En stock', color: '#2E7D32' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {mainImage && (
          <Image
            source={{ uri: mainImage.url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {product.images.length > 1 && (
          <View style={styles.imageCount}>
            <Text style={styles.imageCountText}>+{product.images.length - 1}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
          
          <Text style={[styles.stockText, { color: stockStatus.color }]}>
            {stockStatus.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.65, // Increased height for 3 lines in product name
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 6, // Increased horizontal margin
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.6, // Slightly reduced image height
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  imageCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
    lineHeight: 18,
    height: 36, // Fixed height for exactly 2 lines (18px * 2)
  },
  description: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
    height: 48, // Fixed height for exactly 3 lines (16px * 3)
    marginBottom: 8,
  },
  footer: {
    marginTop: 'auto', // Push to bottom
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    borderRadius: 4,
    textAlign: 'center',
    alignSelf: 'flex-start', // Prevent stretching
  },
});

export default ProductCard;