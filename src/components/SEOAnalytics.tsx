import * as React from 'react';
import { useLocation } from 'react-router-dom';

const SEOAnalytics = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Google Search Console verification
    const addSearchConsoleVerification = () => {
      if (!document.querySelector('meta[name="google-site-verification"]')) {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE';
        document.head.appendChild(meta);
      }
    };

    // Bing Webmaster Tools verification
    const addBingVerification = () => {
      if (!document.querySelector('meta[name="msvalidate.01"]')) {
        const meta = document.createElement('meta');
        meta.name = 'msvalidate.01';
        meta.content = 'YOUR_BING_VERIFICATION_CODE';
        document.head.appendChild(meta);
      }
    };

    // Additional SEO meta tags
    const addSEOMetaTags = () => {
      const metaTags = [
        { name: 'author', content: 'AVS Institut' },
        { name: 'publisher', content: 'AVS Institut' },
        { name: 'language', content: 'fr' },
        { name: 'revisit-after', content: '7 days' },
        { name: 'distribution', content: 'global' },
        { name: 'rating', content: 'general' },
        { name: 'subject', content: 'Formation Intelligence Artificielle, Programmation, Cybersécurité' },
        { name: 'classification', content: 'Education, Technology, Professional Training' },
        { name: 'geo.region', content: 'MA' },
        { name: 'geo.country', content: 'Morocco' },
        { name: 'geo.placename', content: 'Casablanca' }
      ];

      metaTags.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      });
    };

    // Preconnect to external domains for performance
    const addPreconnects = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ];

      domains.forEach(domain => {
        if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          if (domain.includes('fonts')) {
            link.crossOrigin = '';
          }
          document.head.appendChild(link);
        }
      });
    };

    addSearchConsoleVerification();
    addBingVerification();
    addSEOMetaTags();
    addPreconnects();
  }, []);

  // Track page views for analytics
  React.useEffect(() => {
    // Send page view to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      });
    }
  }, [location]);

  return null;
};

export default SEOAnalytics;