import { useCallback } from 'react';
import { analytics } from '@/utils/analytics';

export const useMarketingTracking = () => {
  const trackFormSubmission = useCallback((formName: string, utmData?: any) => {
    const storedUtmData = sessionStorage.getItem('utm_data');
    const campaignData = storedUtmData ? JSON.parse(storedUtmData) : {};
    
    analytics.trackEvent({
      action: 'form_submission',
      category: 'Marketing',
      label: formName,
      custom_parameters: {
        ...campaignData,
        ...utmData,
        form_name: formName,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  const trackCourseInterest = useCallback((courseName: string, action: string) => {
    const storedUtmData = sessionStorage.getItem('utm_data');
    const campaignData = storedUtmData ? JSON.parse(storedUtmData) : {};
    
    analytics.trackEvent({
      action: 'course_interest',
      category: 'Marketing',
      label: `${courseName}_${action}`,
      custom_parameters: {
        ...campaignData,
        course_name: courseName,
        interaction_type: action,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  const trackSocialShare = useCallback((platform: string, contentType: string, contentId: string) => {
    analytics.trackEvent({
      action: 'social_share',
      category: 'Marketing',
      label: `${platform}_${contentType}`,
      custom_parameters: {
        platform,
        content_type: contentType,
        content_id: contentId,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  const trackNewsletterSignup = useCallback((source: string) => {
    const storedUtmData = sessionStorage.getItem('utm_data');
    const campaignData = storedUtmData ? JSON.parse(storedUtmData) : {};
    
    analytics.trackEvent({
      action: 'newsletter_signup',
      category: 'Marketing',
      label: source,
      custom_parameters: {
        ...campaignData,
        signup_source: source,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  const trackAppointmentBooking = useCallback((source: string) => {
    const storedUtmData = sessionStorage.getItem('utm_data');
    const campaignData = storedUtmData ? JSON.parse(storedUtmData) : {};
    
    analytics.trackEvent({
      action: 'appointment_booking',
      category: 'Marketing',
      label: source,
      custom_parameters: {
        ...campaignData,
        booking_source: source,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  return {
    trackFormSubmission,
    trackCourseInterest,
    trackSocialShare,
    trackNewsletterSignup,
    trackAppointmentBooking
  };
};