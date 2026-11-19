import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BrandProvider } from './context/BrandContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <BrandProvider>
          <App />
        </BrandProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
