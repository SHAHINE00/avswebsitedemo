import * as React from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-in' | 'scale' | 'stagger';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  staggerCount?: number;
  staggerDelay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  staggerCount = 0,
  staggerDelay = 100
}) => {
  const { getAnimationClasses } = useAccessibility();
  const scrollAnimation = useScrollAnimation({ threshold, triggerOnce, delay });
  const staggerAnimation = useStaggeredAnimation(staggerCount, staggerDelay);

  // Choose animation based on type
  const getAnimationStyles = () => {
    switch (animation) {
      case 'slide-up':
        return scrollAnimation.slideUpClasses;
      case 'scale':
        return scrollAnimation.scaleClasses;
      case 'slide-in':
        return scrollAnimation.isVisible 
          ? 'animate-slide-in-right opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-4';
      default:
        return scrollAnimation.animationClasses;
    }
  };

  if (animation === 'stagger' && staggerCount > 0) {
    return (
      <div
        ref={staggerAnimation.containerRef as React.RefObject<HTMLDivElement>}
        className={cn('space-y-4', className)}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className={cn(
              'transition-all duration-500',
              getAnimationClasses(staggerAnimation.getItemClasses(index))
            )}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scrollAnimation.elementRef as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-all duration-500',
        getAnimationClasses(getAnimationStyles()),
        className
      )}
    >
      {children}
    </div>
  );
};

// Higher-order component for automatic animation wrapping
export const withAnimation = <P extends object>(
  Component: React.ComponentType<P>,
  animationProps?: Partial<AnimatedSectionProps>
) => {
  const WrappedComponent = (props: P) => (
    <AnimatedSection {...animationProps}>
      <Component {...props} />
    </AnimatedSection>
  );
  
  WrappedComponent.displayName = `withAnimation(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Pre-configured animated components
export const FadeInSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="fade" />
);

export const SlideUpSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="slide-up" />
);

export const ScaleInSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="scale" />
);

export const StaggerSection = (props: Omit<AnimatedSectionProps, 'animation'>) => (
  <AnimatedSection {...props} animation="stagger" />
);