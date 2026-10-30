// Products.jsx — Photo Frame catalog with category filter, price slider, SKU search & sorting.

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { FILTER_CATEGORIES } from '../../constants/productConstants.js';
import { getProducts } from '../../services/productService.js';
import { FiSliders, FiRefreshCw, FiSearch, FiGrid, FiList } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [customOnly, setCustomOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [mobileFilters, setMobileFilters] = useState(false);
  
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
    if (searchParams.get('sort')) {
      setSort(searchParams.get('sort'));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        const rawList = Array.isArray(res?.data?.products)
          ? res.data.products
          : (Array.isArray(res?.products)
            ? res.products
            : (Array.isArray(res) ? res : []));

        const mapped = rawList.map(p => ({
          ...p,
          id: p.product_id || p.id,
          name: p.product_name || p.name,
          subtitle: p.description || p.subtitle || '',
          category_name: p.category_name || (p.categories?.category_name || ''),
          price: Number(p.price) || 0,
          mrp: Number(p.mrp) || Math.round((Number(p.price) || 0) * 1.25),
          product_code: p.product_code || `FW-FRM-${String(p.product_id || p.id).padStart(4, '0')}`,
          rating: p.rating ? Number(p.rating) : null,
          review_count: Number(p.review_count) || 0,
          primary_image: p.primary_image || '/images/products/product_01.jpg',
        }));
        setDbProducts(mapped);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...dbProducts];

    // Filter by Category
    if (category) {
      list = list.filter((p) => {
        const catStr = String(category).toLowerCase();
        const pCatId = String(p.category_id || '').toLowerCase();
        const pCatName = String(p.category_name || '').toLowerCase();
        return pCatId === catStr || pCatName.includes(catStr);
      });
    }

    // Filter by Search (Name, SKU / product_code, Description)
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const codeMatch = (p.product_code || '').toLowerCase().includes(q);
        const subMatch = (p.subtitle || '').toLowerCase().includes(q);
        const catMatch = (p.category_name || '').toLowerCase().includes(q);
        return nameMatch || codeMatch || subMatch || catMatch;
      });
    }

    // Filter by Max Price
    list = list.filter((p) => p.price <= maxPrice);

    // Filter Customizable
    if (customOnly) {
      list = list.filter((p) => p.is_customizable);
    }

    // Sorting
    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'bestseller') {
      list.sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0));
    } else if (sort === 'newest') {
      list.sort((a, b) => (b.product_id || b.id || 0) - (a.product_id || a.id || 0));
    }

    return list;
  }, [category, search, maxPrice, customOnly, sort, dbProducts]);

  const reset = () => {
    setCategory('');
    setSearch('');
    setMaxPrice(2000);
    setCustomOnly(false);
    setSort('featured');
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <h2 className="font-extrabold text-warmDark-900 text-sm flex items-center gap-2">
          <FiSliders className="w-4 h-4 text-brand-700" /> Filter Frames
        </h2>
        <button onClick={reset} className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1" data-testid="reset-filters">
          <FiRefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-warmDark-600 uppercase tracking-wide">Search Catalog / SKU</label>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Collage, FW-FRM-0001"
            className="w-full pl-9 pr-3 py-2 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white"
            data-testid="filter-search"
          />
          <FiSearch className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-warmDark-600 uppercase tracking-wide">Frame Category</label>
        <div className="space-y-1.5">
          <button
            onClick={() => setCategory('')}
            className={`block w-full text-left text-xs sm:text-sm px-3 py-2 rounded-xl font-semibold transition-colors ${
              !category ? 'bg-brand-700 text-cream-50' : 'text-warmDark-700 hover:bg-cream-200'
            }`}
          >
            All Photo Frames ({dbProducts.length})
          </button>
          {FILTER_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`block w-full text-left text-xs sm:text-sm px-3 py-2 rounded-xl font-semibold transition-colors ${
                category === c.id ? 'bg-brand-700 text-cream-50' : 'text-warmDark-700 hover:bg-cream-200'
              }`}
              data-testid={`filter-cat-${c.id}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-warmDark-600 uppercase tracking-wide">
          <span>Max Budget</span>
          <span className="text-brand-700 text-sm font-extrabold">₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min="300"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-700"
          data-testid="filter-price"
        />
        <div className="flex justify-between text-[11px] text-warmDark-400 font-medium">
          <span>₹300</span>
          <span>₹2000+</span>
        </div>
      </div>

      {/* Customizable Only Checkbox */}
      <label className="flex items-center gap-2.5 text-xs sm:text-sm text-warmDark-800 font-bold cursor-pointer select-none p-2 bg-cream-100/60 rounded-xl border border-warmDark-100">
        <input
          type="checkbox"
          checked={customOnly}
          onChange={(e) => setCustomOnly(e.target.checked)}
          className="w-4 h-4 accent-brand-700 rounded"
          data-testid="filter-custom"
        />
        Customizable Frames Only
      </label>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">The Complete Collection</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-warmDark-900 tracking-tight mt-1">Photo Frames Catalog</h1>
          <p className="text-warmDark-500 text-xs sm:text-sm mt-1">
            Showing {filtered.length} of {dbProducts.length} handcrafted photo frames
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilters(!mobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-warmDark-200 rounded-xl text-xs font-bold text-warmDark-800 shadow-sm"
          >
            <FiSliders className="w-4 h-4 text-brand-700" /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-warmDark-500 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-warmDark-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-warmDark-800 focus:outline-none focus:border-brand-500 shadow-sm"
              data-testid="sort-select"
            >
              <option value="featured">Featured Collection</option>
              <option value="bestseller">Best Sellers</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-28 bg-white p-5 rounded-2xl border border-warmDark-100/70 shadow-warm-sm">
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilters && (
          <div className="md:hidden col-span-1 bg-white p-5 rounded-2xl border border-warmDark-200 shadow-warm-md">
            <FilterPanel />
          </div>
        )}

        {/* Products Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-200 border-t-brand-700"></div>
              <p className="text-xs font-bold text-warmDark-500 uppercase tracking-wider">Loading Frames...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-cream-100/60 border border-warmDark-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
              <p className="text-3xl">🖼️</p>
              <h2 className="text-lg font-bold text-warmDark-900">No frames match your filters</h2>
              <p className="text-xs text-warmDark-500 leading-relaxed">
                Try widening your price range or clearing search keywords to view the catalog.
              </p>
              <button
                onClick={reset}
                className="px-6 py-2.5 bg-brand-700 text-cream-50 rounded-full font-bold text-xs shadow-sm hover:bg-brand-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
