import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false
  });

  const checkConnectionSpeed = useCallback(async (): Promise<boolean> => {
    try {
      const startTime = Date.now();
      // Use a small resource to test connection speed
      await fetch('/favicon.png?' + Date.now(), { 
        method: 'HEAD',
        cache: 'no-store'
      });
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Consider connection slow if it takes more than 2 seconds for a small request
      return duration > 2000;
    } catch (error) {
      return true; // Assume slow if request fails
    }
  }, []);

  const updateNetworkStatus = useCallback(async () => {
    const isOnline = navigator.onLine;
    let isSlowConnection = false;
    let connectionType: string | undefined;

    if (isOnline) {
      isSlowConnection = await checkConnectionSpeed();
      
      // Get connection type if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connectionType = connection?.effectiveType || connection?.type;
      }
    }

    setNetworkStatus({
      isOnline,
      isSlowConnection,
      connectionType
    });
  }, [checkConnectionSpeed]);

  useEffect(() => {
    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        isSlowConnection: false
      }));
    };

    // Initial check
    updateNetworkStatus();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed periodically when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        updateNetworkStatus();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [updateNetworkStatus]);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    await updateNetworkStatus();
    return networkStatus.isOnline;
  }, [updateNetworkStatus, networkStatus.isOnline]);

  return {
    ...networkStatus,
    retryConnection
  };
};