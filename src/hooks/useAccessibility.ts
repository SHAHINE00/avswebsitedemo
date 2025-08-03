import { useEffect, useState, useCallback } from 'react';

interface AccessibilityOptions {
  announcePageChanges?: boolean;
  manageTabIndex?: boolean;
  respectMotionPreference?: boolean;
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    announcePageChanges = true,
    manageTabIndex = true,
    respectMotionPreference = true
  } = options;

  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (respectMotionPreference) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [respectMotionPreference]);

  useEffect(() => {
    // Check for high contrast preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setHighContrast(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Detect screen reader usage
    const checkScreenReader = () => {
      const isScreenReader = window.navigator.userAgent.includes('NVDA') ||
                           window.navigator.userAgent.includes('JAWS') ||
                           window.speechSynthesis?.getVoices().length > 0;
      setScreenReaderActive(isScreenReader);
    };

    checkScreenReader();
    
    // Check again after voices are loaded
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', checkScreenReader);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', checkScreenReader);
    }
  }, []);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        container.dispatchEvent(new CustomEvent('escapefocus'));
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getAnimationClasses = useCallback((defaultClasses: string) => {
    return reduceMotion ? '' : defaultClasses;
  }, [reduceMotion]);

  return {
    reduceMotion,
    highContrast,
    screenReaderActive,
    announceToScreenReader,
    trapFocus,
    getAnimationClasses,
    accessibilityClasses: {
      'motion-reduce': reduceMotion,
      'high-contrast': highContrast,
      'screen-reader': screenReaderActive
    }
  };
}

// Screen reader only class utility
export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';