import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setProducts, 
  appendProducts, 
  setPagination, 
  setLoading, 
  setLoadingMore, 
  setRefreshing, 
  setError,
  clearProducts
} from '../store/slices/productsSlice';
import { productsApi } from '../services/productsApi';
import { Product } from '../types/api';
import Icon from 'react-native-vector-icons/Ionicons';

import ProductCard from '../components/ProductCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { Theme, createStyle } from '../theme';

type ProductsHomeNavigationProp = StackNavigationProp<RootStackParamList, 'ProductsHome'>;

interface Props {
  navigation: ProductsHomeNavigationProp;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;

const ProductsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { products, pagination, loading, loadingMore, error, refreshing } = useAppSelector(
    state => state.products
  );

  const [retryCount, setRetryCount] = useState(0);

  // Load initial products
  const loadProducts = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        dispatch(setRefreshing(true));
        dispatch(clearProducts());
      } else {
        dispatch(setLoading(true));
      }
      
      dispatch(setError(null));

      const response = await productsApi.getProducts({ take: 10 });
      
      dispatch(setProducts(response.data));
      dispatch(setPagination(response.pagination));
      setRetryCount(0);
    } catch (error) {
      console.error('Error loading products:', error);
      dispatch(setError('Error al cargar productos'));
      
      // Retry logic
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadProducts(refresh);
        }, 2000);
      } else {
        Alert.alert(
          'Error de conexión',
          'No se pudieron cargar los productos. Verifica tu conexión a internet.',
          [
            { text: 'Reintentar', onPress: () => loadProducts(refresh) },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }
    } finally {
      dispatch(setLoading(false));
      dispatch(setRefreshing(false));
    }
  }, [dispatch, retryCount]);

  // Load more products (infinite scroll)
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !pagination?.hasNext || !pagination?.nextCursor) {
      return;
    }

    try {
      dispatch(setLoadingMore(true));
      dispatch(setError(null));

      const response = await productsApi.getProducts({
        cursor: pagination.nextCursor,
        direction: 'forward',
        take: 10,
      });

      dispatch(appendProducts(response.data));
      dispatch(setPagination(response.pagination));
    } catch (error) {
      console.error('Error loading more products:', error);
      dispatch(setError('Error al cargar más productos'));
    } finally {
      dispatch(setLoadingMore(false));
    }
  }, [dispatch, pagination, loadingMore]);

  // Initial load
  useEffect(() => {
    loadProducts();
  }, []);

  // Handle product press
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  // Handle refresh
  const handleRefresh = () => {
    loadProducts(true);
  };

  // Handle end reached (infinite scroll)
  const handleEndReached = () => {
    loadMoreProducts();
  };

  // Render product item
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.cardContainer}>
      <ProductCard product={item} onPress={handleProductPress} />
    </View>
  );

  // Render footer
  const renderFooter = () => {
    if (!loadingMore) return null;
    return <LoadingIndicator loading={loadingMore} text="Cargando más productos..." />;
  };

  // Render empty state
  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <LoadingIndicator loading={true} text="Cargando productos..." size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.errorTitleContainer}>
            <Icon name="sad-outline" size={24} color={Theme.colors.text.secondary} />
            <Text style={styles.errorTitle}>Oops!</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyTitleContainer}>
          <Icon name="cube-outline" size={24} color={Theme.colors.text.secondary} />
          <Text style={styles.emptyTitle}>No hay productos</Text>
        </View>
        <Text style={styles.emptyText}>No se encontraron productos disponibles</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.secondary, // Soft green background
  },
  listContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: CARD_MARGIN,
    paddingBottom: Theme.spacing.lg,
  },
  row: {
    justifyContent: 'space-around',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: Theme.spacing.sm,
  },
  emptyTitle: {
    ...createStyle.text.heading(3),
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  emptyText: {
    ...createStyle.text.body(),
    color: Theme.colors.text.disabled,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing['2xl'] + Theme.spacing.sm,
  },
  errorTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: Theme.spacing.sm,
  },
  errorTitle: {
    ...createStyle.text.heading(2),
  },
  errorText: {
    ...createStyle.text.body(),
    color: Theme.colors.status.error,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing['2xl'] + Theme.spacing.sm,
  },
});

export default ProductsHomeScreen;