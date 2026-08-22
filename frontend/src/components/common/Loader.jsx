// Loader.jsx
// Elegant loader animation

import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex items-center justify-center py-6">
      <div className={`${sizes[size] || sizes.medium} border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;
