// Typography System
export const Typography = {
  // Font Families
  fontFamily: {
    primary: 'System', // React Native default system font
    monospace: 'monospace', // For SKU, card numbers, etc.
  },

  // Font Sizes (in px)
  fontSize: {
    xs: 10,    // Very small - badges, labels
    sm: 12,    // Small - captions, helper text
    md: 14,    // Medium - body text, inputs
    base: 16,  // Base - main content, buttons
    lg: 18,    // Large - section titles, important buttons
    xl: 20,    // Extra large - page titles
    '2xl': 24, // Headers
    '3xl': 28, // Main titles
    '4xl': 32, // Hero text
  },

  // Font Weights
  fontWeight: {
    light: '300',
    regular: '400', 
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line Heights (multipliers)
  lineHeight: {
    tight: 1.25,   // 20px for 16px font
    normal: 1.5,   // 24px for 16px font  
    relaxed: 1.625, // 26px for 16px font
    loose: 2,      // 32px for 16px font
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.05,
    normal: 0,
    wide: 0.05,
  },

  // Text Styles (complete style objects)
  textStyles: {
    // Headings
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      letterSpacing: -0.02,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600', 
      lineHeight: 30,
      letterSpacing: -0.01,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 22,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },

    // UI Elements
    buttonLarge: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.02,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.01,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
    },

    // Form Elements
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
    },
    inputText: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 20,
    },
    inputHelper: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    inputError: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },

    // Special Elements
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    overline: {
      fontSize: 10,
      fontWeight: '500',
      lineHeight: 14,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 18,
    },

    // Card Numbers, SKUs
    monospace: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'monospace',
      letterSpacing: 0.5,
    },

    // Prices
    price: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: -0.01,
    },
    priceLarge: {
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: -0.02,
    },

    // Status indicators
    badge: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.02,
    },
  },
} as const;

// Type exports
export type FontSizeKeys = keyof typeof Typography.fontSize;
export type FontWeightKeys = keyof typeof Typography.fontWeight;
export type TextStyleKeys = keyof typeof Typography.textStyles;