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
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

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
        
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
        </View>

        <View style={styles.stockContainer}>
          <Text style={[styles.stockText, { color: stockStatus.color }]}>
            {stockStatus.text}
          </Text>
        </View>

        <View style={styles.skuContainer}>
          <Text style={styles.sku}>SKU: {product.sku}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.75,
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
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 16,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  stockContainer: {
    marginBottom: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  skuContainer: {
    marginTop: 4,
  },
  sku: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'monospace',
  },
});

export default ProductCard;