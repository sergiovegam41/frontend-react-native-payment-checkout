import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  rating: number; // Rating from 0-5
  size?: number;
  color?: string;
  showHalfStars?: boolean;
}

const StarRating: React.FC<Props> = ({ 
  rating, 
  size = 14, 
  color = '#FFD700', 
  showHalfStars = true 
}) => {
  const maxStars = 5;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    let iconName = 'star-outline';
    
    if (rating >= i) {
      iconName = 'star';
    } else if (showHalfStars && rating >= i - 0.5) {
      iconName = 'star-half';
    }
    
    stars.push(
      <Icon
        key={i}
        name={iconName}
        size={size}
        color={color}
        style={styles.star}
      />
    );
  }

  return (
    <View style={styles.container}>
      {stars}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
});

export default StarRating;