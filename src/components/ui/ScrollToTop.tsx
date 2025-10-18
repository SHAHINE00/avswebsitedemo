
import { useRef } from 'react';
import { useSafeEffect } from '@/utils/safeHooks';
import { useSafeLocation } from '@/utils/safeHooks';

const ScrollToTop = () => {
  const location = useSafeLocation();
  const { pathname } = location;
  const isDropdownOpen = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const DISABLED_SCROLL_ROUTES = ['/professor'];

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
    // Skip on initial mount and disable on specific routes
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    if (DISABLED_SCROLL_ROUTES.includes(pathname)) {
      return;
    }

    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Only scroll to top if no dropdown is open and user hasn't already scrolled
    scrollTimeout.current = setTimeout(() => {
      const userHasScrolled = window.scrollY > 8;
      if (!isDropdownOpen.current && !userHasScrolled) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }, 80);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
