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

export const optimizeForMobile = (): void => {
  if (typeof window === 'undefined') return;

  try {
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
        
        // Add CSS class to body for mobile-specific styling
        try {
          document.body.classList.add('mobile-device');
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
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport && viewport.setAttribute) {
                  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
                }
              } catch (e) {
                // Silent fail
              }
            }, { passive: true });
          }
        } catch (e) {
          // Silent fail if orientation events not supported
        }
      }
    }
  } catch (error) {
    // Silent fail to prevent mobile optimization from crashing the app
  }
};