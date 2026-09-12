// AdminRoutes.jsx
// Routing structure strictly for the Admin panel

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminRoute from './AdminRoute.jsx';

import Dashboard from '../pages/admin/Dashboard.jsx';
import Orders from '../pages/admin/Orders.jsx';
import Products from '../pages/admin/Products.jsx';
import Inventory from '../pages/admin/Inventory.jsx';
import Categories from '../pages/admin/Categories.jsx';
import Customers from '../pages/admin/Customers.jsx';
import Reviews from '../pages/admin/Reviews.jsx';
import Login from '../pages/admin/Login.jsx';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="categories" element={<Categories />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reviews" element={<Reviews />} />
      </Route>
      
      {/* Catch-all for admin app */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
