// AppRoutes.jsx
// Customer storefront routes (frontend-only, guest friendly).

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout.jsx';
import PrivateRoute from './PrivateRoute.jsx';

import Home from '../pages/customer/Home.jsx';
import Products from '../pages/customer/Products.jsx';
import ProductDetails from '../pages/customer/ProductDetails.jsx';
import Cart from '../pages/customer/Cart.jsx';
import Checkout from '../pages/customer/Checkout.jsx';
import Wishlist from '../pages/customer/Wishlist.jsx';
import CustomFrame from '../pages/customer/CustomFrame.jsx';
import About from '../pages/customer/About.jsx';
import Contact from '../pages/customer/Contact.jsx';
import NotFound from '../pages/customer/NotFound.jsx';
import Profile from '../pages/customer/Profile.jsx';
import Orders from '../pages/customer/Orders.jsx';
import OrderDetail from '../pages/customer/OrderDetail.jsx';
import TrackOrder from '../pages/customer/TrackOrder.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="custom-frame" element={<CustomFrame />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
      <Route path="orders/:id/track" element={<PrivateRoute><TrackOrder /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;

