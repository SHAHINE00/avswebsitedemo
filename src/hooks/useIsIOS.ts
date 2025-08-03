import * as React from 'react';

export function useIsIOS(): boolean {
  // Add React null safety
  if (!React || !React.useState || !React.useEffect) {
    console.warn('useIsIOS: React hooks not available');
    return false;
  }

  const [isIOS, setIsIOS] = React.useState(false);

  React.useEffect(() => {
    const detectIOS = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod|ios/.test(userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      return isIOSDevice;
    };

    setIsIOS(detectIOS());
  }, []);

  return isIOS;
}

export function useIsAndroid(): boolean {
  // Add React null safety
  if (!React || !React.useState || !React.useEffect) {
    console.warn('useIsAndroid: React hooks not available');
    return false;
  }

  const [isAndroid, setIsAndroid] = React.useState(false);

  React.useEffect(() => {
    const detectAndroid = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /android/.test(userAgent);
    };

    setIsAndroid(detectAndroid());
  }, []);

  return isAndroid;
}