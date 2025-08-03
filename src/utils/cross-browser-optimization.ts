/**
 * Cross-browser compatibility utilities
 * Handles device detection and browser-specific optimizations
 */

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  touchEnabled: boolean;
  platform: string;
}

/**
 * Comprehensive device and browser detection
 */
export function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  
  // Device detection
  const isIOS = /iphone|ipad|ipod|ios/.test(userAgent) || 
                (platform === 'macintel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  
  // Browser detection
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent);
  const isFirefox = /firefox/.test(userAgent);
  const isEdge = /edge/.test(userAgent) || /edg\//.test(userAgent);
  
  // Screen size detection
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;
  
  // Touch capability
  const touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isEdge,
    isMobile,
    isTablet,
    isDesktop,
    touchEnabled,
    platform
  };
}

/**
 * Apply device-specific CSS classes to body
 */
export function applyDeviceClasses(): void {
  const device = getDeviceInfo();
  const body = document.body;
  
  // Remove existing device classes
  body.classList.remove('ios-device', 'android-device', 'mobile-device', 'tablet-device', 'desktop-device');
  body.classList.remove('safari-browser', 'chrome-browser', 'firefox-browser', 'edge-browser');
  
  // Add device classes
  if (device.isIOS) body.classList.add('ios-device');
  if (device.isAndroid) body.classList.add('android-device');
  if (device.isMobile) body.classList.add('mobile-device');
  if (device.isTablet) body.classList.add('tablet-device');
  if (device.isDesktop) body.classList.add('desktop-device');
  
  // Add browser classes
  if (device.isSafari) body.classList.add('safari-browser');
  if (device.isChrome) body.classList.add('chrome-browser');
  if (device.isFirefox) body.classList.add('firefox-browser');
  if (device.isEdge) body.classList.add('edge-browser');
  
  // Add touch capability
  if (device.touchEnabled) body.classList.add('touch-enabled');
}

/**
 * iOS-specific optimizations
 */
export function applyIOSOptimizations(): void {
  const device = getDeviceInfo();
  if (!device.isIOS) return;
  
  // Prevent zoom on form inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (input instanceof HTMLElement) {
      input.style.fontSize = '16px';
    }
  });
  
  // Handle viewport height for iOS Safari address bar
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
  });
  
  // Improve scrolling performance
  (document.body.style as any).webkitOverflowScrolling = 'touch';
}

/**
 * Android-specific optimizations
 */
export function applyAndroidOptimizations(): void {
  const device = getDeviceInfo();
  if (!device.isAndroid) return;
  
  // Improve font rendering
  (document.body.style as any).webkitFontSmoothing = 'antialiased';
  document.body.style.textRendering = 'optimizeLegibility';
  
  // Optimize viewport for Android
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, minimal-ui=false'
    );
  }
}

/**
 * Safari-specific optimizations
 */
export function applySafariOptimizations(): void {
  const device = getDeviceInfo();
  if (!device.isSafari) return;
  
  // Prevent unwanted behavior
  (document.body.style as any).webkitTouchCallout = 'none';
  (document.body.style as any).webkitUserSelect = 'none';

  // Allow text selection for inputs
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    if (input instanceof HTMLElement) {
      (input.style as any).webkitUserSelect = 'text';
    }
  });
}

/**
 * Chrome-specific optimizations
 */
export function applyChromeOptimizations(): void {
  const device = getDeviceInfo();
  if (!device.isChrome) return;
  
  // Chrome-specific performance optimizations
  document.body.style.willChange = 'transform';
}

/**
 * Cross-browser performance optimizations
 */
export function applyPerformanceOptimizations(): void {
  // Preload critical resources
  const criticalImages = [
    '/favicon.png',
    '/lovable-uploads/b53d5fbe-9869-4eff-8493-4d7c4ff0be2d.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  // Optimize scrolling performance
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Enable hardware acceleration
  document.body.style.transform = 'translateZ(0)';
}

/**
 * Initialize all cross-browser optimizations
 */
export function initializeCrossBrowserOptimizations(): void {
  try {
    // Apply device detection and classes
    applyDeviceClasses();
    
    // Apply device-specific optimizations
    applyIOSOptimizations();
    applyAndroidOptimizations();
    applySafariOptimizations();
    applyChromeOptimizations();
    
    // Apply general performance optimizations
    applyPerformanceOptimizations();
    
    console.log('✅ Cross-browser optimizations initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing cross-browser optimizations:', error);
  }
}

/**
 * Handle responsive breakpoint changes
 */
export function handleResponsiveChanges(): void {
  let resizeTimeout: NodeJS.Timeout;
  
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      applyDeviceClasses();
    }, 100);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
  });
}

/**
 * Fix common cross-browser compatibility issues
 */
export function fixCompatibilityIssues(): void {
  // Fix IE/Edge issues
  if (!CSS.supports || !CSS.supports('display', 'flex')) {
    console.warn('Browser does not support modern CSS features');
  }
  
  // Polyfill for older browsers
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported, consider loading polyfill');
  }
  
  // Fix viewport units for older browsers
  if (!CSS.supports('height', '100dvh')) {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
}