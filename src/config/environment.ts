// Environment configuration
export const ENV = {
  // API Configuration
  API: {
    BASE_URL: 'https://backend-nest-payment-checkout.ondeploy.space/api/v1',
    TIMEOUT: 30000, // 30 seconds
  },
  
  // Wompi Configuration (Sandbox)
  WOMPI: {
    SANDBOX_URL: 'https://api-sandbox.co.uat.wompi.dev/v1',
    PUBLIC_KEY: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7',
    PRIVATE_KEY: 'prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg',
    EVENTS_KEY: 'stagtest_events_2PDUmhMywUkvb1LvxYnayFbmofT7w39N',
    INTEGRITY_KEY: 'stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp',
  },
  
  // App Configuration
  APP: {
    NAME: 'Payment Checkout App',
    VERSION: '1.0.0',
    ENVIRONMENT: __DEV__ ? 'development' : 'production',
  },
  
  // Payment Configuration
  PAYMENT: {
    DEFAULT_CURRENCY: 'COP',
    MIN_AMOUNT: 1000, // $10 COP
    MAX_AMOUNT: 20000000, // $200,000 COP
    POLLING_INTERVAL: 3000, // 3 seconds
    POLLING_TIMEOUT: 120000, // 2 minutes
  },
  
  // Cache Configuration
  CACHE: {
    PRODUCTS_TTL: 300000, // 5 minutes
    TRANSACTION_HISTORY_LIMIT: 50,
  }
} as const;

// Helper functions for environment
export const isProduction = () => ENV.APP.ENVIRONMENT === 'production';
export const isDevelopment = () => ENV.APP.ENVIRONMENT === 'development';

// API URL helpers
export const getApiUrl = (endpoint: string): string => {
  return `${ENV.API.BASE_URL}${endpoint}`;
};

export const getWompiUrl = (endpoint: string): string => {
  return `${ENV.WOMPI.SANDBOX_URL}${endpoint}`;
};