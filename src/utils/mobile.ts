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
    // Add mobile-specific meta tags if they don't exist
    const addMetaTag = (name: string, content: string) => {
      try {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      } catch (error) {
        console.warn(`Failed to add meta tag ${name}:`, error);
      }
    };

    if (isMobileDevice()) {
      // Only add meta tags if document is ready and head exists
      if (document.head) {
        addMetaTag('mobile-web-app-capable', 'yes');
        addMetaTag('apple-mobile-web-app-capable', 'yes');
        addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
      }
    }
  } catch (error) {
    console.warn('Mobile optimization failed:', error);
  }
};