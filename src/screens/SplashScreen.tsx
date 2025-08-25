import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Theme } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start loading rotation immediately
    const startLoadingRotation = () => {
      loadingRotation.setValue(0);
      Animated.timing(loadingRotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startLoadingRotation());
    };

    // Animation sequence
    const animationSequence = Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.back(1.5),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Title appears
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Subtitle appears
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Loading indicator appears
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    startLoadingRotation();
    animationSequence.start();

    // Navigate after animation completes
    const timer = setTimeout(() => {
      navigation.replace('ProductsHome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, logoScale, logoOpacity, titleOpacity, subtitleOpacity, loadingOpacity, loadingRotation]);

  const spinValue = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logo}>
            <Icon name="card-outline" size={48} color="#ffffff" />
            <View style={styles.logoBackground} />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.contentContainer, { opacity: titleOpacity }]}>
        <Text style={styles.title}>Payment Checkout</Text>
      </Animated.View>

      <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
        <Text style={styles.subtitle}>Pagos Seguros y Rápidos</Text>
      </Animated.View>

      <Animated.View style={[styles.loadingContainer, { opacity: loadingOpacity }]}>
        <Animated.View
          style={[
            styles.loadingSpinner,
            {
              transform: [{ rotate: spinValue }],
            },
          ]}
        >
          <View style={styles.loadingRing} />
        </Animated.View>
        <Text style={styles.loadingText}>Iniciando...</Text>
      </Animated.View>

      <Text style={styles.poweredBy}>Powered by React Native + Wompi API</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.neutral.black,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
    top: -10,
    left: -10,
  },
  contentContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.text.inverse,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  loadingRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: Theme.colors.primary.main,
    borderRightColor: Theme.colors.primary.main,
  },
  loadingText: {
    fontSize: 14,
    color: Theme.colors.text.secondary,
    fontWeight: '500',
  },
  poweredBy: {
    fontSize: 12,
    color: Theme.colors.text.disabled,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SplashScreen;