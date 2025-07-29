// Performance monitoring and optimization utilities
import { ENV_CONFIG } from './envConfig';
import { logInfo, logWarn, logError } from './logger';

// Performance metrics tracking
export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'custom';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && ENV_CONFIG.features.enableAnalytics) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    try {
      // Observe navigation timing
      if ('PerformanceObserver' in window) {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric({
              name: entry.name || 'navigation',
              value: entry.duration,
              timestamp: Date.now(),
              type: 'navigation'
            });
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Observe resource loading
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 1000) { // Only track slow resources
              this.recordMetric({
                name: entry.name,
                value: entry.duration,
                timestamp: Date.now(),
                type: 'resource'
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      }
    } catch (error) {
      logError('Failed to initialize performance observers', error);
    }
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Log slow performance
    if (metric.value > 3000) { // 3 seconds
      logWarn(`Slow performance detected: ${metric.name}`, {
        duration: metric.value,
        type: metric.type
      });
    }
  }

  // Track custom performance metrics
  measureCustom<T>(name: string, fn: () => T | Promise<T>): T | Promise<T> {
    const start = performance.now();
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          this.recordMetric({
            name,
            value: duration,
            timestamp: Date.now(),
            type: 'custom'
          });
        });
      } else {
        const duration = performance.now() - start;
        this.recordMetric({
          name,
          value: duration,
          timestamp: Date.now(),
          type: 'custom'
        });
        return result;
      }
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric({
        name: `${name}_error`,
        value: duration,
        timestamp: Date.now(),
        type: 'custom'
      });
      throw error;
    }
  }

  // Get performance summary
  getSummary() {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 300000); // Last 5 minutes
    
    return {
      totalMetrics: recentMetrics.length,
      averageTime: recentMetrics.reduce((acc, m) => acc + m.value, 0) / recentMetrics.length || 0,
      slowestOperations: recentMetrics
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      navigationTiming: this.getNavigationTiming()
    };
  }

  private getNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance?.timing) {
      return null;
    }

    const timing = window.performance.timing;
    return {
      pageLoadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstByte: timing.responseStart - timing.navigationStart,
      domProcessing: timing.domComplete - timing.domLoading
    };
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for common performance measurements
export const measureAsync = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.measureCustom(name, fn) as Promise<T>;
};

export const measureSync = <T>(name: string, fn: () => T): T => {
  return performanceMonitor.measureCustom(name, fn) as T;
};

// Report critical performance issues
export const reportPerformanceIssue = (issue: string, details: any) => {
  logError(`Performance Issue: ${issue}`, details);
  
  // In production, you might want to send this to an external service
  if (ENV_CONFIG.isProduction) {
    // Example: sendToAnalyticsService({ type: 'performance', issue, details });
  }
};
