import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/logger';

interface EmailValidationResult {
  isValid: boolean;
  isDuplicate: boolean;
  suggestion?: string;
  message?: string;
}

const EMAIL_SUGGESTIONS = {
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'outlok.com': 'outlook.com'
};

export const useEmailValidation = () => {
  const [validationState, setValidationState] = useState<{
    [email: string]: EmailValidationResult;
  }>({});
  const [isValidating, setIsValidating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const validateEmailFormat = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const getSuggestion = useCallback((email: string): string | undefined => {
    const [localPart, domain] = email.split('@');
    if (!domain) return undefined;
    
    const suggestion = EMAIL_SUGGESTIONS[domain.toLowerCase()];
    return suggestion ? `${localPart}@${suggestion}` : undefined;
  }, []);

  const checkDuplicate = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('email')
        .eq('email', email.toLowerCase())
        .limit(1);
      
      if (error) {
        logError('Email duplicate check error:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      logError('Email duplicate check failed:', error);
      return false;
    }
  }, []);

  const validateEmail = useCallback((email: string) => {
    if (!email.trim()) {
      setValidationState(prev => ({ ...prev, [email]: { isValid: false, isDuplicate: false } }));
      return;
    }

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Immediate format validation
    const isValidFormat = validateEmailFormat(email);
    const suggestion = getSuggestion(email);
    
    if (!isValidFormat) {
      setValidationState(prev => ({
        ...prev,
        [email]: {
          isValid: false,
          isDuplicate: false,
          suggestion,
          message: suggestion ? `Vouliez-vous dire ${suggestion} ?` : 'Format d\'email invalide'
        }
      }));
      return;
    }

    // Debounced duplicate check
    debounceRef.current = setTimeout(async () => {
      setIsValidating(true);
      
      try {
        const isDuplicate = await checkDuplicate(email);
        
        setValidationState(prev => ({
          ...prev,
          [email]: {
            isValid: !isDuplicate,
            isDuplicate,
            message: isDuplicate ? 'Cette adresse email est déjà enregistrée' : undefined
          }
        }));
      } catch (error) {
        setValidationState(prev => ({
          ...prev,
          [email]: {
            isValid: true, // Assume valid if check fails
            isDuplicate: false,
            message: 'Impossible de vérifier l\'email pour le moment'
          }
        }));
      } finally {
        setIsValidating(false);
      }
    }, 500);
  }, [validateEmailFormat, getSuggestion, checkDuplicate]);

  const getValidationResult = useCallback((email: string): EmailValidationResult | null => {
    return validationState[email] || null;
  }, [validationState]);

  const clearValidation = useCallback((email: string) => {
    setValidationState(prev => {
      const newState = { ...prev };
      delete newState[email];
      return newState;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    validateEmail,
    getValidationResult,
    clearValidation,
    isValidating
  };
};