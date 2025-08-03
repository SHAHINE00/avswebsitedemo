import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is available before proceeding
if (!React || !React.useState || !React.useEffect) {
  throw new Error('React is not properly loaded');
}

console.log('React hooks validated successfully, rendering app');

// Simple, direct app render without complex initialization
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);