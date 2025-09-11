// Production optimization utilities
import { ENV_CONFIG } from './envConfig';
import { logInfo, logWarn, logError } from './logger';

// Performance optimization flags
export const PERFORMANCE_CONFIG = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableImageOptimization: true,
  enableCaching: ENV_CONFIG.isProduction,
  enableMinification: ENV_CONFIG.isProduction,
  enableTreeShaking: ENV_CONFIG.isProduction,
} as const;

// Security optimization flags
export const SECURITY_CONFIG = {
  enableConsoleFiltering: ENV_CONFIG.isProduction,
  enableErrorFiltering: ENV_CONFIG.isProduction,
  enableDebugRemoval: ENV_CONFIG.isProduction,
  enableSourceMapRemoval: ENV_CONFIG.isProduction,
} as const;

// Initialize production optimizations
export const initializeProductionOptimizations = () => {
  if (!ENV_CONFIG.isProduction) {
    logInfo('Development mode - production optimizations disabled');
    return;
  }

  logInfo('Initializing production optimizations...');

  // 1. Optimize console output
  if (SECURITY_CONFIG.enableConsoleFiltering) {
    setupProductionConsole();
  }

  // 2. Optimize error handling
  if (SECURITY_CONFIG.enableErrorFiltering) {
    setupProductionErrorHandling();
  }

  // 3. Optimize performance monitoring
  setupProductionPerformance();

  logInfo('Production optimizations initialized successfully');
};

// Production console optimization
const setupProductionConsole = () => {
  const originalError = console.error?.bind(console) || (() => {});
  const originalWarn = console.warn?.bind(console) || (() => {});

  // Override console methods for production
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.trace = () => {};
  console.table = () => {};
  console.group = () => {};
  console.groupEnd = () => {};
  console.groupCollapsed = () => {};

  // Filter errors and warnings
  console.error = (...args: any[]) => {
    // Only show actual errors, not dev messages
    if (args[0] instanceof Error || 
        (typeof args[0] === 'string' && 
         (args[0].includes('Error') || args[0].includes('Failed')))) {
      originalError(...args);
    }
  };

  console.warn = (...args: any[]) => {
    // Only show security/performance warnings
    if (typeof args[0] === 'string' && 
        (args[0].includes('Security') || 
         args[0].includes('Performance') || 
         args[0].includes('Warning'))) {
      originalWarn(...args);
    }
  };
};

// Production error handling optimization
const setupProductionErrorHandling = () => {
  // Override global error handler
  window.addEventListener('error', (event) => {
    // Filter out non-critical errors
    const isCritical = event.error instanceof Error || 
                      event.message.includes('Script error') ||
                      event.message.includes('Network error');
    
    if (isCritical) {
      logError('Critical error detected', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    }
  });

  // Override unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logError('Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise
    });
    
    // Prevent default browser error handling
    event.preventDefault();
  });
};

// Production performance optimization
const setupProductionPerformance = () => {
  // Enable resource hints for critical resources
  if (document.head) {
    // Preconnect to external domains
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Add DNS prefetch for external resources
    const dnsPrefetchLinks = [
      'https://cdn.jsdelivr.net',
      'https://unpkg.com'
    ];

    dnsPrefetchLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  // Optimize image loading
  if ('loading' in HTMLImageElement.prototype) {
    logInfo('Native lazy loading supported');
  } else {
    logWarn('Native lazy loading not supported - consider polyfill');
  }

  // Monitor performance
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint' && entry.startTime > 2500) {
            logWarn('Slow LCP detected', { lcp: entry.startTime });
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      logError('Performance observer setup failed', error);
    }
  }
};

// Code splitting optimization helper
export const loadComponentAsync = <T>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): Promise<T> => {
  return importFn()
    .then(module => {
      logInfo(`Component loaded: ${componentName}`);
      return module.default;
    })
    .catch(error => {
      logError(`Failed to load component: ${componentName}`, error);
      throw error;
    });
};

// Cache optimization helper
export const getCacheKey = (key: string, version: string = '1.0'): string => {
  return `${key}_v${version}_${ENV_CONFIG.isProduction ? 'prod' : 'dev'}`;
};

// Memory optimization helper
export const optimizeMemoryUsage = () => {
  if (ENV_CONFIG.isProduction && 'gc' in window) {
    // Force garbage collection if available (Chrome DevTools)
    try {
      (window as any).gc();
      logInfo('Manual garbage collection triggered');
    } catch (error) {
      // Ignore - GC not available
    }
  }
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (ENV_CONFIG.isProduction && 'performance' in window) {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entries.length > 0) {
      const entry = entries[0];
      const totalBytes = entry.transferSize || 0;
      
      if (totalBytes > 1024 * 1024) { // 1MB threshold
        logWarn('Large bundle detected', { 
          size: `${(totalBytes / 1024 / 1024).toFixed(2)}MB`,
          threshold: '1MB'
        });
      } else {
        logInfo('Bundle size optimal', {
          size: `${(totalBytes / 1024).toFixed(2)}KB`
        });
      }
    }
  }
};