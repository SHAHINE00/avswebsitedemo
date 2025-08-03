import React from 'react';
import { isReactAvailable, getReactReadiness } from '@/utils/reactInitialization';

interface SafeComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
  requiresRouter?: boolean;
  requiresAuth?: boolean;
}

/**
 * Universal wrapper that ensures React is fully available before rendering children
 * Provides different fallbacks based on what's missing
 */
const SafeComponentWrapper: React.FC<SafeComponentWrapperProps> = ({ 
  children, 
  fallback = null,
  componentName = 'Component',
  requiresRouter = false,
  requiresAuth = false
}) => {
  // Early check - don't use any hooks if React isn't available
  if (!isReactAvailable()) {
    console.warn(`${componentName}: React not available`);
    return <>{fallback}</>;
  }

  let isReady, setIsReady;
  
  try {
    [isReady, setIsReady] = React.useState(getReactReadiness());
  } catch (error) {
    console.warn(`${componentName}: useState failed:`, error);
    return <>{fallback}</>;
  }

  React.useEffect(() => {
    try {
      // Additional checks for router and auth if required
      if (requiresRouter) {
        try {
          const { useLocation } = require('react-router-dom');
          useLocation(); // Test if router context is available
        } catch (error) {
          console.warn(`${componentName}: Router context not available`);
          return;
        }
      }

      if (requiresAuth) {
        try {
          const { useAuth } = require('@/contexts/AuthContext');
          useAuth(); // Test if auth context is available
        } catch (error) {
          console.warn(`${componentName}: Auth context not available`);
          return;
        }
      }

      setIsReady(true);
    } catch (error) {
      console.warn(`${componentName}: Effect failed:`, error);
    }
  }, [requiresRouter, requiresAuth]);

  if (!isReady) {
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