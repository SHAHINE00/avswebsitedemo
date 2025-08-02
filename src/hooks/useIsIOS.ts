import { useState, useEffect } from 'react';

export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
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
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const detectAndroid = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /android/.test(userAgent);
    };

    setIsAndroid(detectAndroid());
  }, []);

  return isAndroid;
}