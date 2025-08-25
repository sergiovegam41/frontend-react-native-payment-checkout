import { ENV } from '../config/environment';

// Wompi configuration - using centralized environment config
export const WOMPI_CONFIG = ENV.WOMPI;

// Payment status constants matching Wompi API
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  VOIDED: 'VOIDED',
  ERROR: 'ERROR',
} as const;

// Transaction status for our internal state management
export const TRANSACTION_STATUS = {
  IDLE: 'IDLE',
  CREATING: 'CREATING', 
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  ERROR: 'ERROR',
} as const;

// Card types supported
export const CARD_TYPES = {
  VISA: 'VISA',
  MASTERCARD: 'MASTERCARD', 
  AMEX: 'AMEX',
  DINERS: 'DINERS',
  UNKNOWN: 'UNKNOWN',
} as const;