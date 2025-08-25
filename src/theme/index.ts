// Main Theme Index - Unified Design System
export { Colors } from './colors';
export { Typography } from './typography';
export { Spacing, BorderRadius, Shadows } from './spacing';

// Combined theme object for easy access
export const Theme = {
  colors: require('./colors').Colors,
  typography: require('./typography').Typography,
  spacing: require('./spacing').Spacing,
  borderRadius: require('./spacing').BorderRadius,
  shadows: require('./spacing').Shadows,
} as const;

// Type exports
export type { 
  ColorKeys, 
  ColorValue 
} from './colors';

export type { 
  FontSizeKeys, 
  FontWeightKeys, 
  TextStyleKeys 
} from './typography';

export type { 
  SpacingKeys, 
  BorderRadiusKeys, 
  ShadowKeys 
} from './spacing';

// Helper function to create consistent styles
export const createStyle = {
  // Common button style creator
  button: (variant: 'primary' | 'secondary' | 'payment' = 'primary') => ({
    paddingHorizontal: Theme.spacing.button.paddingHorizontal,
    paddingVertical: Theme.spacing.button.paddingVertical,
    borderRadius: Theme.spacing.button.borderRadius,
    backgroundColor: variant === 'primary' 
      ? Theme.colors.primary.main 
      : variant === 'secondary' 
        ? Theme.colors.secondary.main 
        : Theme.colors.payment.main,
    ...Theme.shadows.base,
  }),
  
  // Common card style creator
  card: () => ({
    backgroundColor: Theme.colors.background.surface,
    padding: Theme.spacing.card.padding,
    marginBottom: Theme.spacing.card.margin,
    borderRadius: Theme.spacing.card.borderRadius,
    borderWidth: 1,
    borderColor: Theme.colors.border.light,
    ...Theme.shadows.sm,
  }),
  
  // Common input style creator
  input: () => ({
    paddingHorizontal: Theme.spacing.input.paddingHorizontal,
    paddingVertical: Theme.spacing.input.paddingVertical,
    borderRadius: Theme.spacing.input.borderRadius,
    marginBottom: Theme.spacing.input.marginBottom,
    borderWidth: 1,
    borderColor: Theme.colors.border.main,
    backgroundColor: Theme.colors.background.surface,
    ...Theme.typography.textStyles.inputText,
  }),
  
  // Common text styles
  text: {
    heading: (level: 1 | 2 | 3 | 4 = 1) => ({
      color: Theme.colors.text.primary,
      ...Theme.typography.textStyles[`h${level}` as keyof typeof Theme.typography.textStyles],
    }),
    body: (size: 'small' | 'normal' | 'large' = 'normal') => ({
      color: Theme.colors.text.primary,
      ...Theme.typography.textStyles[size === 'small' ? 'bodySmall' : size === 'large' ? 'bodyLarge' : 'body'],
    }),
    button: (size: 'small' | 'normal' | 'large' = 'normal') => ({
      color: Theme.colors.text.inverse,
      textAlign: 'center' as const,
      ...Theme.typography.textStyles[size === 'small' ? 'buttonSmall' : size === 'large' ? 'buttonLarge' : 'button'],
    }),
  },
  
  // Layout helpers
  layout: {
    screenContainer: () => ({
      flex: 1,
      backgroundColor: Theme.colors.background.primary,
      paddingHorizontal: Theme.spacing.screen.horizontal,
    }),
    sectionContainer: () => ({
      marginBottom: Theme.spacing.screen.section,
    }),
    centerContent: () => ({
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    }),
  }
};