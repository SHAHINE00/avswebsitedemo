import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return {
    elementRef,
    isVisible,
    animationClasses: isVisible ? 'animate-fade-in opacity-100' : 'opacity-0',
    slideUpClasses: isVisible ? 'animate-slide-up opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
    scaleClasses: isVisible ? 'animate-scale-in opacity-100 scale-100' : 'opacity-0 scale-95'
  };
}

// Specialized hook for staggered animations
export function useStaggeredAnimation(itemCount: number, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger staggered animation
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]));
            }, i * delay);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [itemCount, delay]);

  const getItemClasses = (index: number) => {
    return visibleItems.has(index) 
      ? 'animate-fade-in opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-4';
  };

  return {
    containerRef,
    getItemClasses,
    isItemVisible: (index: number) => visibleItems.has(index)
  };
}