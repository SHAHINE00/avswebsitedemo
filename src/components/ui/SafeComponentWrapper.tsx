import React from 'react';

interface SafeComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

/**
 * Simplified wrapper that provides basic React error handling
 * Removed initialization dependency to fix navigation bar rendering
 */
const SafeComponentWrapper: React.FC<SafeComponentWrapperProps> = ({ 
  children, 
  fallback = null,
  componentName = 'Component'
}) => {
  // Basic React availability check
  if (!React || !React.useState || !React.useEffect) {
    console.warn(`${componentName}: React hooks not available`);
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`${componentName}: Render error:`, error);
    return <>{fallback}</>;
  }
};

export default SafeComponentWrapper;