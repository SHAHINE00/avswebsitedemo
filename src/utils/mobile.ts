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
  
  // Enhanced iOS detection including newer devices
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  // Traditional iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent)) return true;
  
  // Modern iPad detection (iOS 13+)
  if (platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
  
  // Additional iOS detection for standalone mode
  if ((window.navigator as any).standalone !== undefined) return true;
  
  // Check for iOS-specific properties
  if ('DeviceMotionEvent' in window && typeof (DeviceMotionEvent as any).requestPermission === 'function') return true;
  
  return false;
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  
  // Enhanced viewport height calculation for mobile scrolling
  if (window.visualViewport) {
    return window.visualViewport.height;
  }
  
  // For iOS Safari with dynamic address bar
  if (isIOS()) {
    // Use innerHeight for consistent behavior during scroll
    return window.innerHeight;
  }
  
  return document.documentElement.clientHeight || window.innerHeight;
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
    
    // Add device class for CSS targeting
    if (isIOS()) {
      document.body.classList.add('ios-device', 'mobile-device');
      setupIOSSpecificFixes();
    } else if (isAndroid()) {
      document.body.classList.add('android-device', 'mobile-device');
      setupAndroidSpecificFixes();
    }
  }

  // Initialize page visibility handling
  if (typeof window !== 'undefined') {
    import('./page-visibility').then(({ initPageVisibilityHandling, logNavigationType }) => {
      initPageVisibilityHandling();
      logNavigationType();
    }).catch(err => console.warn('Page visibility handling failed:', err));
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
        
        // Handle updates (no auto-reload to prevent tab switching issues)
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New version available (will update on next visit)');
                // Show subtle notification without blocking user
                const notification = document.createElement('div');
                notification.style.cssText = `
                  position: fixed; top: 20px; right: 20px; z-index: 10000;
                  background: #4ade80; color: white; padding: 8px 16px;
                  border-radius: 6px; font-size: 14px; opacity: 0.9;
                  transition: opacity 0.3s ease;
                `;
                notification.textContent = 'Nouvelle version disponible';
                document.body.appendChild(notification);
                setTimeout(() => {
                  if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                  }
                }, 3000);
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

// Mobile-specific optimizations with enhanced iOS support
const setupMobileSpecificOptimizations = (): void => {
  // Prevent zoom on mobile
  preventZoom();

  // iOS-specific fixes
  if (isIOS()) {
    setupIOSSpecificFixes();
  }

  // Handle orientation changes with iOS-specific handling
  const handleOrientationChange = () => {
    setTimeout(() => {
      // Recalculate viewport
      const newViewport = document.querySelector('meta[name="viewport"]');
      if (newViewport) {
        newViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
      }
      
      // Let CSS handle viewport - no manual height manipulation
      
      // Trigger resize event for components
      window.dispatchEvent(new Event('resize'));
    }, isIOS() ? 800 : 500); // iOS needs more time
  };

  window.addEventListener('orientationchange', handleOrientationChange);
  
  // iOS Safari resize handling
  if (isIOS()) {
    window.addEventListener('resize', () => {
      clearTimeout((window as any)._resizeTimer);
      (window as any)._resizeTimer = setTimeout(handleOrientationChange, 300);
    });
  }

  // Natural touch scrolling for mobile
  document.body.style.touchAction = 'pan-y pinch-zoom';
  (document.body.style as any).webkitOverflowScrolling = 'touch';
  
  // Add scroll momentum and smooth scrolling
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Use consistent touch action for all elements
  const formElements = document.querySelectorAll('input, textarea, select');
  formElements.forEach(element => {
    (element as HTMLElement).style.touchAction = 'pan-y pinch-zoom';
  });
  
  // Preload critical mobile resources
  const criticalResources = ['/manifest.json', '/favicon.png'];
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// iOS-specific fixes for Safari compatibility
const setupIOSSpecificFixes = (): void => {
  try {
    // No viewport height manipulation - let CSS handle with 100dvh

    // Minimal touch handling - only prevent pinch zoom
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      // Only prevent multi-touch pinch zoom
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    // Force iOS to respect our Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length === 0) {
          // Force re-registration on iOS if it failed
          navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .catch(error => console.warn('iOS Service Worker registration failed:', error));
        }
      });
    }

    // iOS-specific error handling for module loading (no auto-reload)
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('Loading chunk')) {
        console.warn('iOS chunk loading error detected, clearing caches');
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        // Show error message instead of auto-reload
        console.error('Chunk loading failed. Please refresh the page manually.');
      }
    });

    // iOS Safari memory management
    const cleanupMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize / memory.totalJSHeapSize > 0.9) {
          console.warn('iOS memory usage high, clearing caches');
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => caches.delete(name));
            });
          }
        }
      }
    };
    
    // Check memory every 30 seconds on iOS
    setInterval(cleanupMemory, 30000);

    console.log('iOS-specific optimizations applied');
  } catch (error) {
    console.warn('iOS-specific fixes failed:', error);
  }
};

// Android-specific fixes for Chrome and WebView compatibility
const setupAndroidSpecificFixes = (): void => {
  try {
    // Android Chrome viewport handling
    const updateViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
        );
      }
    };
    
    updateViewport();
    
    // Handle Android keyboard resize
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Android touch optimization
    document.addEventListener('touchstart', () => {}, { passive: true });
    
    // Prevent zoom on form inputs while allowing user zoom
    const preventInputZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', preventInputZoom);
    
    // Fix Android Chrome address bar height changes
    let ticking = false;
    const updateVH = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', updateVH, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(updateVH, 100);
    });

    // Android-specific font rendering
    document.documentElement.style.fontFeatureSettings = '"kern" 1, "liga" 1';
    document.documentElement.style.textRendering = 'optimizeLegibility';
    
    // Improve Android scrolling performance
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overscrollBehaviorX = 'none';

    console.log('Android-specific optimizations applied');
  } catch (error) {
    console.warn('Android-specific fixes failed:', error);
  }
};