// Advanced image optimization utilities
import { logInfo, logWarn } from './logger';

// WebP support detection
let webpSupported: boolean | null = null;

export const checkWebPSupport = (): Promise<boolean> => {
  if (webpSupported !== null) {
    return Promise.resolve(webpSupported);
  }

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      webpSupported = webP.height === 2;
      resolve(webpSupported);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Generate responsive image sizes
export const generateResponsiveSizes = (baseWidth: number): string => {
  const breakpoints = [320, 640, 768, 1024, 1280, 1920];
  return breakpoints
    .filter(bp => bp <= baseWidth * 2) // Don't upscale beyond 2x
    .map(bp => `(max-width: ${bp}px) ${bp}px`)
    .join(', ') + `, ${baseWidth}px`;
};

// Optimize image URL for different services
export const optimizeImageUrl = (src: string, width?: number, quality = 85): string => {
  if (!src) return src;

  // Handle Unsplash images
  if (src.includes('unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('fm', 'webp');
    url.searchParams.set('auto', 'format,compress');
    url.searchParams.set('q', quality.toString());
    if (width) {
      url.searchParams.set('w', width.toString());
      url.searchParams.set('dpr', '2'); // Support retina displays
    }
    return url.toString();
  }

  // Handle other CDN optimizations here
  return src;
};

// Preload critical images
export const preloadImage = (src: string, priority: 'high' | 'low' = 'low'): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }

    link.onload = () => {
      logInfo(`Preloaded image: ${src}`);
      resolve();
    };
    link.onerror = () => {
      logWarn(`Failed to preload image: ${src}`);
      reject();
    };

    document.head.appendChild(link);
  });
};

// Lazy load images with intersection observer
export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  rootMargin = '50px'
): IntersectionObserver => {
  const options = {
    root: null,
    rootMargin,
    threshold: 0.1
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, options);
};

// Convert images to WebP if supported
export const getOptimizedImageSrc = async (src: string, width?: number): Promise<string> => {
  const webpSupported = await checkWebPSupport();
  
  if (!webpSupported) {
    return src;
  }

  return optimizeImageUrl(src, width);
};

// Batch preload critical images
export const preloadCriticalImages = async (images: Array<{ src: string; priority?: 'high' | 'low' }>) => {
  const promises = images.map(({ src, priority }) => 
    preloadImage(src, priority).catch(() => {
      // Ignore individual failures, continue with others
    })
  );

  try {
    await Promise.all(promises);
    logInfo(`Preloaded ${images.length} critical images`);
  } catch (error) {
    logWarn('Some images failed to preload', error);
  }
};