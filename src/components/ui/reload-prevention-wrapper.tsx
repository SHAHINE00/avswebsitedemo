import React, { useEffect, useState, useCallback } from 'react';
import { navigationStateManager } from '@/utils/navigation-state';
import { enhancedNavigationStateManager } from '@/utils/enhanced-navigation-state';

interface Props {
  children: React.ReactNode;
}

export const ReloadPreventionWrapper: React.FC<Props> = ({ children }) => {
  const [key, setKey] = useState(0);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Optimize component remounting to prevent unnecessary re-renders
  const handleForceRemount = useCallback(() => {
    console.log('Force remount triggered - using optimized React state reset');
    setKey(prev => prev + 1);
  }, []);

  // Enhanced tab switch detection
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    // Use enhanced navigation state manager for better detection
    if (enhancedNavigationStateManager.preventUnnecessaryReload()) {
      console.log('Enhanced reload prevention: Tab switch detected');
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  }, []);

  // Handle tab visibility changes without reloading
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setIsTabSwitching(true);
      enhancedNavigationStateManager.saveSession();
    } else {
      // Restore session state without reload
      const restored = enhancedNavigationStateManager.restoreSession();
      if (restored) {
        console.log('Session restored without reload');
      }
      
      // Small delay to ensure tab switch is complete
      setTimeout(() => {
        setIsTabSwitching(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('forceRemount', handleForceRemount);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mark navigation as complete when component mounts
    navigationStateManager.markNavigationComplete();
    enhancedNavigationStateManager.markNavigationComplete();

    return () => {
      window.removeEventListener('forceRemount', handleForceRemount);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleForceRemount, handleBeforeUnload, handleVisibilityChange]);

  return (
    <div 
      key={key} 
      style={{ 
        minHeight: '100vh',
        // Smooth transitions during tab switches
        transition: isTabSwitching ? 'none' : 'all 0.2s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};