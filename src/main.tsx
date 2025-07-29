import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeProductionLogging } from '@/utils/cleanupConsole'

// Initialize production monitoring and logging
initializeProductionLogging();

// Global async error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
