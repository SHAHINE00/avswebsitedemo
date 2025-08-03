import { useState, useCallback, useRef } from 'react';

interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  country: string;
  message?: string;
}

const PHONE_PATTERNS = {
  MA: {
    pattern: /^(\+212|0)([5-7])(\d{8})$/,
    format: (number: string) => {
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.startsWith('212')) {
        const local = cleaned.substring(3);
        return `+212 ${local.substring(0, 1)} ${local.substring(1, 3)} ${local.substring(3, 5)} ${local.substring(5, 7)} ${local.substring(7)}`;
      }
      if (cleaned.startsWith('0')) {
        const local = cleaned.substring(1);
        return `0${local.substring(0, 1)} ${local.substring(1, 3)} ${local.substring(3, 5)} ${local.substring(5, 7)} ${local.substring(7)}`;
      }
      return number;
    },
    placeholder: '+212 6 12 34 56 78'
  },
  FR: {
    pattern: /^(\+33|0)([1-9])(\d{8})$/,
    format: (number: string) => {
      const cleaned = number.replace(/\D/g, '');
      if (cleaned.startsWith('33')) {
        const local = cleaned.substring(2);
        return `+33 ${local.substring(0, 1)} ${local.substring(1, 3)} ${local.substring(3, 5)} ${local.substring(5, 7)} ${local.substring(7)}`;
      }
      if (cleaned.startsWith('0')) {
        const formatted = cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        return formatted;
      }
      return number;
    },
    placeholder: '+33 1 23 45 67 89'
  }
};

export const usePhoneFormatter = (defaultCountry: string = 'MA') => {
  const [detectedCountry, setDetectedCountry] = useState(defaultCountry);
  const lastDetectedCountryRef = useRef(defaultCountry);

  const detectCountry = useCallback((phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.startsWith('212') || cleaned.startsWith('0')) {
      return 'MA';
    }
    if (cleaned.startsWith('33')) {
      return 'FR';
    }
    
    // Default based on length and pattern
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return 'MA';
    }
    
    return defaultCountry;
  }, [defaultCountry]);

  const formatPhone = useCallback((phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    const country = detectCountry(phoneNumber);
    const pattern = PHONE_PATTERNS[country as keyof typeof PHONE_PATTERNS];
    
    // Only update state if country actually changed
    if (country !== lastDetectedCountryRef.current) {
      lastDetectedCountryRef.current = country;
      setDetectedCountry(country);
    }
    
    if (pattern) {
      return pattern.format(phoneNumber);
    }
    
    return phoneNumber;
  }, [detectCountry]);

  const validatePhone = useCallback((phoneNumber: string): PhoneValidationResult => {
    const country = detectCountry(phoneNumber);
    const pattern = PHONE_PATTERNS[country as keyof typeof PHONE_PATTERNS];
    
    if (!pattern) {
      return {
        isValid: false,
        formatted: phoneNumber,
        country,
        message: 'Format de téléphone non reconnu'
      };
    }

    const isValid = pattern.pattern.test(phoneNumber.replace(/\s/g, ''));
    const formatted = formatPhone(phoneNumber);
    
    return {
      isValid,
      formatted,
      country,
      message: isValid ? undefined : `Format requis: ${pattern.placeholder}`
    };
  }, [detectCountry, formatPhone]);

  const getPlaceholder = useCallback((country?: string): string => {
    const countryCode = country || detectedCountry;
    const pattern = PHONE_PATTERNS[countryCode as keyof typeof PHONE_PATTERNS];
    return pattern?.placeholder || '+212 6 12 34 56 78';
  }, [detectedCountry]);

  return {
    formatPhone,
    validatePhone,
    getPlaceholder,
    detectedCountry
  };
};