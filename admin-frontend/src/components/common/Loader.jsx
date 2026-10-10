// Loader.jsx — Admin portal loading spinner

import React from 'react';

const Loader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Loader;
