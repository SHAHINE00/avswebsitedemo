import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is fully loaded before proceeding
if (!React || !React.useState || !React.useEffect || !React.useContext) {
  console.error('React is not properly loaded');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;">Loading React...</div>';
  
  // Wait for React to be available
  const checkReact = () => {
    if (React && React.useState && React.useEffect && React.useContext) {
      initializeApp();
    } else {
      setTimeout(checkReact, 100);
    }
  };
  
  setTimeout(checkReact, 100);
} else {
  initializeApp();
}

function initializeApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(<App />);
}