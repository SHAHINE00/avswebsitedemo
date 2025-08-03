
import React from 'react';
import SafeComponentWrapper from '@/components/ui/SafeComponentWrapper';

interface SafeGDPRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SafeGDPRWrapper: React.FC<SafeGDPRWrapperProps> = ({ children, fallback }) => {
  return (
    <SafeComponentWrapper
      componentName="SafeGDPRWrapper"
      fallback={fallback}
    >
      {children}
    </SafeComponentWrapper>
  );
};

export default SafeGDPRWrapper;
