import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/slices/cartSlice';
import { RootStackParamList } from '../types/navigation';
import { Theme, createStyle } from '../theme';

type TransactionResultNavigationProp = StackNavigationProp<RootStackParamList, 'TransactionResult'>;
type TransactionResultRouteProp = RouteProp<RootStackParamList, 'TransactionResult'>;

interface Props {
  navigation: TransactionResultNavigationProp;
  route: TransactionResultRouteProp;
}

const TransactionResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params;
  const dispatch = useAppDispatch();

  const goToHome = () => {
    dispatch(clearCart()); // Ensure cart is completely cleared
    navigation.reset({
      index: 0,
      routes: [{ name: 'ProductsHome' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 ¡Pago Exitoso!</Text>
      <Text style={styles.transactionId}>
        ID de Transacción: {transactionId}
      </Text>
      <Text style={styles.description}>
        Tu compra ha sido procesada exitosamente.
        {'\n'}Recibirás un email de confirmación en breve.
      </Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={goToHome}
        >
          <Text style={styles.homeButtonText}>Seguir Comprando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.primary, // Mint background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E7D32',
    textAlign: 'center',
  },
  transactionId: {
    fontSize: 14,
    marginBottom: 16,
    color: '#999999',
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666666',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  homeButton: {
    backgroundColor: Theme.colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TransactionResultScreen;