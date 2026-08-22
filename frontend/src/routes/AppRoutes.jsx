// AppRoutes.jsx
// Main Route Configuration dynamically separating Admin and Customer Portal routing paths

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Guards
import PrivateRoute from './PrivateRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import PublicRoute from './PublicRoute.jsx';

// Customer Pages
import Home from '../pages/customer/Home.jsx';
import Products from '../pages/customer/Products.jsx';
import ProductDetails from '../pages/customer/ProductDetails.jsx';
import Cart from '../pages/customer/Cart.jsx';
import Wishlist from '../pages/customer/Wishlist.jsx';
import Checkout from '../pages/customer/Checkout.jsx';
import Orders from '../pages/customer/Orders.jsx';
import Profile from '../pages/customer/Profile.jsx';
import About from '../pages/customer/About.jsx';
import Contact from '../pages/customer/Contact.jsx';
import TrackOrder from '../pages/customer/TrackOrder.jsx';
import NotFound from '../pages/customer/NotFound.jsx';

// Auth Pages
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminProducts from '../pages/admin/Products.jsx';
import AdminCategories from '../pages/admin/Categories.jsx';
import AdminOrders from '../pages/admin/Orders.jsx';
import AdminCustomers from '../pages/admin/Customers.jsx';
import AdminInventory from '../pages/admin/Inventory.jsx';
import AdminReviews from '../pages/admin/Reviews.jsx';

const AppRoutes = () => {
  // Detect active portal context
  const isPortAdmin = window.location.port === '5174';
  const isDomainAdmin = window.location.hostname.startsWith('admin.');
  const isAdminPortal = isPortAdmin || isDomainAdmin;

  if (isAdminPortal) {
    return (
      <Routes>
        {/* Admin Portal Entry Redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Public Login Route specifically for Admins */}
        <Route path="/admin/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Protected Dashboard/Admin Layout Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        {/* Catch-all route to redirect back to admin dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // Customer Portal Routes
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* Protected Customer Routes */}
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="orders/:id/track" element={<PrivateRoute><TrackOrder /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
