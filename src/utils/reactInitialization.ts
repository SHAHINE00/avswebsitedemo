/**
 * React Initialization and Safety Utilities
 * 
 * This module provides centralized React safety checks and initialization
 * to prevent "Cannot read properties of null" errors throughout the app.
 */

import * as React from 'react';

// Global React state tracking
let isReactFullyInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Comprehensive React availability check
 */
export const isReactAvailable = (): boolean => {
  return (
    typeof React !== 'undefined' &&
    React !== null &&
    typeof React.useState === 'function' &&
    typeof React.useEffect === 'function' &&
    typeof React.useContext === 'function' &&
    typeof React.createElement === 'function' &&
    typeof React.Component === 'function' &&
    typeof React.Suspense === 'function'
  );
};

/**
 * Check if browser environment is ready
 */
export const isBrowserReady = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.readyState !== 'loading'
  );
};

/**
 * Initialize React safety system
 */
export const initializeReactSafety = (): Promise<boolean> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise((resolve) => {
    const checkReactReady = () => {
      if (isReactAvailable() && isBrowserReady()) {
        isReactFullyInitialized = true;
        console.log('React fully initialized and ready');
        resolve(true);
        return;
      }

      // Keep checking until React is ready
      setTimeout(checkReactReady, 10);
    };

    checkReactReady();
  });

  return initializationPromise;
};

/**
 * Get React readiness status synchronously
 */
export const getReactReadiness = (): boolean => {
  return isReactFullyInitialized;
};

/**
 * Wait for React to be ready before executing callback
 */
export const whenReactReady = (callback: () => void): void => {
  if (isReactFullyInitialized) {
    callback();
    return;
  }

  initializeReactSafety().then(() => {
    callback();
  });
};
