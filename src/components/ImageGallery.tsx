import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { ProductImage } from '../types/api';

interface Props {
  images: ProductImage[];
  height?: number;
}

const { width } = Dimensions.get('window');

const ImageGallery: React.FC<Props> = ({ images, height = width * 0.8 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const sortedImages = images.sort((a, b) => a.position - b.position);

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / width);
    setActiveIndex(index);
  };

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  if (sortedImages.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>📷</Text>
          <Text style={styles.placeholderSubtext}>Sin imágenes</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {/* Main Image Gallery */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
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
              <View style={styles.altTextContainer}>
                <Text style={styles.altText}>{image.altText}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      {sortedImages.length > 1 && (
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

      {/* Thumbnail Strip (if more than 2 images) */}
      {sortedImages.length > 2 && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
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
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#999999',
  },
  altTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  altText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
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
  thumbnailStrip: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
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