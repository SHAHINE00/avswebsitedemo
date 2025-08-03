// Google Analytics 4 tracking utilities
import { ENV_CONFIG } from './envConfig';
import { logInfo } from './logger';

// GA4 Events Interface
interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Declare gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class AnalyticsService {
  private isInitialized = false;
  private isEnabled = ENV_CONFIG.features.enableAnalytics;
  private consentListener: ((event: CustomEvent) => void) | null = null;

  constructor() {
    this.initialize();
    this.setupConsentListener();
  }

  private initialize() {
    if (typeof window === 'undefined' || !this.isEnabled) {
      return;
    }

    // Check GDPR consent before initializing
    const consent = this.getGDPRConsent();
    if (!consent.analytics) {
      logInfo('Analytics blocked - no consent for analytics cookies');
      return;
    }

    try {
      // Check if gtag is available - mobile safe
      if (window.gtag && typeof window.gtag === 'function') {
        this.isInitialized = true;
        logInfo('Analytics service initialized');
      } else {
        // Wait for gtag to load on mobile
        let retries = 0;
        const checkGtag = () => {
          if (window.gtag && typeof window.gtag === 'function') {
            this.isInitialized = true;
            logInfo('Analytics service initialized (delayed)');
          } else if (retries < 10) {
            retries++;
            setTimeout(checkGtag, 500);
          }
        };
        setTimeout(checkGtag, 100);
      }
    } catch (error) {
      // Silent fail on mobile if analytics can't initialize
      logInfo('Analytics initialization failed, continuing without tracking');
    }
  }

  private setupConsentListener() {
    if (typeof window === 'undefined') return;
    
    this.consentListener = (event: CustomEvent) => {
      const newConsent = event.detail;
      if (newConsent.analytics && !this.isInitialized) {
        // User just granted analytics consent, initialize now
        this.initialize();
      } else if (!newConsent.analytics && this.isInitialized) {
        // User revoked analytics consent, disable tracking
        this.isInitialized = false;
        logInfo('Analytics disabled due to consent revocation');
      }
    };
    
    window.addEventListener('gdpr-consent-changed', this.consentListener as EventListener);
  }

  private getGDPRConsent() {
    if (typeof window === 'undefined') return { analytics: false };
    
    try {
      const consent = localStorage.getItem('gdpr-consent');
      if (!consent) return { analytics: false };
      
      const parsedConsent = JSON.parse(consent);
      return parsedConsent || { analytics: false };
    } catch (error) {
      console.warn('Error parsing GDPR consent:', error);
      return { analytics: false };
    }
  }

  // Track custom events - mobile safe
  trackEvent(event: GAEvent) {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Check consent before tracking
    const consent = this.getGDPRConsent();
    if (!consent.analytics) {
      return; // Silently skip tracking without consent
    }

    if (!this.isInitialized) return;

    try {
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          ...event.custom_parameters
        });

        logInfo(`Analytics event tracked: ${event.action}`, event);
      }
    } catch (error) {
      // Silent fail on mobile to prevent app crashes
      logInfo('Analytics event tracking failed, continuing without tracking');
    }
  }

  // Track page views - mobile safe
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Check consent before tracking
    const consent = this.getGDPRConsent();
    if (!consent.analytics) {
      return; // Silently skip tracking without consent
    }

    if (!this.isInitialized) return;

    try {
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('config', 'G-XXXXXXXXXX', {
          page_path: pagePath,
          page_title: pageTitle || (document && document.title) || 'Unknown',
        });

        logInfo(`Page view tracked: ${pagePath}`);
      }
    } catch (error) {
      // Silent fail on mobile to prevent app crashes
      logInfo('Page view tracking failed, continuing without tracking');
    }
  }

  // Track conversions
  trackConversion(conversionId: string, value?: number, currency = 'EUR') {
    if (!this.isInitialized || !this.isEnabled) return;

    try {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: currency,
      });

      logInfo(`Conversion tracked: ${conversionId}`, { value, currency });
    } catch (error) {
      // Silent fail on mobile to prevent app crashes
      logInfo('Conversion tracking failed, continuing without tracking');
    }
  }

  // Enhanced ecommerce - course enrollment
  trackCourseEnrollment(courseId: string, courseName: string, courseValue?: number) {
    this.trackEvent({
      action: 'course_enrollment',
      category: 'engagement',
      label: courseName,
      value: courseValue,
      custom_parameters: {
        course_id: courseId,
        course_name: courseName,
        enrollment_method: 'website'
      }
    });

    // Also track as purchase for ecommerce
    if (courseValue) {
      window.gtag('event', 'purchase', {
        transaction_id: `enrollment_${courseId}_${Date.now()}`,
        value: courseValue,
        currency: 'EUR',
        items: [{
          item_id: courseId,
          item_name: courseName,
          category: 'course',
          quantity: 1,
          price: courseValue
        }]
      });
    }
  }

  // Track form submissions
  trackFormSubmission(formName: string, formType: string, success = true) {
    this.trackEvent({
      action: 'form_submit',
      category: 'engagement',
      label: formName,
      custom_parameters: {
        form_type: formType,
        success: success
      }
    });
  }

  // Track content engagement
  trackContentEngagement(contentType: string, contentId: string, action: string) {
    this.trackEvent({
      action: action,
      category: 'content_engagement',
      label: contentId,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId
      }
    });
  }

  // Track user interactions
  trackUserInteraction(element: string, action: string, location?: string) {
    this.trackEvent({
      action: 'user_interaction',
      category: 'engagement',
      label: element,
      custom_parameters: {
        interaction_element: element,
        interaction_action: action,
        page_location: location || window.location.pathname
      }
    });
  }

  // Track newsletter signup
  trackNewsletterSignup(source: string) {
    this.trackEvent({
      action: 'newsletter_signup',
      category: 'lead_generation',
      label: source,
      custom_parameters: {
        signup_source: source
      }
    });

    // Track as conversion
    this.trackConversion('newsletter_signup');
  }

  // Track appointment booking
  trackAppointmentBooking(appointmentType?: string) {
    this.trackEvent({
      action: 'appointment_booking',
      category: 'lead_generation',
      label: appointmentType || 'general',
      custom_parameters: {
        appointment_type: appointmentType
      }
    });

    // Track as conversion
    this.trackConversion('appointment_booking');
  }

  // Track download
  trackDownload(fileName: string, downloadType: string) {
    this.trackEvent({
      action: 'file_download',
      category: 'engagement',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        download_type: downloadType
      }
    });
  }

  // Track search
  trackSiteSearch(searchTerm: string, resultsCount?: number) {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount
      }
    });
  }

  // Track scroll depth
  trackScrollDepth(percentage: number) {
    if (percentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
      this.trackEvent({
        action: 'scroll_depth',
        category: 'engagement',
        label: `${percentage}%`,
        value: percentage,
        custom_parameters: {
          page_path: window.location.pathname
        }
      });
    }
  }

  // Track video interactions
  trackVideoInteraction(videoId: string, action: string, progress?: number) {
    this.trackEvent({
      action: `video_${action}`,
      category: 'video_engagement',
      label: videoId,
      value: progress,
      custom_parameters: {
        video_id: videoId,
        video_action: action,
        video_progress: progress
      }
    });
  }

  // Set user properties
  setUserProperties(properties: Record<string, string>) {
    if (!this.isInitialized || !this.isEnabled) return;

    try {
      window.gtag('config', 'G-XXXXXXXXXX', {
        custom_map: properties
      });
    } catch (error) {
      // Silent fail on mobile to prevent app crashes
      logInfo('User properties setting failed, continuing without tracking');
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Convenience functions
export const trackEvent = (event: GAEvent) => analytics.trackEvent(event);
export const trackPageView = (path: string, title?: string) => analytics.trackPageView(path, title);
export const trackConversion = (id: string, value?: number) => analytics.trackConversion(id, value);
export const trackCourseEnrollment = (courseId: string, courseName: string, value?: number) => 
  analytics.trackCourseEnrollment(courseId, courseName, value);
export const trackFormSubmission = (formName: string, formType: string, success?: boolean) => 
  analytics.trackFormSubmission(formName, formType, success);
export const trackNewsletterSignup = (source: string) => analytics.trackNewsletterSignup(source);
export const trackAppointmentBooking = (type?: string) => analytics.trackAppointmentBooking(type);
export const trackDownload = (fileName: string, type: string) => analytics.trackDownload(fileName, type);
export const trackUserInteraction = (element: string, action: string, location?: string) => 
  analytics.trackUserInteraction(element, action, location);