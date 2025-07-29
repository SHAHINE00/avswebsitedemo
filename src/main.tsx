import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeProductionLogging } from '@/utils/cleanupConsole'

// Initialize production monitoring and logging
initializeProductionLogging();

createRoot(document.getElementById("root")!).render(<App />);
