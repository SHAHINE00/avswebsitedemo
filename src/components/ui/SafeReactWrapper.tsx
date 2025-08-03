import React from 'react';

interface SafeReactWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

/**
 * A wrapper component that safely renders children only when React is available
 * and properly initialized. This prevents "Cannot read properties of null" errors.
 */
const SafeReactWrapper: React.FC<SafeReactWrapperProps> = ({ 
  children, 
  fallback = null,
  componentName = 'Component'
}) => {
  // Check if React is available and properly initialized
  if (!React || React === null) {
    console.warn(`${componentName}: React is not available`);
    return <>{fallback}</>;
  }

  // Check if essential React hooks are available
  if (!React.useState || !React.useEffect || !React.useContext) {
    console.warn(`${componentName}: React hooks are not available`);
    return <>{fallback}</>;
  }

  // Check if we're in a proper browser environment
  if (typeof window === 'undefined') {
    console.warn(`${componentName}: Not in browser environment`);
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`${componentName}: Error rendering:`, error);
    return <>{fallback}</>;
  }
};

export default SafeReactWrapper;