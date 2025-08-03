import React from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

const UTMTracker: React.FC = () => {
  // Early return if React is not available - don't use any hooks
  if (typeof React === 'undefined' || React === null || !React.useEffect) {
    return null;
  }

  let location;
  try {
    location = useLocation();
  } catch (error) {
    console.warn('UTMTracker: useLocation failed - React may be null:', error);
    return null;
  }

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const utmData = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      referrer: document.referrer,
      landing_page: location.pathname + location.search
    };

    // Filter out null values
    const filteredUtmData = Object.fromEntries(
      Object.entries(utmData).filter(([_, value]) => value !== null && value !== '')
    );

    // Store UTM data in sessionStorage for the session
    if (Object.keys(filteredUtmData).length > 0) {
      sessionStorage.setItem('utm_data', JSON.stringify(filteredUtmData));
      
      // Only track if user consents to marketing cookies
      const consent = localStorage.getItem('gdpr-consent');
      if (consent) {
        try {
          const consentData = JSON.parse(consent);
          if (consentData.marketing) {
            analytics.trackEvent({
              action: 'campaign_visit',
              category: 'Marketing',
              label: utmData.utm_campaign || 'direct',
              custom_parameters: filteredUtmData
            });
          }
        } catch (error) {
          console.warn('GDPR consent parsing error:', error);
        }
      }
    }
  }, [location]);

  return null;
};

export default UTMTracker;