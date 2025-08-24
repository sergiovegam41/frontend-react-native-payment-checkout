export const detectCardType = (cardNumber: string): 'VISA' | 'MASTERCARD' | 'UNKNOWN' => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (cleanNumber.match(/^4/)) {
    return 'VISA';
  }
  
  if (cleanNumber.match(/^5[1-5]/)) {
    return 'MASTERCARD';
  }
  
  return 'UNKNOWN';
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

export const validateExpiryDate = (month: string, year: string): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expMonth < 1 || expMonth > 12) {
    return false;
  }
  
  if (expYear < currentYear) {
    return false;
  }
  
  if (expYear === currentYear && expMonth < currentMonth) {
    return false;
  }
  
  return true;
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const formatted = cleanNumber.match(/.{1,4}/g)?.join(' ') || cleanNumber;
  return formatted.substring(0, 19); // 16 digits + 3 spaces
};