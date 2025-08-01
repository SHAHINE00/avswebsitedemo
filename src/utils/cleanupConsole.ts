// Console cleanup utility for production builds
// This script identifies remaining console statements that need to be removed

import { ENV_CONFIG } from './envConfig';

// Override console methods in production - mobile safe
export const setupProductionConsole = () => {
  if (typeof window === 'undefined' || typeof console === 'undefined') {
    return; // Exit early if not in browser or console not available
  }
  
  try {
    if (!ENV_CONFIG.features.enableConsoleLogging && ENV_CONFIG.isProduction) {
      // Store original console methods for critical errors - with null checks
      const originalError = console.error && console.error.bind ? console.error.bind(console) : () => {};
      const originalWarn = console.warn && console.warn.bind ? console.warn.bind(console) : () => {};
      
      // Override console methods safely
      if (console.log) console.log = () => {};
      if (console.info) console.info = () => {};
      if (console.debug) console.debug = () => {};
      if (console.trace) console.trace = () => {};
      if (console.table) console.table = () => {};
      if (console.group) console.group = () => {};
      if (console.groupEnd) console.groupEnd = () => {};
      if (console.groupCollapsed) console.groupCollapsed = () => {};
      
      // Keep error and warn for critical issues, but filter them
      if (console.error) {
        console.error = (...args) => {
          try {
            // Only log actual errors, not dev messages
            if (args[0] instanceof Error || (typeof args[0] === 'string' && args[0].includes('Error'))) {
              originalError(...args);
            }
          } catch (e) {
            // Fallback if console methods fail on mobile
            originalError('Console error failed:', e);
          }
        };
      }
      
      if (console.warn) {
        console.warn = (...args) => {
          try {
            // Only log performance and security warnings
            if (typeof args[0] === 'string' && 
                (args[0].includes('Performance') || args[0].includes('Security') || args[0].includes('Warning'))) {
              originalWarn(...args);
            }
          } catch (e) {
            // Fallback if console methods fail on mobile
            originalError('Console warn failed:', e);
          }
        };
      }
    }
  } catch (error) {
    // If console setup fails completely, fail silently
    // This prevents mobile browser crashes
  }
};

// Call this early in the application lifecycle - mobile safe
export const initializeProductionLogging = () => {
  setupProductionConsole();
  
  // Set up global error handler - mobile safe
  if (typeof window !== 'undefined') {
    try {
      window.addEventListener('error', (event) => {
        try {
          // Log critical errors even in production
          if (console && console.error) {
            console.error('Global Error:', {
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              error: event.error
            });
          }
        } catch (e) {
          // Silent fail to prevent secondary errors
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        try {
          // Log unhandled promise rejections
          if (console && console.error) {
            console.error('Unhandled Promise Rejection:', event.reason);
          }
          // Prevent mobile browser default error handling
          event.preventDefault();
        } catch (e) {
          // Silent fail to prevent secondary errors
        }
      });
    } catch (error) {
      // If event listeners fail, fail silently
    }
  }
};
