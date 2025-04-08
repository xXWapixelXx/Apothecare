import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize environment variables
declare global {
  interface Window {
    __env__: {
      VITE_OPENAI_API_KEY?: string;
      NODE_ENV?: string;
      API_URL?: string;
    }
  }
}

// Load environment variables
window.__env__ = {
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  NODE_ENV: import.meta.env.MODE,
  API_URL: import.meta.env.VITE_API_URL
};

// Log environment variable status (without exposing values)
console.log('Environment variables status:');
console.log('- OpenAI API Key:', window.__env__.VITE_OPENAI_API_KEY ? 'CONFIGURED' : 'MISSING');
console.log('- Node Environment:', window.__env__.NODE_ENV || 'NOT SET');
console.log('- API URL:', window.__env__.API_URL ? 'CONFIGURED' : 'MISSING');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
