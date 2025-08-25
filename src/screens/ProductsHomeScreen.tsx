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

import ProductCard from '../components/ProductCard';
import LoadingIndicator from '../components/LoadingIndicator';

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
          <Text style={styles.errorTitle}>😞 Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>📦 No hay productos</Text>
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
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: CARD_MARGIN,
    paddingBottom: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ProductsHomeScreen;