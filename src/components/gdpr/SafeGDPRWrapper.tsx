import React from 'react';

interface SafeGDPRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SafeGDPRWrapper: React.FC<SafeGDPRWrapperProps> = ({ children, fallback }) => {
  const [isReactReady, setIsReactReady] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    try {
      // Validate React and localStorage are available
      if (React && React.useState && React.useEffect && typeof window !== 'undefined' && window.localStorage) {
        setIsReactReady(true);
      } else {
        console.warn('GDPR components: React or localStorage not available');
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