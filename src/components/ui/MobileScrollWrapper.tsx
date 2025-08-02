import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MobileScrollWrapper = ({ children, className = '' }: MobileScrollWrapperProps) => {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    let startY = 0;
    let lastY = 0;
    let isScrolling = false;
    let velocity = 0;

    // Enhanced touch handling for mobile scrolling
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      lastY = startY;
      isScrolling = false;
      velocity = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastY - currentY;
      
      // Calculate velocity for momentum
      velocity = deltaY;
      lastY = currentY;
      
      // Check scroll bounds
      const scrollTop = wrapper.scrollTop;
      const scrollHeight = wrapper.scrollHeight;
      const clientHeight = wrapper.clientHeight;
      
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop >= scrollHeight - clientHeight - 1; // Add 1px tolerance
      
      // Prevent overscroll and bounce effect
      if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
        e.preventDefault();
        return;
      }
      
      // Allow normal scrolling
      isScrolling = true;
    };

    const handleTouchEnd = () => {
      // Add momentum scrolling for smoother experience
      if (Math.abs(velocity) > 5) {
        const momentum = velocity * 0.5;
        wrapper.scrollBy({
          top: momentum,
          behavior: 'smooth'
        });
      }
      
      isScrolling = false;
      velocity = 0;
    };

    // Enhanced scroll event handling
    const handleScroll = () => {
      // Prevent pull-to-refresh at top
      if (wrapper.scrollTop <= 0) {
        wrapper.scrollTop = 0;
      }
    };

    // Add event listeners
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
    wrapper.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={wrapperRef}
      className={`mobile-scroll-container prevent-overscroll ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        touchAction: 'pan-y',
      }}
    >
      {children}
    </div>
  );
};

export default MobileScrollWrapper;