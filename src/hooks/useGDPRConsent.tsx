import { useState, useEffect } from 'react';

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
  const [consent, setConsent] = useState<ConsentPreferences>(DEFAULT_CONSENT);
  const [hasChosenConsent, setHasChosenConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem('gdpr-consent');
    const consentTimestamp = localStorage.getItem('gdpr-consent-timestamp');
    
    if (storedConsent && consentTimestamp) {
      const timestamp = parseInt(consentTimestamp);
      const thirteenMonthsAgo = Date.now() - (13 * 30 * 24 * 60 * 60 * 1000);
      
      if (timestamp > thirteenMonthsAgo) {
        setConsent(JSON.parse(storedConsent));
        setHasChosenConsent(true);
      } else {
        // Consent expired, show banner again
        setShowBanner(true);
        localStorage.removeItem('gdpr-consent');
        localStorage.removeItem('gdpr-consent-timestamp');
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const updateConsent = (newConsent: ConsentPreferences) => {
    setConsent(newConsent);
    setHasChosenConsent(true);
    setShowBanner(false);
    
    localStorage.setItem('gdpr-consent', JSON.stringify(newConsent));
    localStorage.setItem('gdpr-consent-timestamp', Date.now().toString());
    
    // Reload page to apply consent changes to analytics
    if (newConsent.analytics !== consent.analytics || newConsent.marketing !== consent.marketing) {
      window.location.reload();
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