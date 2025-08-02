// Enhanced Mobile Detection and Optimization Utilities

// Enhanced Device and Viewport Detection
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for touch capability and screen size
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobileUserAgent || (hasTouchScreen && isSmallScreen);
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  // Account for iOS Safari's dynamic viewport and other mobile browsers
  return window.visualViewport?.height || 
         document.documentElement.clientHeight || 
         window.innerHeight;
};

export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 0;
  return window.visualViewport?.width || 
         document.documentElement.clientWidth || 
         window.innerWidth;
};

// User Interaction Prevention
export const preventZoom = (): void => {
  // Prevent zoom on double-tap for mobile
  if (isMobileDevice()) {
    document.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
};

// Compatibility Checks
export const checkMobileCompatibility = (): { compatible: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for common mobile compatibility issues
  if (typeof window === 'undefined') {
    return { compatible: false, issues: ['Window object not available'] };
  }

  // Check for modern JavaScript features
  if (!window.fetch) issues.push('Fetch API not supported');
  if (!window.Promise) issues.push('Promises not supported');
  if (!window.Map) issues.push('Map not supported');
  if (!window.Set) issues.push('Set not supported');

  // Check for modern CSS features
  try {
    if (!CSS.supports('display', 'grid')) issues.push('CSS Grid not supported');
    if (!CSS.supports('display', 'flex')) issues.push('CSS Flexbox not supported');
  } catch (e) {
    issues.push('CSS.supports not available');
  }

  return {
    compatible: issues.length === 0,
    issues
  };
};

// Error Reporting
export const initMobileErrorReporting = (): void => {
  if (typeof window === 'undefined') return;

  // Enhanced error reporting for mobile
  window.addEventListener('error', (event) => {
    const mobileInfo = {
      isMobile: isMobileDevice(),
      isIOS: isIOS(),
      isAndroid: isAndroid(),
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      isOnline: navigator.onLine
    };

    console.error('Mobile Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      mobileInfo
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Mobile Promise Rejection:', {
      reason: event.reason,
      isMobile: isMobileDevice(),
      userAgent: navigator.userAgent
    });
  });
};

// Enhanced Mobile Optimization Logic
export const optimizeForMobile = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize mobile error reporting
  initMobileErrorReporting();

  // Check compatibility
  const compatibility = checkMobileCompatibility();
  if (!compatibility.compatible) {
    console.warn('Mobile compatibility issues detected:', compatibility.issues);
  }

  // Add universal optimizations (not just mobile)
  setupUniversalOptimizations();

  // Add device-specific optimizations
  if (isMobileDevice()) {
    setupMobileSpecificOptimizations();
  }

  console.log('Universal optimizations applied');
};

// Universal optimizations for all devices
const setupUniversalOptimizations = (): void => {
  // Improve viewport handling
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
  }

  // Add device classes for styling
  document.body.classList.add(isMobileDevice() ? 'mobile-device' : 'desktop-device');
  if (isIOS()) document.body.classList.add('ios-device');
  if (isAndroid()) document.body.classList.add('android-device');

  // Register Service Worker for all devices
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('SW registered successfully:', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version available');
                // Optionally notify user of update
                if (window.confirm?.('New version available. Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  }

  // Add performance monitoring
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation timing:', {
              loadComplete: navEntry.loadEventEnd,
              domContentLoaded: navEntry.domContentLoadedEventEnd,
              device: isMobileDevice() ? 'mobile' : 'desktop'
            });
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }
};

// Mobile-specific optimizations
const setupMobileSpecificOptimizations = (): void => {
  // Prevent zoom on mobile
  preventZoom();

  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Recalculate viewport
      const newViewport = document.querySelector('meta[name="viewport"]');
      if (newViewport) {
        newViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
      }
      
      // Trigger resize event for components
      window.dispatchEvent(new Event('resize'));
    }, 500);
  });

  // Add touch improvements
  document.body.style.touchAction = 'manipulation';
  (document.body.style as any).webkitTouchCallout = 'none';
  (document.body.style as any).webkitUserSelect = 'none';
  
  // Preload critical mobile resources
  const criticalResources = ['/manifest.json', '/favicon.png'];
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};