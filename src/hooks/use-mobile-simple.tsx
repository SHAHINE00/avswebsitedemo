import { useSafeState, useSafeEffect } from '@/utils/safeHooks';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Enhanced Android device detection
export function useIsAndroid() {
  const [isAndroid, setIsAndroid] = useSafeState<boolean>(false);

  useSafeEffect(() => {
    const checkAndroid = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroidDevice = /android/.test(userAgent);
      setIsAndroid(isAndroidDevice);
      
      // Add class to body for Android-specific styling
      if (isAndroidDevice) {
        document.body.classList.add('android-device');
      } else {
        document.body.classList.remove('android-device');
      }
    };

    checkAndroid();
  }, []);

  return isAndroid;
}

// Enhanced iOS device detection
export function useIsIOS() {
  const [isIOS, setIsIOS] = useSafeState<boolean>(false);

  useSafeEffect(() => {
    const checkIOS = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
      
      // Add class to body for iOS-specific styling
      if (isIOSDevice) {
        document.body.classList.add('ios-device');
      } else {
        document.body.classList.remove('ios-device');
      }
    };

    checkIOS();
  }, []);

  return isIOS;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useSafeState<boolean>(false);

  useSafeEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useSafeState<boolean>(false);

  useSafeEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };

    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  return isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useSafeState<boolean>(false);

  useSafeEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= TABLET_BREAKPOINT);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
}