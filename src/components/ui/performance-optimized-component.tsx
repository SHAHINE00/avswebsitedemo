import React, { memo, useCallback, useMemo } from 'react';

// Performance-optimized wrapper for heavy components to prevent unnecessary re-renders during tab switches
interface PerformanceOptimizedComponentProps {
  children: React.ReactNode;
  dependencies?: any[];
  skipMemoization?: boolean;
}

// Memoized component wrapper to prevent re-renders during tab switches
export const PerformanceOptimizedComponent = memo<PerformanceOptimizedComponentProps>(
  ({ children, dependencies = [], skipMemoization = false }) => {
    // Optimize re-renders based on dependencies
    const optimizedChildren = useMemo(() => {
      if (skipMemoization) return children;
      return children;
    }, dependencies);

    // Handle tab switch events without causing re-renders
    const handleTabSwitch = useCallback(() => {
      // Tab switch detected - maintain component state
      console.log('Tab switch in performance component - maintaining state');
    }, []);

    React.useEffect(() => {
      const handleVisibility = () => {
        if (!document.hidden) {
          handleTabSwitch();
        }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [handleTabSwitch]);

    return <>{optimizedChildren}</>;
  },
  // Custom comparison function for memo
  (prevProps, nextProps) => {
    // Always re-render if skipMemoization is true
    if (nextProps.skipMemoization) return false;
    
    // Compare dependencies arrays
    if (prevProps.dependencies?.length !== nextProps.dependencies?.length) {
      return false;
    }
    
    // Shallow comparison of dependencies
    return prevProps.dependencies?.every((dep, index) => 
      dep === nextProps.dependencies?.[index]
    ) ?? true;
  }
);

PerformanceOptimizedComponent.displayName = 'PerformanceOptimizedComponent';