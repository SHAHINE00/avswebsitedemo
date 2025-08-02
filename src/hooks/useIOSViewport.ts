import { useEffect, useCallback } from 'react';
import { isIOS } from '@/utils/mobile';

export const useIOSViewport = () => {
  const updateViewportHeight = useCallback(() => {
    if (!isIOS()) return;

    // Get accurate viewport height for iOS Safari
    const vh = window.innerHeight * 0.01;
    const visualViewport = window.visualViewport;
    const vvh = visualViewport ? visualViewport.height * 0.01 : vh;
    
    // Set CSS custom properties
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vvh', `${vvh}px`);
    document.documentElement.style.setProperty('--dvh', `${vvh}px`);
    
    // Apply iOS-specific body styles
    document.body.style.height = `${window.innerHeight}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    console.log('iOS viewport updated:', { vh, vvh, innerHeight: window.innerHeight });
  }, []);

  const handleVisualViewportChange = useCallback(() => {
    if (!isIOS() || !window.visualViewport) return;

    const vvh = window.visualViewport.height * 0.01;
    document.documentElement.style.setProperty('--vvh', `${vvh}px`);
    document.documentElement.style.setProperty('--dvh', `${vvh}px`);
  }, []);

  const handleOrientationChange = useCallback(() => {
    if (!isIOS()) return;

    // iOS needs time to adjust after orientation change
    setTimeout(() => {
      updateViewportHeight();
      
      // Force a reflow to ensure proper layout
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
      
      // Dispatch custom event for components to react
      window.dispatchEvent(new CustomEvent('iosViewportChange', {
        detail: { height: window.innerHeight }
      }));
    }, 100);
  }, [updateViewportHeight]);

  useEffect(() => {
    if (!isIOS()) return;

    // Initial setup
    updateViewportHeight();

    // Listen for viewport changes
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Visual viewport API support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
        window.visualViewport.removeEventListener('scroll', handleVisualViewportChange);
      }
      
      // Reset body styles when component unmounts
      if (isIOS()) {
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      }
    };
  }, [updateViewportHeight, handleOrientationChange, handleVisualViewportChange]);

  return { updateViewportHeight };
};