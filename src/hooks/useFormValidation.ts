import * as React from 'react';

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null;
}

export interface ValidationErrors {
  [key: string]: string | null;
}

export const useFormValidation = (rules: { [key: string]: ValidationRule }) => {
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});

  const validateField = React.useCallback((name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && (!value || value.trim() === '')) {
      return 'Ce champ est requis';
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return `Minimum ${rule.minLength} caractères requis`;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      return `Maximum ${rule.maxLength} caractères autorisés`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      if (name === 'email') return 'Format d\'email invalide';
      if (name === 'phone') return 'Format de téléphone invalide';
      return 'Format invalide';
    }

    if (value && rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validate = React.useCallback((name: string, value: string) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === null;
  }, [validateField]);

  const validateAll = React.useCallback((values: { [key: string]: string }) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(name => {
      const error = validateField(name, values[name] || '');
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const touch = React.useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validate,
    validateAll,
    touch,
    clearErrors,
    hasError: (name: string) => touched[name] && !!errors[name],
    getError: (name: string) => touched[name] ? errors[name] : null
  };
};