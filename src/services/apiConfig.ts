import { ENV } from '../config/environment';

// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: ENV.API.BASE_URL,
  ENDPOINTS: {
    // Products
    PRODUCTS: '/product',
    
    // Payments & Transactions  
    TRANSACTIONS: '/transactions',
    PAYMENTS: '/payments',
    PAYMENT_SOURCES: '/payment-sources',
    
    // Wompi Integration (backend endpoints that proxy to Wompi)
    WOMPI_TRANSACTIONS: '/wompi/transactions',
    WOMPI_PAYMENT_SOURCES: '/wompi/payment-sources',
    WOMPI_WEBHOOKS: '/wompi/webhooks',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
  TIMEOUT: ENV.API.TIMEOUT,
} as const;

// Base API service class with common functionality
export class BaseApiService {
  protected baseURL: string;
  protected defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  protected buildQueryString(params: Record<string, any>): string {
    const urlParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.append(key, value.toString());
      }
    });

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}

// Error types for consistent error handling
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp?: string;
}