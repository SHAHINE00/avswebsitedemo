import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactLoader from './components/ui/ReactLoader';
import App from './App.tsx';
import './index.css';
import { initializeReactSafety } from './utils/reactInitialization';

// Initialize React safety system before any component rendering
initializeReactSafety().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  createRoot(rootElement).render(
    <ReactLoader>
      <App />
    </ReactLoader>
  );
}).catch((error) => {
  console.error('Failed to initialize React:', error);
  // Fallback rendering without React safety
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center;">
          <h1>Erreur de chargement</h1>
          <p>Veuillez rafraîchir la page</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">Rafraîchir</button>
        </div>
      </div>
    `;
  }
});