import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { navigationStateManager } from './utils/navigation-state';
import { initializeProductionLogging } from '@/utils/cleanupConsole';
import { ENV_CONFIG } from '@/utils/envConfig';
import { initializeProductionOptimizations, monitorBundleSize, initializePerformanceMonitoring } from '@/utils/productionOptimizations';

// Initialize production logging and monitoring
initializeProductionLogging();
initializeProductionOptimizations();

// Apply production console cleanup
if (ENV_CONFIG.isProduction) {
  // Remove console.log in production builds for security
  const originalError = console.error.bind(console);
  const originalWarn = console.warn.bind(console);
  
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.trace = () => {};
  
  // Keep only critical errors in production
  console.error = (...args: any[]) => {
    if (args[0] instanceof Error || (typeof args[0] === 'string' && args[0].includes('Error'))) {
      originalError(...args);
    }
  };
  
  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && 
        (args[0].includes('Security') || args[0].includes('Performance'))) {
      originalWarn(...args);
    }
  };
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

// Ensure React is properly initialized
if (!React || !React.createElement) {
  throw new Error('React is not properly initialized');
}

// Initialize navigation state management
navigationStateManager;

// Monitor bundle performance and Core Web Vitals
monitorBundleSize();
initializePerformanceMonitoring();

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);