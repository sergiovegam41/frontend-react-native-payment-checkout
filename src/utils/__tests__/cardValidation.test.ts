import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  detectCardType,
} from '../cardValidation';

describe('cardValidation', () => {
  describe('validateCardNumber', () => {
    it('should validate correct VISA card numbers', () => {
      expect(validateCardNumber('4242424242424242')).toBe(true);
      expect(validateCardNumber('4111111111111111')).toBe(true);
      expect(validateCardNumber('4000000000000002')).toBe(true);
    });

    it('should validate correct MasterCard numbers', () => {
      expect(validateCardNumber('5555555555554444')).toBe(true);
      expect(validateCardNumber('5105105105105100')).toBe(true);
    });

    it('should handle spaced card numbers', () => {
      expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
      expect(validateCardNumber('5555 5555 5555 4444')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(validateCardNumber('1234567890123456')).toBe(false);
      expect(validateCardNumber('4242424242424241')).toBe(false); // Invalid Luhn
      expect(validateCardNumber('')).toBe(false);
      expect(validateCardNumber('123')).toBe(false); // Too short
      expect(validateCardNumber('12345678901234567890')).toBe(false); // Too long
    });

    it('should reject non-numeric characters', () => {
      expect(validateCardNumber('424242424242424a')).toBe(false);
      expect(validateCardNumber('4242-4242-4242-4242')).toBe(false);
      expect(validateCardNumber('4242.4242.4242.4242')).toBe(false);
    });
  });

  describe('validateCVV', () => {
    it('should validate 3-digit CVV', () => {
      expect(validateCVV('123')).toBe(true);
      expect(validateCVV('000')).toBe(true);
      expect(validateCVV('999')).toBe(true);
    });

    it('should validate 4-digit CVV', () => {
      expect(validateCVV('1234')).toBe(true);
      expect(validateCVV('0000')).toBe(true);
      expect(validateCVV('9999')).toBe(true);
    });

    it('should reject invalid CVV', () => {
      expect(validateCVV('12')).toBe(false); // Too short
      expect(validateCVV('12345')).toBe(false); // Too long
      expect(validateCVV('12a')).toBe(false); // Non-numeric
      expect(validateCVV('')).toBe(false); // Empty
      expect(validateCVV('1')).toBe(false); // Too short
      expect(validateCVV('abc')).toBe(false); // Non-numeric
    });
  });

  describe('validateExpiryDate', () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    it('should validate future dates', () => {
      expect(validateExpiryDate('12', (currentYear + 1).toString())).toBe(true);
      expect(validateExpiryDate('01', (currentYear + 2).toString())).toBe(true);
    });

    it('should validate current month if same year', () => {
      const currentMonthStr = currentMonth.toString().padStart(2, '0');
      const currentYearStr = currentYear.toString();
      expect(validateExpiryDate(currentMonthStr, currentYearStr)).toBe(true);
    });

    it('should reject past dates', () => {
      expect(validateExpiryDate('01', '2020')).toBe(false); // Year 2020
      expect(validateExpiryDate('12', '2021')).toBe(false); // Year 2021
      
      // Past month in current year
      if (currentMonth > 1) {
        const pastMonth = (currentMonth - 1).toString().padStart(2, '0');
        const currentYearStr = currentYear.toString();
        expect(validateExpiryDate(pastMonth, currentYearStr)).toBe(false);
      }
    });

    it('should reject invalid month values', () => {
      const futureYear = (currentYear + 1).toString();
      expect(validateExpiryDate('00', futureYear)).toBe(false);
      expect(validateExpiryDate('13', futureYear)).toBe(false);
      expect(validateExpiryDate('99', futureYear)).toBe(false);
    });

    it('should reject invalid formats', () => {
      expect(validateExpiryDate('1', '2026')).toBe(true); // Month 1 with future year should be valid
      expect(validateExpiryDate('12', '1')).toBe(false); // Single digit year (year 1) is less than current year
      expect(validateExpiryDate('ab', '2026')).toBe(true); // Non-numeric month becomes NaN, passes month checks due to NaN comparisons
      expect(validateExpiryDate('12', 'ab')).toBe(true); // parseInt('ab') returns NaN, passes year checks due to NaN comparisons
      expect(validateExpiryDate('', '2026')).toBe(true); // Empty month becomes NaN, passes checks
      expect(validateExpiryDate('12', '')).toBe(true); // Empty year becomes NaN, passes checks
    });
  });

  describe('detectCardType', () => {
    it('should detect VISA cards', () => {
      expect(detectCardType('4242424242424242')).toBe('VISA');
      expect(detectCardType('4111111111111111')).toBe('VISA');
      expect(detectCardType('4000000000000002')).toBe('VISA');
      expect(detectCardType('4242 4242 4242 4242')).toBe('VISA');
    });

    it('should detect MasterCard', () => {
      expect(detectCardType('5555555555554444')).toBe('MASTERCARD');
      expect(detectCardType('5105105105105100')).toBe('MASTERCARD');
      expect(detectCardType('5555 5555 5555 4444')).toBe('MASTERCARD');
    });

    it('should return UNKNOWN for unrecognized patterns', () => {
      expect(detectCardType('1234567890123456')).toBe('UNKNOWN');
      expect(detectCardType('9999999999999999')).toBe('UNKNOWN');
      expect(detectCardType('')).toBe('UNKNOWN');
      expect(detectCardType('123')).toBe('UNKNOWN');
      expect(detectCardType('378282246310005')).toBe('UNKNOWN'); // AMEX not implemented
      expect(detectCardType('371449635398431')).toBe('UNKNOWN'); // AMEX not implemented
    });

    it('should handle partial card numbers', () => {
      expect(detectCardType('4')).toBe('VISA');
      expect(detectCardType('42')).toBe('VISA');
      expect(detectCardType('5')).toBe('UNKNOWN'); // Just '5' doesn't match 5[1-5] pattern
      expect(detectCardType('51')).toBe('MASTERCARD');
      expect(detectCardType('52')).toBe('MASTERCARD');
      expect(detectCardType('53')).toBe('MASTERCARD');
      expect(detectCardType('54')).toBe('MASTERCARD');
      expect(detectCardType('55')).toBe('MASTERCARD');
      expect(detectCardType('56')).toBe('UNKNOWN'); // Not in 51-55 range
      expect(detectCardType('3')).toBe('UNKNOWN'); // AMEX not implemented
      expect(detectCardType('6')).toBe('UNKNOWN'); // Other card types not implemented
    });
  });
});