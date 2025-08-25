// Wompi Design System - Color Palette
export const Colors = {
  // Primary Brand Colors - Fresh Green Palette
  primary: {
    main: '#72c571',        // Fresh green (main brand color)
    light: '#8FD18E',       // Lighter fresh green
    dark: '#066851',        // Deep forest green
    surface: '#E7F0ED',     // Very subtle background green
  },

  // Secondary Brand Colors - Blue Palette
  secondary: {
    main: '#5CA1FF',        // Soft blue for prices and important elements
    light: '#99d1fc',       // Light blue
    lighter: '#B8E0FD',     // Even lighter blue
    dark: '#0E62EC',        // Darker blue accent
    surface: '#F0F8FF',     // Very light blue background
  },

  // Accent Colors - Bright Yellow-Green
  accent: {
    main: '#DDFD60',        // Bright yellow-green accent
    light: '#E8FE88',       // Lighter yellow-green
    dark: '#B8D240',        // Darker yellow-green
    surface: '#F8FFE6',     // Very light yellow background
  },

  // Status Colors - Updated with Wompi Palette
  status: {
    success: '#72c571',     // Fresh green - approved, success
    warning: '#DDFD60',     // Bright yellow - pending, caution
    error: '#F26464',       // Soft red - low stock, errors
    info: '#99d1fc',        // Clean blue - information
    pending: '#FF9F40',     // Orange - processing states (more visible)
  },

  // Neutral Colors - Clean Grays
  neutral: {
    white: '#FFFFFF',
    black: '#2C2A29',       // Softer black from Wompi palette
    gray: {
      50: '#FAFAFA',
      100: '#E7F0ED',       // Very light background from Wompi
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#2C2A29',       // Wompi soft black
    }
  },

  // Text Colors - Updated with Wompi Palette
  text: {
    primary: '#2C2A29',     // Soft black for main text
    secondary: '#666666',   // Secondary text
    disabled: '#999999',    // Disabled text
    hint: '#BDBDBD',       // Placeholder text
    inverse: '#FFFFFF',     // Text on dark backgrounds
  },

  // Background Colors - Fresh Mint Theme
  background: {
    primary: '#E7F0ED',     // Mint background for all screens
    secondary: '#E7F0ED',   // Same mint background
    tertiary: '#F8F9FA',    // Light gray sections
    surface: '#FFFFFF',     // Surface elements (cards, etc.)
    overlay: 'rgba(44, 42, 41, 0.5)', // Modal overlays with soft black
  },

  // Border Colors - Clean and Subtle
  border: {
    light: '#E7F0ED',       // Very light green borders
    main: '#E0E0E0',        // Main borders  
    dark: '#BDBDBD',        // Dark borders
    focus: '#72c571',       // Fresh green focus states
    error: '#E74C3C',       // Clean red error borders
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    main: 'rgba(0, 0, 0, 0.25)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },

  // Card Types (for payments)
  cardBrands: {
    visa: '#1A1F71',
    mastercard: '#EB001B', 
    amex: '#006FCF',
    diners: '#0079BE',
    unknown: '#666666',
  }
} as const;

// Type for colors (useful for TypeScript)
export type ColorKeys = keyof typeof Colors;
export type ColorValue = typeof Colors[ColorKeys];

// Helper function to get nested color values
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = Colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color path "${path}" not found`);
      return Colors.neutral.gray[500];
    }
  }
  
  return value;
};