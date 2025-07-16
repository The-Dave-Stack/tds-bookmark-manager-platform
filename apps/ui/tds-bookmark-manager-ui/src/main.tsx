/**
 * main.tsx
 *
 * Purpose:
 * - Entry point for the React application.
 * - Renders the main App component into the DOM.
 * - Configures global providers like BrowserRouter for routing and Toaster for notifications.
 *
 * Logic Overview:
 * 1. Imports necessary React and ReactDOM utilities.
 * 2. Imports global CSS and i18n configuration.
 * 3. Renders the App component wrapped in StrictMode for development checks.
 * 4. Sets up react-router-dom's BrowserRouter for client-side routing.
 * 5. Configures react-hot-toast for consistent and styled notifications across the application.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './index.css';
import './i18n/config';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#F9FAFB',
            color: '#1F2937',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F9FAFB',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F9FAFB',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
