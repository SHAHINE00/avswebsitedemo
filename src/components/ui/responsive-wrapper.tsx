import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileClass?: string;
  tabletClass?: string;
  desktopClass?: string;
  as?: keyof JSX.IntrinsicElements;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className,
  mobileClass = '',
  tabletClass = '',
  desktopClass = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={cn(
        // Base responsive container
        'w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12',
        // Mobile-specific styles
        mobileClass && `mobile:${mobileClass}`,
        // Tablet-specific styles  
        tabletClass && `tablet:${tabletClass}`,
        // Desktop-specific styles
        desktopClass && `desktop:${desktopClass}`,
        // Custom additional classes
        className
      )}
    >
      {children}
    </Component>
  );
};

export default ResponsiveWrapper;