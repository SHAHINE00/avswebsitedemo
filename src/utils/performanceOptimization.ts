// Enhanced performance optimization utilities
import { measureSync, measureAsync } from './performance';

// Image optimization with WebP support
export const optimizeImage = async (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
} = {}): Promise<string> => {
  return measureAsync('image-optimization', async () => {
    const { width, height, quality = 85, format = 'webp' } = options;
    
    // Check WebP support
    const supportsWebP = await checkWebPSupport();
    const targetFormat = supportsWebP ? format : 'jpeg';
    
    // Build optimized URL (example for services like Cloudinary or ImageKit)
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('f', targetFormat);
    
    return `${src}?${params.toString()}`;
  });
};

// Check WebP support
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Preload critical resources
export const preloadCriticalResources = (resources: Array<{
  href: string;
  as: 'script' | 'style' | 'image' | 'font';
  type?: string;
  crossorigin?: string;
}>) => {
  return measureSync('preload-resources', () => {
    resources.forEach(({ href, as, type, crossorigin }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (crossorigin) link.crossOrigin = crossorigin;
      
      // Add to head if not already present
      if (!document.querySelector(`link[href="${href}"]`)) {
        document.head.appendChild(link);
      }
    });
  });
};

// Lazy load components with intersection observer
export const createLazyLoader = (threshold = 0.1, rootMargin = '50px') => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const src = element.dataset.src;
        
        if (src) {
          if (element.tagName === 'IMG') {
            (element as HTMLImageElement).src = src;
          }
          element.removeAttribute('data-src');
        }
        
        // Trigger custom load event
        element.dispatchEvent(new CustomEvent('lazyload'));
      }
    });
  }, { threshold, rootMargin });
};

// Bundle size optimization - dynamic imports
export const loadModule = async <T>(
  moduleFactory: () => Promise<{ default: T }>,
  fallback?: T
): Promise<T> => {
  try {
    const module = await measureAsync('dynamic-import', moduleFactory);
    return module.default;
  } catch (error) {
    console.warn('Failed to load module dynamically:', error);
    if (fallback) {
      return fallback;
    }
    throw error;
  }
};

// Cache management
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Auto cleanup every 5 minutes
setInterval(() => cacheManager.cleanup(), 5 * 60 * 1000);

// Network-aware loading
export const isSlowConnection = (): boolean => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return false;
  
  // Consider slow if effective type is 2g or slow-2g, or if downlink is less than 1 Mbps
  return connection.effectiveType === '2g' || 
         connection.effectiveType === 'slow-2g' || 
         connection.downlink < 1;
};

// Adaptive resource loading based on connection
export const loadResourceAdaptively = async (
  highQualityUrl: string,
  lowQualityUrl: string,
  options: { timeout?: number } = {}
): Promise<string> => {
  const { timeout = 5000 } = options;
  
  if (isSlowConnection()) {
    return lowQualityUrl;
  }
  
  // Try to load high quality with timeout
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      resolve(lowQualityUrl);
    }, timeout);
    
    img.onload = () => {
      clearTimeout(timer);
      resolve(highQualityUrl);
    };
    
    img.onerror = () => {
      clearTimeout(timer);
      resolve(lowQualityUrl);
    };
    
    img.src = highQualityUrl;
  });
};

// Performance monitoring
export const trackPerformanceMetrics = () => {
  if ('performance' in window) {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const value = (entry as any).value || entry.duration;
        console.debug('Performance metric:', {
          name: entry.name,
          value,
          rating: value && typeof value === 'number' ? 
            value < 100 ? 'good' :
            value < 300 ? 'needs-improvement' : 'poor'
            : 'unknown'
        });
      });
    });

    // Observe different types of performance entries
    try {
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      observer.observe({ entryTypes: ['measure'] });
    }
  }
};

// Initialize performance tracking
if (typeof window !== 'undefined') {
  trackPerformanceMetrics();
}