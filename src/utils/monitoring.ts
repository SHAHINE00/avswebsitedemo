// Production monitoring and error reporting utilities

import { ENV_CONFIG } from './envConfig';
import { logError, logWarn, logInfo } from './logger';

// Types for error tracking
interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

class ProductionMonitoring {
  private errorBuffer: ErrorReport[] = [];
  private performanceBuffer: PerformanceMetric[] = [];
  private maxBufferSize = 50;

  constructor() {
    this.setupGlobalErrorHandlers();
    this.setupPerformanceMonitoring();
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        metadata: {
          lineno: event.lineno,
          colno: event.colno,
          type: 'javascript'
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        metadata: {
          type: 'promise'
        }
      });
    });
  }

  private setupPerformanceMonitoring() {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.reportPerformance('page_load', perfData.loadEventEnd - perfData.loadEventStart);
          this.reportPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
          this.reportPerformance('first_contentful_paint', this.getFirstContentfulPaint());
        }
      }, 1000);
    });
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  reportError(error: Partial<ErrorReport>) {
    const errorReport: ErrorReport = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: error.url,
      userId: error.userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      metadata: error.metadata
    };

    // Add to buffer
    this.errorBuffer.push(errorReport);
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift();
    }

    // Log error
    logError(`Production Error: ${error.message}`, errorReport);

    // In production, you would send this to your error tracking service
    if (ENV_CONFIG.isProduction && ENV_CONFIG.features.enableErrorReporting) {
      this.sendErrorToService(errorReport);
    }
  }

  reportPerformance(name: string, value: number, metadata?: Record<string, any>) {
    const performanceMetric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Add to buffer
    this.performanceBuffer.push(performanceMetric);
    if (this.performanceBuffer.length > this.maxBufferSize) {
      this.performanceBuffer.shift();
    }

    // Log performance metric
    logInfo(`Performance: ${name} = ${value}ms`, performanceMetric);

    // In production, you would send this to your analytics service
    if (ENV_CONFIG.isProduction && ENV_CONFIG.features.enableAnalytics) {
      this.sendPerformanceToService(performanceMetric);
    }
  }

  private async sendErrorToService(error: ErrorReport) {
    try {
      // Replace with your actual error reporting service
      // Example: Sentry, LogRocket, Rollbar, etc.
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });

      if (!response.ok) {
        logWarn('Failed to send error report to service');
      }
    } catch (err) {
      logWarn('Error sending error report:', err);
    }
  }

  private async sendPerformanceToService(metric: PerformanceMetric) {
    try {
      // Replace with your actual analytics service
      // Example: Google Analytics, Mixpanel, etc.
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });

      if (!response.ok) {
        logWarn('Failed to send performance metric to service');
      }
    } catch (err) {
      logWarn('Error sending performance metric:', err);
    }
  }

  // Get recent errors for debugging
  getRecentErrors(count: number = 10): ErrorReport[] {
    return this.errorBuffer.slice(-count);
  }

  // Get recent performance metrics for debugging
  getRecentPerformanceMetrics(count: number = 10): PerformanceMetric[] {
    return this.performanceBuffer.slice(-count);
  }

  // Monitor user interactions
  trackUserInteraction(action: string, metadata?: Record<string, any>) {
    logInfo(`User Interaction: ${action}`, metadata);
    
    if (ENV_CONFIG.isProduction && ENV_CONFIG.features.enableAnalytics) {
      this.sendPerformanceToService({
        name: `user_interaction_${action}`,
        value: Date.now(),
        timestamp: new Date().toISOString(),
        metadata
      });
    }
  }

  // Monitor API performance
  trackApiCall(endpoint: string, duration: number, status: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name: 'api_call',
      value: duration,
      timestamp: new Date().toISOString(),
      metadata: {
        endpoint,
        status,
        ...metadata
      }
    };

    this.reportPerformance('api_call', duration, metric.metadata);

    // Log slow API calls
    if (duration > 5000) { // 5 seconds
      logWarn(`Slow API call detected: ${endpoint} took ${duration}ms`);
    }
  }
}

// Export singleton instance
export const monitoring = new ProductionMonitoring();

// Convenience functions
export const reportError = (message: string, error?: Error, metadata?: Record<string, any>) => {
  monitoring.reportError({
    message,
    stack: error?.stack,
    metadata
  });
};

export const trackPerformance = (name: string, value: number, metadata?: Record<string, any>) => {
  monitoring.reportPerformance(name, value, metadata);
};

export const trackUserAction = (action: string, metadata?: Record<string, any>) => {
  monitoring.trackUserInteraction(action, metadata);
};

export const trackApiCall = (endpoint: string, duration: number, status: number, metadata?: Record<string, any>) => {
  monitoring.trackApiCall(endpoint, duration, status, metadata);
};

// Initialize monitoring system
export const initializeMonitoring = () => {
  // Monitoring is automatically initialized via the singleton
  return monitoring;
};