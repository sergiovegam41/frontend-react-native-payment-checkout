import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type TransactionResultNavigationProp = StackNavigationProp<RootStackParamList, 'TransactionResult'>;
type TransactionResultRouteProp = RouteProp<RootStackParamList, 'TransactionResult'>;

interface Props {
  navigation: TransactionResultNavigationProp;
  route: TransactionResultRouteProp;
}

const TransactionResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params;

  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'ProductsHome' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado de Transacción</Text>
      <Text style={styles.transactionId}>
        ID: {transactionId}
      </Text>
      <Text style={styles.description}>
        Mostrar resultado de la transacción
        {'\n'}Estado: APROBADA/RECHAZADA/ERROR
      </Text>
      
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={goToHome}
      >
        <Text style={styles.homeButtonText}>Volver al Inicio</Text>
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
  homeButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionResultScreen;