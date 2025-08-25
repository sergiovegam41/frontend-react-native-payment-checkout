import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { Theme } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const CartBadge: React.FC = () => {
  const navigation = useNavigation();
  const { totalItems } = useAppSelector(state => state.cart);

  const handlePress = () => {
    navigation.navigate('ProductSelection' as never);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.cartIconContainer}>
        <Icon name="cart-outline" size={24} color="#ffffff" />
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 16,
    padding: 8,
  },
  cartIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartBadge;