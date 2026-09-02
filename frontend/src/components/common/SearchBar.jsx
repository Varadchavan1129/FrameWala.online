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
        className="w-full pl-4 pr-10 py-2 bg-cream-200/80 hover:bg-white focus:bg-white border border-warmDark-100/60 focus:border-terracotta-500 rounded-full text-warmDark-800 placeholder-warmDark-500/60 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200 text-xs sm:text-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-warmDark-700 hover:text-terracotta-600 rounded-full focus:outline-none transition-all duration-200"
      >
        <FiSearch className="w-4 h-4" />
      </button>
    </form>
  );
};

export default SearchBar;
