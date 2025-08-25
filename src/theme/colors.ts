// Color System - Design Identity
export const Colors = {
  // Primary Brand Colors
  primary: {
    main: '#2E7D32',        // Main green - buttons, accents
    light: '#66BB6A',       // Light green - success states
    dark: '#1B5E20',        // Dark green - pressed states
    surface: '#E8F5E8',     // Very light green - backgrounds
  },

  // Secondary Brand Colors  
  secondary: {
    main: '#1976D2',        // Blue - links, info
    light: '#42A5F5',       // Light blue - hover states
    dark: '#0D47A1',        // Dark blue - pressed states
    surface: '#E3F2FD',     // Very light blue - backgrounds
  },

  // Payment & Transaction Colors
  payment: {
    main: '#F57C00',        // Orange - payment buttons
    light: '#FFB74D',       // Light orange - hover states
    dark: '#E65100',        // Dark orange - pressed states
    surface: '#FFF3E0',     // Very light orange - backgrounds
  },

  // Status Colors
  status: {
    success: '#2E7D32',     // Green - approved, success
    warning: '#F57C00',     // Orange - pending, caution
    error: '#D32F2F',       // Red - declined, errors
    info: '#1976D2',        // Blue - information
    pending: '#FF9800',     // Amber - processing states
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  },

  // Text Colors
  text: {
    primary: '#333333',     // Main text color
    secondary: '#666666',   // Secondary text
    disabled: '#999999',    // Disabled text
    hint: '#BDBDBD',       // Placeholder text
    inverse: '#FFFFFF',     // Text on dark backgrounds
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',     // Main background
    secondary: '#F8F9FA',   // Secondary background
    tertiary: '#F0F2F5',    // Cards, sections
    surface: '#FFFFFF',     // Surface elements
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  },

  // Border Colors
  border: {
    light: '#E9ECEF',       // Light borders
    main: '#E0E0E0',        // Main borders  
    dark: '#BDBDBD',        // Dark borders
    focus: '#1976D2',       // Focus states
    error: '#D32F2F',       // Error borders
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