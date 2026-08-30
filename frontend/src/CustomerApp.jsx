// CustomerApp.jsx
// Root of the FrameWala storefront with providers and toaster.

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { Toaster } from 'react-hot-toast';

function CustomerApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#2A1E17',
                  color: '#FAF6F0',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '14px',
                  padding: '12px 18px',
                },
                success: { iconTheme: { primary: '#1F6B40', secondary: '#fff' } },
                error: { iconTheme: { primary: '#B86D43', secondary: '#fff' } },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default CustomerApp;
