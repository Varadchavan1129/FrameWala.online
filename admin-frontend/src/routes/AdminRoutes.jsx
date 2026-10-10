// AdminRoutes.jsx — All routes for the admin standalone application
// Note: paths are root-relative (no /admin prefix) since this is its own app

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminRoute from './AdminRoute.jsx';

import Dashboard  from '../pages/Dashboard.jsx';
import Orders     from '../pages/Orders.jsx';
import Products   from '../pages/Products.jsx';
import Inventory  from '../pages/Inventory.jsx';
import Categories from '../pages/Categories.jsx';
import Customers  from '../pages/Customers.jsx';
import Reviews    from '../pages/Reviews.jsx';
import Login      from '../pages/Login.jsx';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public: Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected: Admin panel */}
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"  element={<Dashboard />} />
        <Route path="orders"     element={<Orders />} />
        <Route path="products"   element={<Products />} />
        <Route path="inventory"  element={<Inventory />} />
        <Route path="categories" element={<Categories />} />
        <Route path="customers"  element={<Customers />} />
        <Route path="reviews"    element={<Reviews />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
