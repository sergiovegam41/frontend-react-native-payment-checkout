// Environment configuration
export const ENV = {
  // API Configuration
  API: {
    BASE_URL: 'https://payment-checkout-backend.ondeploy.space/api/v1',
    TIMEOUT: 30000, // 30 seconds
  },
  
  // App Configuration
  APP: {
    ENVIRONMENT: __DEV__ ? 'development' : 'production',
  }
} as const;

// Helper functions for environment
export const isProduction = () => ENV.APP.ENVIRONMENT === 'production';
export const isDevelopment = () => ENV.APP.ENVIRONMENT === 'development';

// API URL helpers
export const getApiUrl = (endpoint: string): string => {
  return `${ENV.API.BASE_URL}${endpoint}`;
};

