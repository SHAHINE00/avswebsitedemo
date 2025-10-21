// Environment configuration for production deployment
// This replaces hardcoded values and provides production-ready configuration

export const ENV_CONFIG = {
  // Production environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Supabase configuration (uses env vars with fallback)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://nkkalmyhxtuisjdjmdew.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ra2FsbXloeHR1aXNqZGptZGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODgwMTAsImV4cCI6MjA2Njk2NDAxMH0.JRISrJH9AqdbIh_G4wFNHbqK7v-LQJJPsBEnVWOKIWo'
  },
  
  // Application configuration
  app: {
    name: 'AVS Institut',
    domain: 'your-domain.com', // Replace with your actual domain
    supportEmail: 'support@your-domain.com',
    version: '1.0.0'
  },
  
  // Feature flags for production
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enableDebugMode: process.env.NODE_ENV !== 'production', // Only in development
    enableConsoleLogging: process.env.NODE_ENV !== 'production', // Only in development
    enableSourceMaps: process.env.NODE_ENV !== 'production', // Only in development
    enableDevTools: process.env.NODE_ENV !== 'production' // Only in development
  },
  
  // Performance and caching
  performance: {
    enableServiceWorker: true,
    cacheVersion: '1.0.0',
    apiTimeout: 30000 // 30 seconds
  },
  
  // Security settings
  security: {
    enableCSP: true,
    enableHTTPS: true,
    enableSTS: true,
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
};

// Get configuration value with fallback
export const getConfig = (path: string, fallback?: any) => {
  const keys = path.split('.');
  let value = ENV_CONFIG as any;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }
  
  return value;
};

// Validate required configuration
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!ENV_CONFIG.supabase.url) {
    errors.push('Supabase URL is required');
  }
  
  if (!ENV_CONFIG.supabase.anonKey) {
    errors.push('Supabase anonymous key is required');
  }
  
  if (!ENV_CONFIG.app.name) {
    errors.push('Application name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};