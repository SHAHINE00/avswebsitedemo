import { useEffect, useRef, useState } from 'react';
import { isIOS, isMobileDevice } from '@/utils/mobile';

interface UnifiedMobileWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const UnifiedMobileWrapper = ({ children, className = '' }: UnifiedMobileWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    let startY = 0;
    let isScrolling = false;

    // Unified touch handling for all mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) {
        isScrolling = true;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const containerHeight = container.clientHeight;
      
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop >= scrollHeight - containerHeight - 1;
      
      // Prevent overscroll only at boundaries
      if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // iOS-specific body scroll prevention
    if (isIOSDevice) {
      const preventBodyScroll = (e: TouchEvent) => {
        if (!container.contains(e.target as Node)) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', preventBodyScroll, { passive: false });
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchmove', preventBodyScroll);
      };
    }

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, isIOSDevice]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`unified-mobile-wrapper ${className}`}
      style={{
        height: isIOSDevice ? 'calc(100dvh)' : '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
        position: 'relative',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default UnifiedMobileWrapper;