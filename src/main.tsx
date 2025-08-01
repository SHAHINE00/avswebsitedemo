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

// Register service worker for mobile optimization
if ('serviceWorker' in navigator && isMobileDevice()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logInfo('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        logError('Service Worker registration failed:', error);
      });
  });
}

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
