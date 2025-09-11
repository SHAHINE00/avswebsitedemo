import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { navigationStateManager } from './utils/navigation-state';
import { initializeProductionLogging } from '@/utils/cleanupConsole';
import { ENV_CONFIG } from '@/utils/envConfig';
import { initializeProductionOptimizations, monitorBundleSize } from '@/utils/productionOptimizations';

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

// Initialize navigation state management
navigationStateManager;

// Monitor bundle performance
monitorBundleSize();

createRoot(rootElement).render(<App />);