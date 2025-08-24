import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface Props {
  loading?: boolean;
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingIndicator: React.FC<Props> = ({ 
  loading = true, 
  text = 'Cargando...', 
  size = 'small',
  color = '#2E7D32'
}) => {
  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[styles.text, { color }]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoadingIndicator;