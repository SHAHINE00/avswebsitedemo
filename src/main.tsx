import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// React Safety Check
if (!React || typeof React !== 'object') {
  console.error('React is not properly loaded');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Loading... Please refresh if this persists.</div>';
} else {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Wrap in error boundary for React initialization
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error('Failed to initialize React:', error);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Application failed to load. Please refresh the page.</div>';
  }
}