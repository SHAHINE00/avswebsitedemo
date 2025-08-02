import { useEffect, useRef, useState } from 'react';
import { isIOS } from '@/utils/mobile';

interface IOSScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const IOSScrollWrapper = ({ children, className = '' }: IOSScrollWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  useEffect(() => {
    if (!isIOSDevice || !containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    let startY = 0;
    let startX = 0;
    let isVerticalScroll = false;
    let isScrolling = false;

    // iOS Safari specific touch handling
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isVerticalScroll = false;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling) {
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        
        // Determine scroll direction
        if (deltaY > deltaX) {
          isVerticalScroll = true;
        }
        isScrolling = true;
      }

      // Only handle vertical scrolling
      if (!isVerticalScroll) {
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      
      // Get scroll boundaries
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const containerHeight = container.clientHeight;
      
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop >= scrollHeight - containerHeight - 1;
      
      // Prevent overscroll at boundaries
      if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
      isVerticalScroll = false;
    };

    // Add iOS-specific scroll handling
    const handleScroll = (e: Event) => {
      e.stopPropagation();
      
      // Ensure scroll stays within bounds
      if (container.scrollTop < 0) {
        container.scrollTop = 0;
      }
    };

    // Add event listeners with proper options
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('scroll', handleScroll, { passive: false });

    // Prevent iOS Safari bounce
    const preventBounce = (e: TouchEvent) => {
      // Allow scrolling within our container
      let target = e.target as Element;
      while (target && target !== document.body) {
        if (target === container) {
          return; // Allow scrolling in our container
        }
        target = target.parentElement!;
      }
      
      // Prevent bouncing outside our container
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventBounce, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchmove', preventBounce);
    };
  }, [isIOSDevice]);

  if (!isIOSDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="ios-scroll-wrapper">
      <div
        ref={containerRef}
        className={`ios-scroll-container ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 'calc(var(--vh, 1vh) * 100)',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
          zIndex: 1,
        }}
      >
        <div ref={contentRef} className="ios-scroll-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default IOSScrollWrapper;