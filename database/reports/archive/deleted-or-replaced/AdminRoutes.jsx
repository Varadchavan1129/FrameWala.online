// AdminRoutes.jsx
// Administrator portal routes

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminRoute from './AdminRoute.jsx';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard.jsx';
import Products from '../pages/admin/Products.jsx';
import Orders from '../pages/admin/Orders.jsx';
import Inventory from '../pages/admin/Inventory.jsx';
import Categories from '../pages/admin/Categories.jsx';
import Customers from '../pages/admin/Customers.jsx';
import Reviews from '../pages/admin/Reviews.jsx';

// Auth Pages (Shared)
import Login from '../pages/auth/Login.jsx';

const AdminRoutes = () => (
  <Routes>
    {/* Public-facing login route for admins */}
    <Route path="/admin/login" element={<Login />} />

    {/* Protected Admin Routes mapped to AdminLayout */}
    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
      {/* Redirect /admin to /admin/dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="orders" element={<Orders />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="categories" element={<Categories />} />
      <Route path="customers" element={<Customers />} />
      <Route path="reviews" element={<Reviews />} />
    </Route>
    
    {/* Catch-all to redirect back to admin dashboard */}
    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

export default AdminRoutes;
