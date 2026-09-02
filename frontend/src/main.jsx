// main.jsx — storefront entry
import React from 'react'
import ReactDOM from 'react-dom/client'
import CustomerApp from './CustomerApp.jsx'
import './assets/styles/index.css'

// Mount the customer storefront at the root page element.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomerApp />
  </React.StrictMode>,
)
