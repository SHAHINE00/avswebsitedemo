
import { useRef } from 'react';
import { useSafeEffect } from '@/utils/safeHooks';
import { useSafeLocation } from '@/utils/safeHooks';

const ScrollToTop = () => {
  const location = useSafeLocation();
  const { pathname } = location;
  const isDropdownOpen = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useSafeEffect(() => {
    // Listen for dropdown state changes
    const handleDropdownState = (event: CustomEvent) => {
      isDropdownOpen.current = event.detail.isOpen;
      
      // Clear any pending scroll timeout when dropdown state changes
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = null;
      }
    };

    // Add event listeners for dropdown state changes
    document.addEventListener('dropdown-state-change', handleDropdownState as EventListener);

    return () => {
      document.removeEventListener('dropdown-state-change', handleDropdownState as EventListener);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useSafeEffect(() => {
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Only scroll to top if no dropdown is open, with a small delay to ensure dropdown state is stable
    scrollTimeout.current = setTimeout(() => {
      if (!isDropdownOpen.current) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }, 50);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
