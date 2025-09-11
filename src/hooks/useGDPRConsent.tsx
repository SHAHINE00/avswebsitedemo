import { useSafeState, useSafeEffect } from '@/utils/safeHooks';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  functional: false,
};

export const useGDPRConsent = () => {
  const [consent, setConsent] = useSafeState<ConsentPreferences>(DEFAULT_CONSENT);
  const [hasChosenConsent, setHasChosenConsent] = useSafeState(false);
  const [showBanner, setShowBanner] = useSafeState(false);

  useSafeEffect(() => {
    try {
      // Validate localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage not available for GDPR consent');
        setShowBanner(true);
        return;
      }

      const storedConsent = localStorage.getItem('gdpr-consent');
      const consentTimestamp = localStorage.getItem('gdpr-consent-timestamp');
    
    if (storedConsent && consentTimestamp) {
      const timestamp = parseInt(consentTimestamp);
      const thirteenMonthsAgo = Date.now() - (13 * 30 * 24 * 60 * 60 * 1000);
      
      if (timestamp > thirteenMonthsAgo) {
        try {
          const parsedConsent = JSON.parse(storedConsent);
          // Validate consent structure
          if (parsedConsent && typeof parsedConsent === 'object') {
            setConsent(parsedConsent);
            setHasChosenConsent(true);
          } else {
            throw new Error('Invalid consent structure');
          }
        } catch (error) {
          console.warn('GDPR consent parsing error:', error);
          setShowBanner(true);
          localStorage.removeItem('gdpr-consent');
          localStorage.removeItem('gdpr-consent-timestamp');
        }
      } else {
        // Consent expired, show banner again
        setShowBanner(true);
        localStorage.removeItem('gdpr-consent');
        localStorage.removeItem('gdpr-consent-timestamp');
      }
    } else {
      setShowBanner(true);
    }
    } catch (error) {
      console.error('GDPR consent initialization error:', error);
      setShowBanner(true);
    }
    
    // Debug logging
    console.log('useGDPRConsent: showBanner =', showBanner, 'hasChosenConsent =', hasChosenConsent);
  }, []);

  const updateConsent = (newConsent: ConsentPreferences) => {
    try {
      setConsent(newConsent);
      setHasChosenConsent(true);
      setShowBanner(false);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('gdpr-consent', JSON.stringify(newConsent));
        localStorage.setItem('gdpr-consent-timestamp', Date.now().toString());
      }
      
      // Apply consent changes without reload
      if (newConsent.analytics !== consent.analytics || newConsent.marketing !== consent.marketing) {
        // Dispatch event for analytics service to react to consent changes
        window.dispatchEvent(new CustomEvent('gdpr-consent-changed', { detail: newConsent }));
        // Store in sessionStorage to persist during session
        sessionStorage.setItem('gdpr-consent-applied', 'true');
      }
    } catch (error) {
      console.error('Error updating GDPR consent:', error);
    }
  };

  const acceptAll = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  };

  const rejectOptional = () => {
    updateConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  };

  const revokeConsent = () => {
    setConsent(DEFAULT_CONSENT);
    setHasChosenConsent(false);
    setShowBanner(true);
    localStorage.removeItem('gdpr-consent');
    localStorage.removeItem('gdpr-consent-timestamp');
  };

  return {
    consent,
    hasChosenConsent,
    showBanner,
    updateConsent,
    acceptAll,
    rejectOptional,
    revokeConsent,
  };
};