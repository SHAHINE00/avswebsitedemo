import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isDropdownOpen = useRef(false);

  useEffect(() => {
    // Listen for dropdown state changes
    const handleDropdownState = (event: CustomEvent) => {
      isDropdownOpen.current = event.detail.isOpen;
    };

    // Add event listeners for dropdown state changes
    document.addEventListener('dropdown-state-change', handleDropdownState as EventListener);

    return () => {
      document.removeEventListener('dropdown-state-change', handleDropdownState as EventListener);
    };
  }, []);

  useEffect(() => {
    // Only scroll to top if no dropdown is open
    if (!isDropdownOpen.current) {
      // Use requestAnimationFrame to ensure smooth scrolling without interference
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;