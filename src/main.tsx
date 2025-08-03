
import React from 'react';
import { createRoot } from 'react-dom/client';

// Enhanced React validation check
if (!React || React === null) {
  throw new Error('React is null or undefined - critical loading issue');
}
if (!React.useState || !React.useEffect || !React.useContext) {
  throw new Error('React hooks are not available - import issue detected');
}

// Initialize React safety utilities
import { initializeReactSafety } from '@/utils/reactSafety';
if (!initializeReactSafety()) {
  throw new Error('React safety initialization failed');
}

console.log('React and hooks validated successfully in main.tsx');

import App from './App.tsx';
import './index.css';
import { initializeProductionLogging } from '@/utils/cleanupConsole';
import { logError, logInfo } from '@/utils/logger';
import { isMobileDevice, isIOS } from '@/utils/mobile';
import { mountIOSFallbackLoader } from '@/components/ui/ios-fallback-loader';
import { initMobileFix } from '@/utils/mobile-cache-clear';
import { initializeResourcePreloading } from '@/utils/resourcePreloader';
import { initializeCrossBrowserOptimizations, handleResponsiveChanges, fixCompatibilityIssues } from '@/utils/cross-browser-optimization';

// Initialize performance optimizations
initializeProductionLogging();
initializeResourcePreloading();

// Initialize comprehensive cross-browser optimizations
initializeCrossBrowserOptimizations();
handleResponsiveChanges();
fixCompatibilityIssues();

// Production logging only shows errors
if (process.env.NODE_ENV === 'development') {
  console.log('iOS Debug: Starting app initialization');
  console.log('iOS Debug: User Agent:', navigator.userAgent);
  console.log('iOS Debug: Is iOS?', /iPad|iPhone|iPod/.test(navigator.userAgent));
}

// Initialize mobile fix for download issues
initMobileFix();

if (process.env.NODE_ENV === 'development') {
  console.log('iOS Debug: Mobile optimizations complete');
}

// Debug mobile session in development
if (process.env.NODE_ENV === 'development') {
  import('@/utils/mobile-testing').then(({ debugMobileSession }) => {
    debugMobileSession();
  });
}

// Service Worker is now registered in optimizeForMobile() for all devices
// This ensures better reliability and universal PWA support

// Enhanced global error handler with iOS-specific handling
window.addEventListener('unhandledrejection', (event) => {
  const errorInfo = {
    reason: event.reason,
    isMobile: isMobileDevice(),
    isIOS: isIOS(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  logError('Unhandled Promise Rejection:', errorInfo);
  
  // Handle chunk loading errors with iOS-specific recovery
  if (event.reason && typeof event.reason === 'object' && 
      (event.reason as any).message && 
      ((event.reason as any).message.includes('Loading chunk') || 
       (event.reason as any).message.includes('Failed to fetch dynamically imported module') ||
       (event.reason as any).message.includes('Loading CSS chunk'))) {
    
    logError('Chunk loading error detected, attempting recovery');
    event.preventDefault();
    
    // Show iOS-specific fallback loader
    if (isIOS()) {
      mountIOSFallbackLoader('Module loading failed');
    }
    
    // Clear caches and reload with iOS-specific timing
    const delay = isIOS() ? 2000 : 1000; // iOS needs more time
    setTimeout(() => {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => caches.delete(name));
        }).finally(() => {
          (window as any).location.reload();
        });
      } else {
        (window as any).location.reload();
      }
    }, delay);
  } else {
    event.preventDefault();
  }
});

// iOS-specific error handling for module loading
if (isIOS()) {
  window.addEventListener('error', (event) => {
    if (event.message && (
        event.message.includes('Loading chunk') ||
        event.message.includes('module') ||
        event.message.includes('import')
      )) {
      logError('iOS module loading error:', event.message);
      mountIOSFallbackLoader('iOS loading error');
    }
  });
  
  // iOS memory warning handler
  const checkIOSMemory = () => {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / memory.totalJSHeapSize;
      if (usage > 0.85) {
        logError('iOS memory usage high:', usage);
        // Clear caches proactively
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
      }
    }
  };
  
  // Check memory every 60 seconds on iOS
  setInterval(checkIOSMemory, 60000);
}

createRoot(document.getElementById("root")!).render(<App />);
