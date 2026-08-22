// Products.jsx
// Catalog Page with filters and sorting options

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';
import ProductCard from '../../components/customer/ProductCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiSliders, FiRefreshCw, FiGrid } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read params initially
  const catParam = searchParams.get('categoryId') || '';
  const searchParam = searchParams.get('search') || '';
  const customParam = searchParams.get('isCustomizable') || '';
  
  const [selectedCategory, setSelectedCategory] = useState(catParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(customParam === 'true');
  const [sortBy, setSortBy] = useState('newest');

  // Trigger sync on query change
  useEffect(() => {
    setSelectedCategory(searchParams.get('categoryId') || '');
    setSearchQuery(searchParams.get('search') || '');
    setIsCustomizable(searchParams.get('isCustomizable') === 'true');
  }, [searchParams]);

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };
    loadCategories();
  }, []);

  // Query products on filter update
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          categoryId: selectedCategory,
          search: searchQuery,
          minPrice,
          maxPrice,
          isCustomizable: isCustomizable ? 'true' : '',
          isActive: 'true'
        };
        const res = await getProducts(filters);
        if (res.success) {
          let sortedProducts = [...res.data.products];
          
          // Sort items
          if (sortBy === 'price-low') {
            sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          } else if (sortBy === 'price-high') {
            sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          }
          
          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error('Error querying products:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, isCustomizable, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setIsCustomizable(false);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Our Collection</h1>
        <p className="text-slate-400 text-sm mt-1">Discover and customize premium wooden photo frames, magic mugs, and personalized gifts.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* A. Sidebar Filter Panel */}
        <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-100 p-6 rounded-2xl h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2">
              <FiSliders className="w-4.5 h-4.5" />
              <span>Filters</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center space-x-1"
            >
              <FiRefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Query Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-sm placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Categories Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              <label className="flex items-center space-x-2 text-sm text-slate-700 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.category_id} className="flex items-center space-x-2 text-sm text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={Number(selectedCategory) === Number(cat.category_id)}
                    onChange={() => setSelectedCategory(cat.category_id.toString())}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{cat.category_name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Price Range (₹)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Customizability toggle */}
          <label className="flex items-center space-x-2.5 text-sm text-slate-700 font-bold cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isCustomizable}
              onChange={(e) => setIsCustomizable(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
            />
            <span>Customizable Items Only</span>
          </label>

        </aside>

        {/* B. Products Catalog Section */}
        <div className="flex-grow space-y-6">
          
          {/* Top Options Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-100 px-6 py-3.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-800">{products.length}</span> product(s)
            </span>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-400">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="newest">Newest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid Loaders */}
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl space-y-4">
              <p className="text-slate-400 font-semibold">No products match your filter parameters.</p>
              <Button onClick={handleResetFilters} variant="secondary" size="small">Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Products;
