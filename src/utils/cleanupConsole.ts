// Console cleanup utility for production builds
// This script identifies remaining console statements that need to be removed

import { ENV_CONFIG } from './envConfig';

// Override console methods in production
export const setupProductionConsole = () => {
  if (!ENV_CONFIG.features.enableConsoleLogging && ENV_CONFIG.isProduction) {
    // Store original console methods for critical errors
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Override console methods
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.trace = () => {};
    console.table = () => {};
    console.group = () => {};
    console.groupEnd = () => {};
    console.groupCollapsed = () => {};
    
    // Keep error and warn for critical issues, but filter them
    console.error = (...args) => {
      // Only log actual errors, not dev messages
      if (args[0] instanceof Error || (typeof args[0] === 'string' && args[0].includes('Error'))) {
        originalError.apply(console, args);
      }
    };
    
    console.warn = (...args) => {
      // Only log performance and security warnings
      if (typeof args[0] === 'string' && 
          (args[0].includes('Performance') || args[0].includes('Security') || args[0].includes('Warning'))) {
        originalWarn.apply(console, args);
      }
    };
  }
};

// Call this early in the application lifecycle
export const initializeProductionLogging = () => {
  setupProductionConsole();
  
  // Set up global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      // Log critical errors even in production
      console.error('Global Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      // Log unhandled promise rejections
      console.error('Unhandled Promise Rejection:', event.reason);
    });
  }
};
