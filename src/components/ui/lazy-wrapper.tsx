// Lazy loading wrapper component for better performance
import React, { Suspense } from 'react';
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
  console.log('iOS Debug: LazyWrapper rendering');
  
  React.useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      console.log('iOS Debug: LazyWrapper mounted on iOS');
    }
  }, []);

  return (
    <Suspense 
      fallback={
        <>
          {console.log('iOS Debug: Suspense fallback triggered')}
          {fallback}
        </>
      }
    >
      {children}
    </Suspense>
  );
};