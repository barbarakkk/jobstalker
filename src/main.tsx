
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const root = createRoot(document.getElementById("root")!);

// Wrap render in try-catch to catch any initialization errors
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering application:', error);
}
