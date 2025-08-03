
// Lazy loading wrapper component for better performance
import React, { Suspense, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('iOS Debug: LazyWrapper rendering');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        console.log('iOS Debug: LazyWrapper mounted on iOS');
      }
    }
  }, []);

  return (
    <Suspense 
      fallback={
        <>
          {process.env.NODE_ENV === 'development' && console.log('iOS Debug: Suspense fallback triggered')}
          {fallback}
        </>
      }
    >
      {children}
    </Suspense>
  );
};
