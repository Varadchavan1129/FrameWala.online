// App.jsx
// Main application shell component configuring top-level providers, routing table, and global notification toasts.

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    // App shell: all global providers and routed screens live within this tree.
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            
            {/* Global API Routes */}
            <AppRoutes />
            
            {/* Global Alert Notification Toasts */}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0f172a', // dark slate
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  padding: '12px 18px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981', // emerald
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444', // red
                    secondary: '#fff',
                  },
                },
              }}
            />
            
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
