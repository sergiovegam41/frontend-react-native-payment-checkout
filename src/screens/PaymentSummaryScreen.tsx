import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type PaymentSummaryNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSummary'>;

interface Props {
  navigation: PaymentSummaryNavigationProp;
}

const PaymentSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const handlePayment = () => {
    // Simular transacción
    const transactionId = Date.now().toString();
    navigation.navigate('TransactionResult', { transactionId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Pago</Text>
      <Text style={styles.description}>
        Resumen con botón de pago en backdrop component
        {'\n'}Llamada a backend API
        {'\n'}Manejo de happy/unhappy paths
        {'\n'}Toast de error en caso de fallo
      </Text>
      
      <TouchableOpacity 
        style={styles.payButton}
        onPress={handlePayment}
      >
        <Text style={styles.payButtonText}>Procesar Pago</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666666',
    lineHeight: 24,
  },
  payButton: {
    backgroundColor: '#F57C00',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentSummaryScreen;