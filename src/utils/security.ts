// Security utilities for input validation and sanitization

import { logWarn, logError } from './logger';

// Input validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
  alphanumeric: /^[a-zA-Z0-9\s]{1,100}$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  slug: /^[a-z0-9-]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

// Rate limiting tracking
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number = 5;
  private windowMs: number = 15 * 60 * 1000; // 15 minutes

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing attempts for this identifier
    let attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    attempts = attempts.filter(attempt => attempt > windowStart);
    
    // Check if we're within the limit
    if (attempts.length >= this.maxAttempts) {
      logWarn(`Rate limit exceeded for identifier: ${identifier}`);
      return false;
    }
    
    // Add current attempt
    attempts.push(now);
    this.attempts.set(identifier, attempts);
    
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const rateLimiter = new RateLimiter();

// Input sanitization functions
export const sanitizeInput = {
  string: (input: string, maxLength: number = 1000): string => {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  },

  email: (email: string): string => {
    const sanitized = sanitizeInput.string(email, 254).toLowerCase();
    return ValidationPatterns.email.test(sanitized) ? sanitized : '';
  },

  phone: (phone: string): string => {
    const sanitized = phone.replace(/[^\d\+\-\s\(\)]/g, '');
    return ValidationPatterns.phone.test(sanitized) ? sanitized : '';
  },

  name: (name: string): string => {
    const sanitized = sanitizeInput.string(name, 50);
    return ValidationPatterns.name.test(sanitized) ? sanitized : '';
  },

  url: (url: string): string => {
    const sanitized = sanitizeInput.string(url, 2048);
    try {
      const urlObj = new URL(sanitized);
      // Only allow https and http protocols
      if (!['https:', 'http:'].includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString();
    } catch {
      return '';
    }
  },

  slug: (slug: string): string => {
    const sanitized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return ValidationPatterns.slug.test(sanitized) ? sanitized : '';
  }
};

// Input validation functions
export const validateInput = {
  required: (value: any, fieldName: string): boolean => {
    if (value === null || value === undefined || value === '') {
      logWarn(`Validation failed: ${fieldName} is required`);
      return false;
    }
    return true;
  },

  email: (email: string): boolean => {
    const sanitized = sanitizeInput.email(email);
    if (!sanitized) {
      logWarn('Validation failed: Invalid email format');
      return false;
    }
    return true;
  },

  phone: (phone: string): boolean => {
    const sanitized = sanitizeInput.phone(phone);
    if (!sanitized) {
      logWarn('Validation failed: Invalid phone format');
      return false;
    }
    return true;
  },

  length: (value: string, min: number, max: number, fieldName: string): boolean => {
    if (value.length < min || value.length > max) {
      logWarn(`Validation failed: ${fieldName} must be between ${min} and ${max} characters`);
      return false;
    }
    return true;
  },

  uuid: (uuid: string): boolean => {
    if (!ValidationPatterns.uuid.test(uuid)) {
      logWarn('Validation failed: Invalid UUID format');
      return false;
    }
    return true;
  }
};

// Security headers validation
export const validateSecurityHeaders = (headers: Headers): boolean => {
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Content-Security-Policy'
  ];

  const missingHeaders = requiredHeaders.filter(header => !headers.get(header));
  
  if (missingHeaders.length > 0) {
    logWarn(`Missing security headers: ${missingHeaders.join(', ')}`);
    return false;
  }
  
  return true;
};

// CSRF token generation and validation
export const csrfTokens = {
  generate: (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  validate: (token: string, expectedToken: string): boolean => {
    if (!token || !expectedToken || token.length !== expectedToken.length) {
      logWarn('CSRF token validation failed: Invalid token format');
      return false;
    }
    
    // Constant-time comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
    }
    
    if (result !== 0) {
      logWarn('CSRF token validation failed: Token mismatch');
      return false;
    }
    
    return true;
  }
};

// File upload security
export const fileUploadSecurity = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
  maxSize: 10 * 1024 * 1024, // 10MB

  validateFile: (file: File): boolean => {
    // Check file type
    if (!fileUploadSecurity.allowedTypes.includes(file.type)) {
      logWarn(`File upload failed: Invalid file type ${file.type}`);
      return false;
    }

    // Check file size
    if (file.size > fileUploadSecurity.maxSize) {
      logWarn(`File upload failed: File size ${file.size} exceeds maximum ${fileUploadSecurity.maxSize}`);
      return false;
    }

    // Check file name
    const fileName = sanitizeInput.string(file.name, 255);
    if (!fileName || fileName.includes('..') || fileName.includes('/')) {
      logWarn('File upload failed: Invalid file name');
      return false;
    }

    return true;
  },

  generateSecureFileName: (originalName: string): string => {
    const extension = originalName.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}_${random}.${extension}`;
  }
};

// API request validation
export const apiSecurity = {
  validateApiKey: (apiKey: string): boolean => {
    // Basic API key format validation
    if (!apiKey || apiKey.length < 32) {
      logWarn('API key validation failed: Invalid format');
      return false;
    }
    return true;
  },

  validateRequestOrigin: (origin: string): boolean => {
    const allowedOrigins = [
      'https://avs.ma',
      'https://www.avs.ma',
      'http://localhost:3000', // Development only
      'http://localhost:5173'  // Vite dev server
    ];

    if (!allowedOrigins.includes(origin)) {
      logWarn(`Request blocked: Invalid origin ${origin}`);
      return false;
    }

    return true;
  },

  sanitizeRequestBody: (body: any): any => {
    if (typeof body === 'string') {
      return sanitizeInput.string(body);
    }

    if (Array.isArray(body)) {
      return body.map(item => apiSecurity.sanitizeRequestBody(item));
    }

    if (typeof body === 'object' && body !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(body)) {
        const sanitizedKey = sanitizeInput.string(key, 100);
        if (sanitizedKey) {
          sanitized[sanitizedKey] = apiSecurity.sanitizeRequestBody(value);
        }
      }
      return sanitized;
    }

    return body;
  }
};

// Security monitoring
export const securityMonitoring = {
  reportSecurityEvent: (event: string, details: any): void => {
    logError(`Security Event: ${event}`, details);
    
    // In production, you would send this to your security monitoring service
    // Example: send to Sentry, DataDog, or custom security dashboard
  },

  detectAnomalousActivity: (userId: string, action: string): boolean => {
    // Simple anomaly detection based on rate limiting
    const identifier = `${userId}_${action}`;
    
    if (!rateLimiter.isAllowed(identifier)) {
      securityMonitoring.reportSecurityEvent('Anomalous Activity Detected', {
        userId,
        action,
        timestamp: new Date().toISOString()
      });
      return true;
    }
    
    return false;
  }
};

// Export main security validation function
export const performSecurityCheck = (request: {
  origin?: string;
  userAgent?: string;
  body?: any;
  userId?: string;
  action?: string;
}): boolean => {
  try {
    // Validate origin
    if (request.origin && !apiSecurity.validateRequestOrigin(request.origin)) {
      return false;
    }

    // Check for anomalous activity
    if (request.userId && request.action) {
      if (securityMonitoring.detectAnomalousActivity(request.userId, request.action)) {
        return false;
      }
    }

    // Sanitize request body
    if (request.body) {
      request.body = apiSecurity.sanitizeRequestBody(request.body);
    }

    return true;
  } catch (error) {
    logError('Security check failed:', error);
    return false;
  }
};