import { useCallback } from 'react';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';

interface GDPRError {
  type: 'consent_parsing' | 'component_render' | 'analytics_init' | 'data_corruption';
  message: string;
  timestamp: number;
  details?: any;
}

export const useGDPRMonitoring = () => {
  const [errors, setErrors] = useSafeState<GDPRError[]>([]);

  const logGDPRError = useCallback((type: GDPRError['type'], message: string, details?: any) => {
    const error: GDPRError = {
      type,
      message,
      timestamp: Date.now(),
      details
    };
    
    setErrors(prev => [...prev.slice(-9), error]); // Keep last 10 errors
    console.error(`GDPR Error [${type}]:`, message, details);
  }, []);

  const validateConsentData = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }

      const consent = localStorage.getItem('gdpr-consent');
      const timestamp = localStorage.getItem('gdpr-consent-timestamp');
      
      if (!consent || !timestamp) {
        return true; // No consent data is valid state
      }
      
      const parsedConsent = JSON.parse(consent);
      const parsedTimestamp = parseInt(timestamp);
      
      // Validate structure
      if (!parsedConsent || typeof parsedConsent !== 'object') {
        logGDPRError('data_corruption', 'Invalid consent structure detected');
        return false;
      }
      
      // Validate required fields
      if (typeof parsedConsent.necessary !== 'boolean') {
        logGDPRError('data_corruption', 'Missing required consent fields');
        return false;
      }
      
      // Validate timestamp
      if (isNaN(parsedTimestamp) || parsedTimestamp <= 0) {
        logGDPRError('data_corruption', 'Invalid consent timestamp');
        return false;
      }
      
      return true;
    } catch (error) {
      logGDPRError('consent_parsing', 'Failed to validate consent data', error);
      return false;
    }
  }, [logGDPRError]);

  const recoverCorruptedData = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }

      localStorage.removeItem('gdpr-consent');
      localStorage.removeItem('gdpr-consent-timestamp');
      
      // Trigger banner to show again
      window.dispatchEvent(new CustomEvent('gdpr-data-recovered'));
      
      return true;
    } catch (error) {
      logGDPRError('data_corruption', 'Failed to recover corrupted GDPR data', error);
      return false;
    }
  }, [logGDPRError]);

  useSafeEffect(() => {
    // Validate data on mount
    if (!validateConsentData()) {
      recoverCorruptedData();
    }
    
    // Periodic validation (every 5 minutes)
    const interval = setInterval(() => {
      if (!validateConsentData()) {
        recoverCorruptedData();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [validateConsentData, recoverCorruptedData]);

  return {
    errors,
    logGDPRError,
    validateConsentData,
    recoverCorruptedData,
  };
};