// NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
    <div className="w-20 h-20 bg-gold-100 text-brand-700 rounded-3xl flex items-center justify-center"><FiAlertCircle className="w-10 h-10" /></div>
    <div className="space-y-2">
      <h1 className="text-6xl font-black text-warmDark-900 tracking-tight">404</h1>
      <h2 className="text-xl font-extrabold text-warmDark-800">Page Not Found</h2>
      <p className="text-warmDark-500 text-sm max-w-xs mx-auto">The page you're looking for may have moved. Let's frame that up and get you home.</p>
    </div>
    <Link to="/" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 text-cream-50 rounded-full font-bold text-sm"><FiHome className="w-4 h-4" /> Back to Home</Link>
  </div>
);

export default NotFound;
