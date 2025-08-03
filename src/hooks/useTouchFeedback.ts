import { useCallback, useEffect, useState } from 'react';

interface TouchFeedbackOptions {
  haptic?: boolean;
  visual?: boolean;
  audio?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function useTouchFeedback(options: TouchFeedbackOptions = {}) {
  const {
    haptic = true,
    visual = true,
    audio = false,
    intensity = 'light'
  } = options;

  const [isPressed, setIsPressed] = useState(false);

  // Haptic feedback (iOS/Android)
  const triggerHaptic = useCallback(() => {
    if (!haptic) return;

    try {
      // iOS Haptic Feedback
      if ('navigator' in window && 'vibrate' in navigator) {
        const patterns = {
          light: [10],
          medium: [25],
          heavy: [50]
        };
        navigator.vibrate(patterns[intensity]);
      }

      // Modern browsers with Vibration API
      if ('Vibration' in window) {
        const durations = {
          light: 10,
          medium: 25,
          heavy: 50
        };
        (window as any).Vibration.vibrate(durations[intensity]);
      }
    } catch (error) {
      console.debug('Haptic feedback not supported:', error);
    }
  }, [haptic, intensity]);

  // Audio feedback
  const triggerAudio = useCallback(() => {
    if (!audio) return;

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.setValueAtTime(800, context.currentTime);
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    } catch (error) {
      console.debug('Audio feedback not supported:', error);
    }
  }, [audio]);

  // Combined feedback trigger
  const triggerFeedback = useCallback(() => {
    triggerHaptic();
    triggerAudio();
  }, [triggerHaptic, triggerAudio]);

  // Touch event handlers
  const onTouchStart = useCallback(() => {
    if (visual) setIsPressed(true);
    triggerFeedback();
  }, [visual, triggerFeedback]);

  const onTouchEnd = useCallback(() => {
    if (visual) setIsPressed(false);
  }, [visual]);

  // Mouse event handlers for desktop
  const onMouseDown = useCallback(() => {
    if (visual) setIsPressed(true);
  }, [visual]);

  const onMouseUp = useCallback(() => {
    if (visual) setIsPressed(false);
  }, [visual]);

  const onMouseLeave = useCallback(() => {
    if (visual) setIsPressed(false);
  }, [visual]);

  return {
    isPressed,
    triggerFeedback,
    touchHandlers: {
      onTouchStart,
      onTouchEnd,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
    },
    // CSS classes for visual feedback
    pressedClasses: isPressed ? 'scale-95 opacity-80' : '',
    // Inline styles for visual feedback
    pressedStyle: {
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      opacity: isPressed ? 0.8 : 1,
      transition: 'transform 0.1s ease, opacity 0.1s ease'
    }
  };
}

// Specialized hook for button feedback
export function useButtonFeedback(options: TouchFeedbackOptions = {}) {
  const feedback = useTouchFeedback(options);

  return {
    ...feedback,
    buttonProps: {
      ...feedback.touchHandlers,
      className: `transition-all duration-100 ${feedback.pressedClasses}`,
      style: feedback.pressedStyle
    }
  };
}

// Hook for card/item feedback
export function useCardFeedback(options: TouchFeedbackOptions = {}) {
  const feedback = useTouchFeedback({ ...options, intensity: 'light' });

  return {
    ...feedback,
    cardProps: {
      ...feedback.touchHandlers,
      className: `transition-all duration-150 ${feedback.pressedClasses} cursor-pointer`,
      style: feedback.pressedStyle
    }
  };
}