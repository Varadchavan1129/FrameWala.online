// Home.jsx
// Homepage with premium styling, categories navigation, and featured products

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';
import ProductCard from '../../components/customer/ProductCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import { FiGift, FiSmile, FiShield, FiTruck } from 'react-icons/fi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await getProducts({ isActive: 'true' });
        const catRes = await getCategories();
        
        if (prodRes.success) setProducts(prodRes.data.products.slice(0, 4)); // Get first 4
        if (catRes.success) setCategories(catRes.data.categories);
      } catch (error) {
        console.error('Error loading homepage data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 rounded-3xl text-white px-8 py-16 md:py-24 shadow-2xl flex flex-col md:flex-row items-center justify-between">
        {/* Radial Background Light Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        {/* Hero Left Content */}
        <div className="max-w-xl space-y-6 z-10 text-center md:text-left">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
            <FiGift />
            <span>Cherish Moments Forever</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-sans tracking-tight leading-tight">
            Personalized Gifts <br />
            For Your <span className="text-amber-500">Loved Ones</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Create high-quality custom Photo Frames, Printed Mugs, Customized T-Shirts, and engraved keepsakes. Gift a memory that stays forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm text-center shadow-lg shadow-indigo-900/30 transition-all duration-200 active:scale-95"
            >
              Shop Collection
            </Link>
            <Link
              to="/products?isCustomizable=true"
              className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl font-bold text-sm text-center transition-all duration-200 active:scale-95"
            >
              Customizable Items
            </Link>
          </div>
        </div>

        {/* Hero Right Image Mockup */}
        <div className="mt-12 md:mt-0 max-w-sm md:max-w-md w-full relative z-10 flex justify-center">
          <div className="relative p-3 border border-slate-800 bg-slate-900/80 rounded-2xl shadow-2xl backdrop-blur-md transform md:rotate-3 hover:rotate-0 transition-transform duration-500 glow-amber">
            <img
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600"
              alt="Custom Gifts Carousel Mockup"
              className="rounded-xl object-cover h-[250px] w-[350px]"
            />
            <div className="absolute -bottom-5 -right-5 bg-amber-500 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg border border-amber-400">
              Upto 30% Off 🎉
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Categories Grid */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Browse Categories</h2>
          <p className="text-slate-400 text-sm mt-1">Explore our range of personalized premium gifts.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.category_id}
              to={`/products?categoryId=${cat.category_id}`}
              className="group relative p-6 bg-white border border-slate-100 rounded-2xl text-center shadow-xs hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col items-center hover-scale"
            >
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <FiGift className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                {cat.category_name}
              </h3>
              <p className="text-slate-400 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Best Sellers</h2>
            <p className="text-slate-400 text-sm mt-1">Our customer favourites, handpicked for you.</p>
          </div>
          <Link
            to="/products"
            className="text-indigo-600 hover:text-indigo-700 font-bold text-sm tracking-wide flex items-center space-x-1"
          >
            <span>View All Products</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p className="text-center text-slate-400 py-12">No products found in database.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Trust Section / Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200/50 pt-12">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <FiSmile className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">100% Satisfaction</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              We verify and layout all custom prints manually to guarantee absolute clarity and customer satisfaction.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Secure Gateway</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              All transactions are secured with leading standards. Safe payments, zero worries.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiTruck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Fast Safe Shipping</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Carefully boxed in bubble wrap protection, shipped through leading courier logistics partner agencies.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
