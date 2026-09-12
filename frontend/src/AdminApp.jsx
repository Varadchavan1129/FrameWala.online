// AdminApp.jsx
// Entry root for Admin Portal omitting storefront contexts for optimal performance

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AdminRoutes from './admin/routes/AdminRoutes.jsx';
import { AdminAuthProvider } from './admin/context/AdminAuthContext.jsx';
import { Toaster } from 'react-hot-toast';

function AdminApp() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        
        <AdminRoutes />
        
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
        
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default AdminApp;
