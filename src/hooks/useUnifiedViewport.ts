import { useEffect, useCallback } from 'react';
import { isIOS, isMobileDevice } from '@/utils/mobile';

export const useUnifiedViewport = () => {
  const updateViewportHeight = useCallback(() => {
    if (!isMobileDevice()) return;

    // Use dvh for iOS Safari, regular vh for others
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    if (isIOS()) {
      // iOS Safari specific handling
      const visualViewport = window.visualViewport;
      const dvh = visualViewport ? visualViewport.height * 0.01 : vh;
      document.documentElement.style.setProperty('--dvh', `${dvh}px`);
      
      // Remove conflicting body styles that break scrolling
      document.body.style.position = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    } else {
      document.documentElement.style.setProperty('--dvh', `${vh}px`);
    }
  }, []);

  const handleVisualViewportChange = useCallback(() => {
    if (!isIOS() || !window.visualViewport) return;
    
    const dvh = window.visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--dvh', `${dvh}px`);
  }, []);

  const handleOrientationChange = useCallback(() => {
    if (!isMobileDevice()) return;
    
    setTimeout(() => {
      updateViewportHeight();
    }, 100);
  }, [updateViewportHeight]);

  useEffect(() => {
    if (!isMobileDevice()) return;

    updateViewportHeight();

    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', handleOrientationChange);

    if (isIOS() && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (isIOS() && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, [updateViewportHeight, handleOrientationChange, handleVisualViewportChange]);

  return { updateViewportHeight };
};