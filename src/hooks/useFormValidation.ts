import * as React from 'react';

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null;
  asyncValidator?: (value: string) => Promise<string | null>;
}

export interface AsyncValidationState {
  [key: string]: {
    isValidating: boolean;
    result?: string | null;
  };
}

export interface ValidationErrors {
  [key: string]: string | null;
}

export const useFormValidation = (rules: { [key: string]: ValidationRule }) => {
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});
  const [asyncValidation, setAsyncValidation] = React.useState<AsyncValidationState>({});
  
  // Stabilize rules to prevent unnecessary re-renders
  const stableRules = React.useRef(rules);
  React.useEffect(() => {
    stableRules.current = rules;
  }, [rules]);

  const validateField = React.useCallback((name: string, value: string): string | null => {
    const rule = stableRules.current[name];
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
  }, []);

  const validate = React.useCallback(async (name: string, value: string) => {
    const syncError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: syncError }));
    
    // Handle async validation
    const rule = stableRules.current[name];
    if (rule?.asyncValidator && !syncError) {
      setAsyncValidation(prev => ({ 
        ...prev, 
        [name]: { isValidating: true } 
      }));
      
      try {
        const asyncError = await rule.asyncValidator(value);
        setErrors(prev => ({ ...prev, [name]: asyncError }));
        setAsyncValidation(prev => ({ 
          ...prev, 
          [name]: { isValidating: false, result: asyncError } 
        }));
        return asyncError === null;
      } catch (error) {
        setAsyncValidation(prev => ({ 
          ...prev, 
          [name]: { isValidating: false, result: null } 
        }));
        return true; // Assume valid if async validation fails
      }
    }
    
    return syncError === null;
  }, [validateField]);

  const validateAll = React.useCallback((values: { [key: string]: string }) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(stableRules.current).forEach(name => {
      const error = validateField(name, values[name] || '');
      newErrors[name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  const touch = React.useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors({});
    setTouched({});
    setAsyncValidation({});
  }, []);

  return {
    errors,
    touched,
    asyncValidation,
    validate,
    validateAll,
    touch,
    clearErrors,
    hasError: (name: string) => touched[name] && !!errors[name],
    getError: (name: string) => touched[name] ? errors[name] : null,
    isValidating: (name: string) => asyncValidation[name]?.isValidating || false
  };
};