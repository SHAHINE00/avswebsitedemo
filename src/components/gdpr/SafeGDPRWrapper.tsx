
import React from 'react';

interface SafeGDPRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SafeGDPRWrapper: React.FC<SafeGDPRWrapperProps> = ({ children, fallback }) => {
  // Enhanced React validation with better error handling
  if (typeof React === 'undefined' || React === null) {
    console.warn('SafeGDPRWrapper: React is not available');
    return fallback || null;
  }

  // Validate React hooks are available
  if (!React.useState || !React.useEffect || !React.useContext) {
    console.warn('SafeGDPRWrapper: React hooks not available');
    return fallback || null;
  }

  // Validate browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('SafeGDPRWrapper: Browser environment not available');
    return fallback || null;
  }

  let isReactReady, setIsReactReady;
  let hasError, setHasError;

  try {
    [isReactReady, setIsReactReady] = React.useState(false);
    [hasError, setHasError] = React.useState(false);
  } catch (error) {
    console.error('SafeGDPRWrapper: useState failed:', error);
    return fallback || (
      <div className="hidden">
        {/* GDPR component failed to load */}
      </div>
    );
  }

  React.useEffect(() => {
    try {
      // Double-check everything is still available
      if (React && React.useState && React.useEffect && typeof window !== 'undefined' && window.localStorage) {
        setIsReactReady(true);
      } else {
        console.warn('GDPR components: React or localStorage not available in effect');
        setHasError(true);
      }
    } catch (error) {
      console.error('SafeGDPRWrapper initialization error:', error);
      setHasError(true);
    }
  }, []);

  // Error boundary-like behavior
  if (hasError) {
    return fallback || (
      <div className="hidden">
        {/* GDPR component failed to load */}
      </div>
    );
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
