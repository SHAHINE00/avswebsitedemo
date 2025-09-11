// Page Visibility API handling to prevent unnecessary reloads
export const initPageVisibilityHandling = (): void => {
  if (typeof window === 'undefined' || !document) return;

  let wasHidden = false;
  let hiddenTime = 0;
  const MAX_HIDDEN_TIME = 30 * 60 * 1000; // 30 minutes

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Page is now hidden
      wasHidden = true;
      hiddenTime = Date.now();
      console.log('Page hidden, pausing non-critical operations');
      
      // Pause or reduce operations when page is hidden
      // Cancel pending network requests if needed
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.active?.postMessage({ type: 'PAGE_HIDDEN' });
        });
      }
    } else {
      // Page is now visible
      if (wasHidden) {
        const hiddenDuration = Date.now() - hiddenTime;
        console.log(`Page visible again after ${hiddenDuration}ms`);
        
        // Only check for updates if hidden for a long time
        if (hiddenDuration > MAX_HIDDEN_TIME) {
          console.log('Page was hidden for a long time, checking for updates');
          // Could trigger cache refresh here if needed
        }
        
        wasHidden = false;
        hiddenTime = 0;
      }
    }
  };

  // Add debouncing to prevent rapid state changes
  let debounceTimer: number;
  const debouncedHandler = () => {
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(handleVisibilityChange, 100);
  };

  document.addEventListener('visibilitychange', debouncedHandler);
  
  // Also handle focus/blur for older browsers
  window.addEventListener('focus', debouncedHandler);
  window.addEventListener('blur', debouncedHandler);

  console.log('Page visibility handling initialized');
};

// Detect if page reload was caused by navigation vs actual refresh
export const wasPageReloaded = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navigationEntries.length > 0) {
    const navEntry = navigationEntries[0];
    return navEntry.type === 'reload';
  }
  
  // Fallback for older browsers
  return (window.performance as any)?.navigation?.type === 1;
};

// Debug navigation type
export const logNavigationType = (): void => {
  if (typeof window === 'undefined') return;
  
  const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navigationEntries.length > 0) {
    const navEntry = navigationEntries[0];
    console.log('Navigation type:', navEntry.type);
    console.log('Navigation timing:', {
      loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
      domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
      transferSize: navEntry.transferSize
    });
  }
};