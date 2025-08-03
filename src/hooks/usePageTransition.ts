import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    // Determine direction based on route hierarchy
    const currentPath = location.pathname;
    const routeHierarchy = ['/', '/curriculum', '/about', '/contact', '/blog'];
    const currentIndex = routeHierarchy.indexOf(currentPath);
    const prevIndex = routeHierarchy.indexOf(sessionStorage.getItem('prevRoute') || '/');
    
    setDirection(currentIndex > prevIndex ? 'forward' : 'backward');
    
    // Store current route for next transition
    sessionStorage.setItem('prevRoute', currentPath);
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  return {
    isTransitioning,
    direction,
    transitionClasses: isTransitioning 
      ? direction === 'forward' 
        ? 'animate-slide-in-right' 
        : 'animate-slide-in-left'
      : 'animate-fade-in'
  };
}