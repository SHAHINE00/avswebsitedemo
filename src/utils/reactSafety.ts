import React from 'react';

// React Safety Utils - Prevents "Cannot read properties of null" errors
export const withReactSafety = <T extends Record<string, any>>(hooks: T): T => {
  const safeHooks = {} as T;
  
  for (const [key, hook] of Object.entries(hooks)) {
    if (typeof hook === 'function') {
      safeHooks[key as keyof T] = ((...args: any[]) => {
        // Check if React is available
        if (!React || typeof React !== 'object') {
          console.warn(`React is not available for hook: ${key}`);
          return undefined;
        }
        
        try {
          return hook(...args);
        } catch (error) {
          console.error(`Error in hook ${key}:`, error);
          return undefined;
        }
      }) as T[keyof T];
    } else {
      safeHooks[key as keyof T] = hook;
    }
  }
  
  return safeHooks;
};

// Safe React hooks with null checks
export const safeReact = {
  useState: (...args: Parameters<typeof React.useState>) => {
    if (!React?.useState) {
      console.warn('React.useState not available, returning fallback');
      return [undefined, () => {}] as const;
    }
    return React.useState(...args);
  },
  
  useEffect: (...args: Parameters<typeof React.useEffect>) => {
    if (!React?.useEffect) {
      console.warn('React.useEffect not available');
      return;
    }
    return React.useEffect(...args);
  },
  
  useContext: (...args: Parameters<typeof React.useContext>) => {
    if (!React?.useContext) {
      console.warn('React.useContext not available, returning undefined');
      return undefined;
    }
    return React.useContext(...args);
  },
  
  useRef: (...args: Parameters<typeof React.useRef>) => {
    if (!React?.useRef) {
      console.warn('React.useRef not available, returning fallback');
      return { current: undefined };
    }
    return React.useRef(...args);
  },
  
  useCallback: (...args: Parameters<typeof React.useCallback>) => {
    if (!React?.useCallback) {
      console.warn('React.useCallback not available, returning function directly');
      return args[0];
    }
    return React.useCallback(...args);
  },
  
  useMemo: (...args: Parameters<typeof React.useMemo>) => {
    if (!React?.useMemo) {
      console.warn('React.useMemo not available, returning computed value');
      return args[0]();
    }
    return React.useMemo(...args);
  }
};

// React availability checker
export const isReactAvailable = (): boolean => {
  return !!(React && typeof React === 'object' && React.useState);
};