// SearchBar.jsx
// Common search input component

import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = 'Search customized gifts...', initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-2.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white border-transparent focus:border-indigo-500 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200 border text-sm"
      />
      <button
        type="submit"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-indigo-600 rounded-full focus:outline-none transition-all duration-200"
      >
        <FiSearch className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;
