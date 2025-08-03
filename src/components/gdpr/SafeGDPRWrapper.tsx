
import React from 'react';

interface SafeGDPRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SafeGDPRWrapper: React.FC<SafeGDPRWrapperProps> = ({ children, fallback }) => {
  return <>{children}</>;
};

export default SafeGDPRWrapper;
