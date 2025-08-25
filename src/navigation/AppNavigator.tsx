import React from 'react';
import { TouchableOpacity, Text, Alert, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/slices/cartSlice';
import { RootStackParamList } from '../types/navigation';
import CartBadge from '../components/CartBadge';
import { Theme } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens (will create them next)
import SplashScreen from '../screens/SplashScreen';
import ProductsHomeScreen from '../screens/ProductsHomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductSelectionScreen from '../screens/ProductSelectionScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CreditCardFormScreen from '../screens/CreditCardFormScreen';
import PaymentSummaryScreen from '../screens/PaymentSummaryScreen';
import TransactionResultScreen from '../screens/TransactionResultScreen';

const Stack = createStackNavigator<RootStackParamList>();

const ClearCartButton: React.FC = () => {
  const dispatch = useAppDispatch();

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

  return (
    <TouchableOpacity
      onPress={handleClearCart}
      style={{ 
        marginRight: 16,
        padding: 8,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <Icon name="trash-outline" size={20} color="#ffffff" />
    </TouchableOpacity>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#72c571', // Fresh green for app bar
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: Theme.typography.fontFamily.primary,
        },
      }}
    >
      <Stack.Screen 
        name="Splash" 
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductsHome" 
        component={ProductsHomeScreen}
        options={{ 
          title: 'Productos',
          headerRight: () => <CartBadge />
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ 
          title: 'Detalle del Producto',
          headerRight: () => <CartBadge />
        }}
      />
      <Stack.Screen 
        name="ProductSelection" 
        component={ProductSelectionScreen}
        options={{ 
          title: 'Mi Carrito',
          headerRight: () => <ClearCartButton />
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ title: 'Resumen de Compra' }}
      />
      <Stack.Screen 
        name="CreditCardForm" 
        component={CreditCardFormScreen}
        options={{ title: 'Información de Tarjeta' }}
      />
      <Stack.Screen 
        name="PaymentSummary" 
        component={PaymentSummaryScreen}
        options={{ title: 'Resumen de Pago' }}
      />
      <Stack.Screen 
        name="TransactionResult" 
        component={TransactionResultScreen}
        options={{ title: 'Resultado', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;