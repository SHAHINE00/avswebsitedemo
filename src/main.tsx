import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeProductionLogging } from '@/utils/cleanupConsole'
import { logError, logInfo } from '@/utils/logger'
import { optimizeForMobile, isMobileDevice } from '@/utils/mobile'

// Initialize production monitoring and logging
initializeProductionLogging();

// Initialize mobile optimizations
optimizeForMobile();

// Debug mobile session in development
if (process.env.NODE_ENV === 'development') {
  import('@/utils/mobile-testing').then(({ debugMobileSession }) => {
    debugMobileSession();
  });
}

// Service Worker is now registered in optimizeForMobile() for all devices
// This ensures better reliability and universal PWA support

// Global async error handler with mobile-specific handling
window.addEventListener('unhandledrejection', (event) => {
  const errorInfo = {
    reason: event.reason,
    isMobile: isMobileDevice(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  logError('Unhandled Promise Rejection:', errorInfo);
  
  // For mobile, try to handle chunk loading errors gracefully
  if (event.reason && typeof event.reason === 'object' && 
      (event.reason as any).message && 
      ((event.reason as any).message.includes('Loading chunk') || 
       (event.reason as any).message.includes('Failed to fetch dynamically imported module'))) {
    
    logError('Mobile chunk loading error detected, attempting recovery');
    event.preventDefault();
    
    // Clear caches and reload after a short delay
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
    }, 1000);
  } else {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
