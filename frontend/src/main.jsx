// main.jsx — storefront and admin entry
import React from 'react'
import ReactDOM from 'react-dom/client'
import CustomerApp from './CustomerApp.jsx'
import AdminApp from './AdminApp.jsx'
import './assets/styles/index.css'

// Conditionally mount Admin or Customer app based on Vite config define
const isAppAdmin = typeof __ADMIN__ !== 'undefined' && __ADMIN__;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAppAdmin ? <AdminApp /> : <CustomerApp />}
  </React.StrictMode>,
)
