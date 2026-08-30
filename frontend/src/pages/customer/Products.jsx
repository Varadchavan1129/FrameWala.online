// Products.jsx — catalog with filters, search, sort (mock data).

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { PRODUCTS, FILTER_CATEGORIES } from '../../data/mockData.js';
import { FiSliders, FiRefreshCw, FiSearch, FiX } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [customOnly, setCustomOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') === 'bestseller' ? 'rating' : 'featured');
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category) list = list.filter((p) => p.category === category);
    if (search) list = list.filter((p) => (p.name + p.subtitle + p.category_name).toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => p.price <= maxPrice);
    if (customOnly) list = list.filter((p) => p.is_customizable);
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, search, maxPrice, customOnly, sort]);

  const reset = () => { setCategory(''); setSearch(''); setMaxPrice(2000); setCustomOnly(false); setSort('featured'); setSearchParams({}); };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <h2 className="font-extrabold text-warmDark-900 text-sm flex items-center gap-2"><FiSliders className="w-4 h-4" /> Filters</h2>
        <button onClick={reset} className="text-xs text-brand-600 font-bold flex items-center gap-1" data-testid="reset-filters"><FiRefreshCw className="w-3 h-3" /> Reset</button>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-warmDark-500 uppercase tracking-wide">Search</label>
        <div className="relative">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search frames..."
            className="w-full pl-9 pr-3 py-2 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white" data-testid="filter-search" />
          <FiSearch className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-warmDark-500 uppercase tracking-wide">Category</label>
        <div className="space-y-1.5">
          <button onClick={() => setCategory('')} className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg font-semibold transition-colors ${!category ? 'bg-brand-600 text-cream-50' : 'text-warmDark-700 hover:bg-cream-200'}`}>All Frames</button>
          {FILTER_CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)} className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg font-semibold transition-colors ${category === c.id ? 'bg-brand-600 text-cream-50' : 'text-warmDark-700 hover:bg-cream-200'}`} data-testid={`filter-cat-${c.id}`}>{c.label}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-warmDark-500 uppercase tracking-wide">Max Price: ₹{maxPrice}</label>
        <input type="range" min="500" max="2000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-brand-600" data-testid="filter-price" />
      </div>
      <label className="flex items-center gap-2.5 text-sm text-warmDark-800 font-bold cursor-pointer">
        <input type="checkbox" checked={customOnly} onChange={(e) => setCustomOnly(e.target.checked)} className="w-4 h-4 accent-brand-600 rounded" data-testid="filter-custom" />
        Customizable Only
      </label>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-warmDark-900">Our Frame Collection</h1>
        <p className="text-warmDark-500 text-sm mt-1">Discover premium handcrafted photo frames for every memory.</p>
      </div>

      <button onClick={() => setMobileFilters(true)} className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-warmDark-200 rounded-full text-sm font-bold" data-testid="open-mobile-filters">
        <FiSliders className="w-4 h-4" /> Filters
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64 shrink-0 bg-white border border-warmDark-100/60 p-6 rounded-2xl h-fit sticky top-28">
          <FilterPanel />
        </aside>

        {mobileFilters && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div className="absolute inset-0 bg-warmDark-900/40" onClick={() => setMobileFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-cream-50 p-6 overflow-y-auto">
              <button onClick={() => setMobileFilters(false)} className="mb-4 ml-auto flex w-9 h-9 items-center justify-center rounded-full bg-cream-200"><FiX className="w-5 h-5" /></button>
              <FilterPanel />
            </div>
          </div>
        )}

        <div className="flex-grow space-y-5">
          <div className="flex items-center justify-between bg-white border border-warmDark-100/60 px-5 py-3 rounded-2xl">
            <span className="text-xs font-bold text-warmDark-500">Showing <span className="text-warmDark-900">{filtered.length}</span> frames</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-warmDark-400 hidden sm:inline">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 border border-warmDark-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-500 bg-white" data-testid="sort-select">
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white border border-warmDark-100/60 rounded-2xl space-y-3">
              <p className="text-warmDark-500 font-semibold">No frames match your filters.</p>
              <button onClick={reset} className="px-5 py-2 bg-brand-600 text-cream-50 rounded-full text-sm font-bold">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5" data-testid="products-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
