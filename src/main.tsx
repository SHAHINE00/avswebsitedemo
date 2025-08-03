import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactLoader from './components/ui/ReactLoader';
import App from './App.tsx';
import './index.css';

// Simple app render with React loader
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <ReactLoader>
    <App />
  </ReactLoader>
);