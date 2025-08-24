import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import CartBadge from '../components/CartBadge';

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

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
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
        options={{ title: 'Mi Carrito' }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
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