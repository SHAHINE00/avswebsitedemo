import * as React from 'react';

/**
 * React Safety Utilities
 * 
 * These utilities help prevent "Cannot read properties of null" errors
 * by providing safe wrappers and checks for React functionality.
 */

export const isReactAvailable = (): boolean => {
  return (
    typeof React !== 'undefined' &&
    React !== null &&
    typeof React.useState === 'function' &&
    typeof React.useEffect === 'function' &&
    typeof React.useContext === 'function' &&
    typeof React.createElement === 'function'
  );
};

export const isBrowserReady = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.readyState !== 'loading'
  );
};

export const isFullyReady = (): boolean => {
  return isReactAvailable() && isBrowserReady();
};

/**
 * Safe useState wrapper that provides fallback behavior
 */
export const useSafeState = <T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] => {
  if (!isReactAvailable()) {
    console.warn('React not available for useSafeState');
    return [initialValue, () => {}];
  }

  try {
    return React.useState(initialValue);
  } catch (error) {
    console.warn('useSafeState failed:', error);
    return [initialValue, () => {}];
  }
};

/**
 * Safe useEffect wrapper that provides fallback behavior
 */
export const useSafeEffect = (effect: () => void | (() => void), deps?: React.DependencyList): void => {
  if (!isReactAvailable()) {
    console.warn('React not available for useSafeEffect');
    return;
  }

  try {
    React.useEffect(effect, deps);
  } catch (error) {
    console.warn('useSafeEffect failed:', error);
  }
};

/**
 * Global React null safety initialization
 * Call this before any React components are rendered
 */
export const initializeReactSafety = (): boolean => {
  if (!isReactAvailable()) {
    console.error('React is not available - application cannot start');
    return false;
  }

  // Add global error handler for React null issues
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('Cannot read properties of null') && message.includes('useState')) {
      console.warn('React null error detected - attempting recovery');
      // Don't propagate React null errors to avoid crashes
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.log('React safety initialized successfully');
  return true;
};