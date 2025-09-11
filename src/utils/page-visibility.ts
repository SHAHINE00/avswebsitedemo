// Enhanced page visibility management to prevent unnecessary reloads
let isHidden = false;
let hiddenTime = 0;
let rapidChangeCount = 0;

// Debounce rapid visibility changes to prevent reload loops
let visibilityTimeout: number | null = null;

export function initPageVisibilityHandling() {
  if (typeof document === 'undefined') return;

  document.addEventListener('visibilitychange', () => {
    // Clear any pending timeout
    if (visibilityTimeout) {
      clearTimeout(visibilityTimeout);
    }

    // Track rapid changes (likely tab switching)
    rapidChangeCount++;
    setTimeout(() => {
      rapidChangeCount = Math.max(0, rapidChangeCount - 1);
    }, 2000);

    // If rapid changes detected, skip processing
    if (rapidChangeCount > 3) {
      console.log('Rapid tab switching detected - skipping visibility processing');
      return;
    }

    // Debounce the visibility change
    visibilityTimeout = window.setTimeout(() => {
      if (document.hidden && !isHidden) {
        isHidden = true;
        hiddenTime = Date.now();
        console.log('Page hidden - pausing operations');
        
        // Save current state without triggering reloads
        try {
          sessionStorage.setItem('page_hidden_time', hiddenTime.toString());
          sessionStorage.setItem('scroll_position', window.scrollY.toString());
        } catch (e) {
          // Storage might be full or disabled
        }
        
      } else if (!document.hidden && isHidden) {
        isHidden = false;
        const timeHidden = hiddenTime ? Date.now() - hiddenTime : 0;
        console.log(`Page visible after ${timeHidden}ms - optimized resume`);
        
        // Restore scroll position without reload
        try {
          const scrollPosition = sessionStorage.getItem('scroll_position');
          if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
            sessionStorage.removeItem('scroll_position');
          }
        } catch (e) {
          // Scroll restoration failed
        }
        
        // Only perform checks if hidden for more than 30 minutes AND not rapid switching
        if (timeHidden > 30 * 60 * 1000 && rapidChangeCount === 0) {
          console.log('Long absence detected, gentle update check');
          // Check for updates without forcing reload
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              registration.update().catch(err => 
                console.log('Update check failed:', err)
              );
            });
          }
        }
        
        hiddenTime = 0;
        try {
          sessionStorage.removeItem('page_hidden_time');
        } catch (e) {
          // Storage access failed
        }
      }
    }, 150); // Slightly longer debounce for stability
  });
}

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