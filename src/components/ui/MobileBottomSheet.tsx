import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { useTouchFeedback } from '@/hooks/useTouchFeedback';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: 'auto' | 'half' | 'full';
  className?: string;
  showHandle?: boolean;
  swipeToClose?: boolean;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  className,
  showHandle = true,
  swipeToClose = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonFeedback = useTouchFeedback({ intensity: 'medium' });

  // Handle swipe down to close
  const swipeRef = useSwipeGestures({
    onSwipeDown: swipeToClose ? onClose : undefined,
    threshold: 100
  }) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const heightClasses = {
    auto: 'max-h-[90vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]'
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={swipeRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          "border-t border-border",
          heightClasses[height],
          isOpen ? "translate-y-0" : "translate-y-full",
          className
        )}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <button
              {...closeButtonFeedback.touchHandlers}
              onClick={onClose}
              className={cn(
                "p-2 rounded-full hover:bg-muted transition-colors",
                closeButtonFeedback.pressedClasses
              )}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Hook for managing bottom sheet state
export function useBottomSheet(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
    bottomSheetProps: {
      isOpen,
      onClose: close
    }
  };
}