import React, { useEffect, useState } from 'react';
import { navigationStateManager } from '@/utils/navigation-state';

interface Props {
  children: React.ReactNode;
}

export const ReloadPreventionWrapper: React.FC<Props> = ({ children }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Handle force remount events
    const handleForceRemount = () => {
      console.log('Force remount triggered - updating component key');
      setKey(prev => prev + 1);
    };

    window.addEventListener('forceRemount', handleForceRemount);

    // Mark navigation as complete when component mounts
    navigationStateManager.markNavigationComplete();

    return () => {
      window.removeEventListener('forceRemount', handleForceRemount);
    };
  }, []);

  return (
    <div key={key} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};