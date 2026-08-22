// main.jsx
// React DOM boot mounting with dynamic portal router configuration selection

import React from 'react'
import ReactDOM from 'react-dom/client'
import CustomerApp from './CustomerApp.jsx'
import AdminApp from './AdminApp.jsx'
import './assets/styles/index.css'

// Detect active portal context
const isPortAdmin = window.location.port === '5174';
const isDomainAdmin = window.location.hostname.startsWith('admin.');
const isAdminPortal = isPortAdmin || isDomainAdmin;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminPortal ? <AdminApp /> : <CustomerApp />}
  </React.StrictMode>,
)
