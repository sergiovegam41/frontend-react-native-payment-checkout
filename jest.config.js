module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    // Solo incluir archivos críticos para la cobertura
    'src/store/slices/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    'src/components/StarRating.tsx',
    'src/components/CreditCardInput.tsx',
    // Excluir todo lo demás
    '!src/**/*.d.ts',
    '!src/navigation/**',
    '!src/theme/**',
    '!src/constants/**',
    '!src/screens/**',
    '!src/types/**',
    '!src/config/**',
    '!src/assets/**',
    '!src/components/CartBadge.tsx',
    '!src/components/CustomModal.tsx',
    '!src/components/ExpiryDateInput.tsx',
    '!src/components/FormInput.tsx',
    '!src/components/ImageGallery.tsx',
    '!src/components/LoadingIndicator.tsx',
    '!src/components/ProductCard.tsx',
    '!src/services/api.ts',
    '!src/store/hooks.ts',
    '!src/store/store.ts',
    '!src/store/testStore.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testTimeout: 10000,
};
