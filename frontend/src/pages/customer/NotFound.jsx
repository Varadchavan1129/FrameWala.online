// NotFound.jsx
// Fallback 404 Page

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
        <FiAlertCircle className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">404</h1>
        <h2 className="text-xl font-extrabold text-slate-700">Page Not Found</h2>
        <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
          The link you followed may be broken, or the page may have been removed. Let's get you back.
        </p>
      </div>

      <Link to="/">
        <Button className="text-xs font-bold py-3 px-6 shadow-md shadow-indigo-100">
          <FiHome className="mr-1.5 w-4 h-4" />
          <span>Back to Home</span>
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
