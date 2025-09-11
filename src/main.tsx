import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { navigationStateManager } from './utils/navigation-state';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

// Initialize navigation state management
navigationStateManager;

createRoot(rootElement).render(<App />);