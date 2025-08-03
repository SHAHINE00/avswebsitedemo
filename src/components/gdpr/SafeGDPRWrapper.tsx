
import React from 'react';

interface SafeGDPRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SafeGDPRWrapper: React.FC<SafeGDPRWrapperProps> = ({ children, fallback }) => {
  // Early return if React is not available - don't use any hooks
  if (typeof React === 'undefined' || React === null || !React.useState) {
    return fallback || null;
  }

  // Validate browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback || null;
  }

  let isReactReady, setIsReactReady;
  let hasError, setHasError;

  try {
    [isReactReady, setIsReactReady] = React.useState(false);
    [hasError, setHasError] = React.useState(false);
  } catch (error) {
    console.error('SafeGDPRWrapper: useState failed:', error);
    return fallback || null;
  }

  React.useEffect(() => {
    try {
      // Double-check everything is still available
      if (React && React.useState && React.useEffect && typeof window !== 'undefined' && window.localStorage) {
        setIsReactReady(true);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('SafeGDPRWrapper initialization error:', error);
      setHasError(true);
    }
  }, []);

  // Error boundary-like behavior
  if (hasError) {
    return fallback || null;
  }

  if (!isReactReady) {
    return null;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('GDPR component render error:', error);
    return fallback || null;
  }
};

export default SafeGDPRWrapper;
