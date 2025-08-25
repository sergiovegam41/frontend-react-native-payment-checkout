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
import { Theme, createStyle } from '../theme';

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
      return { text: 'Agotado', color: Theme.colors.status.error };
    } else if (stock < 10) {
      return { text: `Solo ${stock} disponibles`, color: Theme.colors.status.warning };
    } else if (stock < 20) {
      return { text: 'Pocas unidades', color: Theme.colors.status.warning };
    }
    return { text: 'En stock', color: Theme.colors.status.success };
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
    height: CARD_WIDTH * 1.65,
    backgroundColor: Theme.colors.background.surface,
    borderRadius: Theme.spacing.card.borderRadius,
    marginBottom: Theme.spacing.base,
    marginHorizontal: Theme.spacing.xs + 2,
    ...Theme.shadows.base,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.6,
    borderTopLeftRadius: Theme.spacing.card.borderRadius,
    borderTopRightRadius: Theme.spacing.card.borderRadius,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.neutral.gray[100],
  },
  imageCount: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.overlay,
    borderRadius: Theme.spacing.card.borderRadius,
    paddingHorizontal: Theme.spacing.xs + 2,
    paddingVertical: 2,
  },
  imageCountText: {
    color: Theme.colors.text.inverse,
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: Theme.typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  name: {
    ...Theme.typography.textStyles.bodySmall,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs + 2,
    lineHeight: 18,
    height: 36,
  },
  description: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.secondary,
    lineHeight: 16,
    height: 48,
    marginBottom: Theme.spacing.sm,
  },
  footer: {
    marginTop: 'auto',
  },
  price: {
    ...Theme.typography.textStyles.price,
    color: Theme.colors.primary.main,
    marginBottom: Theme.spacing.xs + 2,
  },
  stockText: {
    ...Theme.typography.textStyles.caption,
    fontWeight: Theme.typography.fontWeight.semibold,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    backgroundColor: `${Theme.colors.primary.main}1A`,
    borderRadius: Theme.borderRadius.xs,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
});

export default ProductCard;