// Spacing System - 8px base unit
export const Spacing = {
  // Base spacing units (multiples of 4px for better alignment)
  xs: 4,    // 4px - minimal spacing
  sm: 8,    // 8px - small spacing
  md: 12,   // 12px - medium spacing  
  base: 16, // 16px - base spacing unit
  lg: 20,   // 20px - large spacing
  xl: 24,   // 24px - extra large spacing
  '2xl': 32, // 32px - double extra large
  '3xl': 40, // 40px - triple extra large
  '4xl': 48, // 48px - quadruple extra large

  // Semantic spacing
  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },

  margin: {
    xs: 4,
    sm: 8, 
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },

  // Screen-level spacing
  screen: {
    horizontal: 20, // Left/right padding for screens
    vertical: 20,   // Top/bottom padding for screens
    section: 24,    // Between major sections
  },

  // Component-specific spacing - Wompi Rounded Style
  card: {
    padding: 16,    // Internal card padding
    margin: 12,     // Between cards
    borderRadius: 20, // More rounded corners for cards
  },

  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingSmall: 8,
    paddingLarge: 16,
    borderRadius: 16,  // More rounded buttons
    borderRadiusSmall: 12,
    borderRadiusLarge: 20,
  },

  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,  // Rounded input fields
    marginBottom: 16,
  },

  modal: {
    padding: 24,
    borderRadius: 24,  // Very rounded modals
    margin: 20,
  },

  // Layout spacing
  layout: {
    containerPadding: 20,
    sectionSpacing: 32,
    itemSpacing: 16,
    microSpacing: 8,
  },

  // Product grid spacing
  grid: {
    cardMargin: 12,
    cardSpacing: 16,
    containerPadding: 16,
  },
} as const;

// Border radius system - Wompi Rounded Design
export const BorderRadius = {
  none: 0,
  xs: 8,     // Minimum rounded corners
  sm: 12,    // Small rounded corners
  base: 16,  // Base rounded corners
  md: 20,    // Medium rounded corners  
  lg: 24,    // Large rounded corners
  xl: 32,    // Extra large rounded corners
  '2xl': 40, // Very large rounded corners
  full: 999, // For circular elements
} as const;

// Shadow system
export const Shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
} as const;

// Type exports
export type SpacingKeys = keyof typeof Spacing;
export type BorderRadiusKeys = keyof typeof BorderRadius;
export type ShadowKeys = keyof typeof Shadows;