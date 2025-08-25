import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { ProductImage } from '../types/api';
import { Theme } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  images: ProductImage[];
  height?: number;
}

const { width } = Dimensions.get('window');

const ImageGallery: React.FC<Props> = ({ images, height = width * 0.8 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isScrolling = useRef(false);

  const sortedImages = images.sort((a, b) => a.position - b.position);

  const handleScroll = (event: any) => {
    // Only update index if user is manually scrolling, not from programmatic scroll
    if (!isScrolling.current) {
      const scrollX = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollX / width);
      setActiveIndex(index);
    }
  };

  const handleScrollBegin = () => {
    // Fade out when scrolling starts
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleScrollEnd = (event: any) => {
    // Reset scrolling flag and update index from final position
    isScrolling.current = false;
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    setActiveIndex(index);
    
    // Fade in when scrolling ends
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const scrollToImage = (index: number) => {
    // Set scrolling flag to prevent handleScroll interference
    isScrolling.current = true;
    // Set the active index immediately
    setActiveIndex(index);
    // Scroll to the image position
    scrollRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  if (sortedImages.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholderContainer}>
          <View style={styles.placeholderIconContainer}>
            <Icon name="image-outline" size={48} color={Theme.colors.neutral.gray[500]} />
          </View>
          <Text style={styles.placeholderSubtext}>Sin imágenes</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Image Gallery */}
      <View style={[styles.mainImageContainer, { height }]}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollBeginDrag={handleScrollBegin}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.mainScrollView}
        >
          {sortedImages.map((image, index) => (
            <View key={image.id} style={styles.imageContainer}>
              <Image
                source={{ uri: image.url }}
                style={[styles.mainImage, { width, height }]}
                resizeMode="cover"
              />
              {image.altText && (
                <Animated.View 
                  style={[
                    styles.altTextContainer,
                    { opacity: fadeAnim }
                  ]}
                >
                  <Text style={styles.altText}>{image.altText}</Text>
                </Animated.View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Dots Indicator - only show if no thumbnails */}
        {sortedImages.length > 1 && sortedImages.length <= 2 && (
          <View style={styles.dotsContainer}>
            {sortedImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
                onPress={() => scrollToImage(index)}
              />
            ))}
          </View>
        )}

        {/* Image Counter */}
        {sortedImages.length > 1 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {activeIndex + 1} / {sortedImages.length}
            </Text>
          </View>
        )}
      </View>

      {/* Thumbnail Strip (if more than 2 images) - moved outside main container */}
      {sortedImages.length > 2 && (
        <View style={styles.thumbnailSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailStrip}
            contentContainerStyle={styles.thumbnailContent}
          >
            {sortedImages.map((image, index) => (
              <TouchableOpacity
                key={image.id}
                onPress={() => scrollToImage(index)}
                style={[
                  styles.thumbnailContainer,
                  activeIndex === index && styles.activeThumbnail,
                ]}
              >
                <Image
                  source={{ uri: image.url }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  mainImageContainer: {
    position: 'relative',
  },
  mainScrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    backgroundColor: '#F5F5F5',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  placeholderIconContainer: {
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#999999',
  },
  altTextContainer: {
    position: 'absolute',
    top: 16,
    right: 70 ,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    maxWidth: '60%',
  },
  altText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'left',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2E7D32',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  counterContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  thumbnailSection: {
    backgroundColor: '#F8F9FA',
    paddingTop: 12,
    paddingBottom: 0,
  },
  thumbnailStrip: {
    height: 60,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: '#2E7D32',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
});

export default ImageGallery;