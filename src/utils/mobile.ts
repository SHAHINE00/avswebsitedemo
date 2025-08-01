// Mobile detection and optimization utilities

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const getViewportHeight = (): number => {
  // Handle iOS viewport height issues
  if (isIOS()) {
    return window.innerHeight;
  }
  return window.visualViewport?.height || window.innerHeight;
};

export const preventZoom = (): void => {
  // Prevent zoom on double-tap for mobile
  if (isMobileDevice()) {
    document.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    });

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
  const testElement = document.createElement('div');
  if (!CSS.supports('display', 'grid')) issues.push('CSS Grid not supported');
  if (!CSS.supports('display', 'flex')) issues.push('CSS Flexbox not supported');

  return {
    compatible: issues.length === 0,
    issues
  };
};

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

export const optimizeForMobile = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Initialize mobile error reporting
    initMobileErrorReporting();

    // Check compatibility
    const compatibility = checkMobileCompatibility();
    if (!compatibility.compatible) {
      console.warn('Mobile compatibility issues detected:', compatibility.issues);
    }

    // Add mobile-specific meta tags if they don't exist - mobile safe
    const addMetaTag = (name: string, content: string) => {
      try {
        if (document && document.querySelector && document.head && !document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      } catch (error) {
        // Silent fail to prevent mobile crashes
      }
    };

    if (isMobileDevice()) {
      // Only add meta tags if document is ready and head exists
      if (document && document.head && document.body) {
        addMetaTag('mobile-web-app-capable', 'yes');
        addMetaTag('apple-mobile-web-app-capable', 'yes');
        addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
        addMetaTag('theme-color', '#2563eb');
        
        // Add CSS class to body for mobile-specific styling
        try {
          document.body.classList.add('mobile-device');
          if (isIOS()) document.body.classList.add('ios-device');
          if (isAndroid()) document.body.classList.add('android-device');
        } catch (e) {
          // Silent fail if classList not supported
        }
        
        // Prevent double-tap zoom - with error handling
        try {
          if (document.addEventListener) {
            document.addEventListener('gesturestart', (e) => {
              try {
                e.preventDefault();
              } catch (preventError) {
                // Silent fail
              }
            }, { passive: false });
          }
        } catch (e) {
          // Silent fail if gesture events not supported
        }
        
        // Optimize viewport on orientation change - with error handling
        try {
          if (window.addEventListener) {
            window.addEventListener('orientationchange', () => {
              try {
                setTimeout(() => {
                  const viewport = document.querySelector('meta[name="viewport"]');
                  if (viewport && viewport.setAttribute) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
                  }
                }, 300); // Delay for iOS
              } catch (e) {
                // Silent fail
              }
            }, { passive: true });
          }
        } catch (e) {
          // Silent fail if orientation events not supported
        }

        // Preload critical resources for mobile
        try {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = '/';
          document.head.appendChild(link);
        } catch (e) {
          // Silent fail
        }
      }
    }
  } catch (error) {
    // Silent fail to prevent mobile optimization from crashing the app
    console.error('Mobile optimization failed:', error);
  }
};