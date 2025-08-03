import * as React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

const UTMTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
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
      
      // Track the campaign source
      analytics.trackEvent({
        action: 'campaign_visit',
        category: 'Marketing',
        label: utmData.utm_campaign || 'direct',
        custom_parameters: filteredUtmData
      });
    }
  }, [location]);

  return null;
};

export default UTMTracker;