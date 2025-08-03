import { useEffect, useRef, useState, useCallback } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    enabled = true
  } = options;

  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const containerRef = useRef<HTMLElement>(null);
  const startYRef = useRef<number>(0);
  const pullStarted = useRef<boolean>(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [onRefresh, isRefreshing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop > 0) return;
      
      startYRef.current = e.touches[0].clientY;
      pullStarted.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (container.scrollTop > 0 || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startYRef.current;

      if (deltaY > 0) {
        if (!pullStarted.current) {
          pullStarted.current = true;
          setIsPulling(true);
        }

        const distance = Math.min(deltaY / resistance, threshold * 1.5);
        setPullDistance(distance);

        // Add some resistance
        if (deltaY > threshold) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!pullStarted.current || isRefreshing) return;

      if (pullDistance >= threshold) {
        handleRefresh();
      } else {
        setIsPulling(false);
        setPullDistance(0);
      }

      pullStarted.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, resistance, pullDistance, isRefreshing, handleRefresh]);

  const shouldTrigger = pullDistance >= threshold;
  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldTrigger,
    progress,
    containerStyle: {
      transform: isPulling ? `translateY(${Math.min(pullDistance, threshold)}px)` : 'translateY(0)',
      transition: isPulling ? 'none' : 'transform 0.3s ease'
    }
  };
}