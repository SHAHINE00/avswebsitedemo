import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics, trackPageView } from '@/utils/analytics';

// Hook for page view tracking
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);
};

// Hook for scroll depth tracking
export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;

    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      const roundedScroll = Math.floor(scrolled / 25) * 25;

      if (roundedScroll > maxScroll && roundedScroll <= 100) {
        maxScroll = roundedScroll;
        analytics.trackScrollDepth(roundedScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

// Hook for form tracking
export const useFormTracking = (formName: string, formType: string) => {
  const trackSubmission = (success: boolean = true) => {
    analytics.trackFormSubmission(formName, formType, success);
  };

  return { trackSubmission };
};

// Hook for content engagement tracking
export const useContentTracking = (contentType: string, contentId: string) => {
  const trackEngagement = (action: string) => {
    analytics.trackContentEngagement(contentType, contentId, action);
  };

  // Track view on mount
  useEffect(() => {
    trackEngagement('view');
  }, []);

  return { trackEngagement };
};

// Hook for user interaction tracking
export const useInteractionTracking = () => {
  const trackClick = (element: string, location?: string) => {
    analytics.trackUserInteraction(element, 'click', location);
  };

  const trackHover = (element: string, location?: string) => {
    analytics.trackUserInteraction(element, 'hover', location);
  };

  const trackFocus = (element: string, location?: string) => {
    analytics.trackUserInteraction(element, 'focus', location);
  };

  return { trackClick, trackHover, trackFocus };
};