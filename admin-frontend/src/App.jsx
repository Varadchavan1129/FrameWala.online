// App.jsx — Admin portal root

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import AdminRoutes from './routes/AdminRoutes.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
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
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
