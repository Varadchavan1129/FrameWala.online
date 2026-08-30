// MainLayout.jsx
// Main template layout for customer-facing pages

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100 text-warmDark-800 selection:bg-terracotta-500 selection:text-white">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
