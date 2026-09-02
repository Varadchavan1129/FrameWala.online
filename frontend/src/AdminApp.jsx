// AdminApp.jsx
// Entry root for Admin Portal omitting storefront contexts for optimal performance

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

function AdminApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        <AppRoutes />
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              borderRadius: '12px',
              padding: '12px 18px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AdminApp;
