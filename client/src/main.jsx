import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: 'var(--toast-bg, #1e293b)',
                      color: '#f1f5f9',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      padding: '12px 16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    },
                    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                    error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                  }}
                />
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
