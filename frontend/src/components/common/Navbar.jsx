// Navbar.jsx
// Premium Indian photo-frame e-commerce header with top announcement bar and Framer Motion transitions

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import SearchBar from './SearchBar.jsx';
import { 
  FiHeart, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, 
  FiPhoneCall, FiTruck, FiChevronDown, FiHelpCircle, FiGrid
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartTotalItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const categories = [
    { name: 'Family Frames', path: '/products?category=family', desc: 'Preserve cherished family moments' },
    { name: 'Couple Frames', path: '/products?category=couple', desc: 'Celebrate romantic milestones' },
    { name: 'Baby Frames', path: '/products?category=baby', desc: 'Cute keepsake memories' },
    { name: 'Wedding Frames', path: '/products?category=wedding', desc: 'Timeless marriage memories' },
    { name: 'Collage Frames', path: '/products?category=collage', desc: 'Multiple photos in one' },
    { name: 'Personalized Frames', path: '/products?category=personalized', desc: 'Engraved with custom text' },
    { name: 'LED Light Frames', path: '/products?category=led', desc: 'Glow up your photos' },
    { name: 'Custom Mugs & Gifts', path: '/products?category=gifts', desc: 'Ceramic mugs & gift boxes' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-warm-sm">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-warmDark-900 text-cream-100 text-xs py-2 px-4 border-b border-warmDark-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 font-medium">
          
          <div className="hidden sm:flex items-center space-x-2 text-cream-300">
            <FiPhoneCall className="w-3.5 h-3.5 text-terracotta-500" />
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-center space-x-2 text-amber-200">
            <FiTruck className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
            <span>✨ <strong>FREE Delivery</strong> on orders above ₹999 | Code: <strong>FRAMEWALA10</strong></span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-cream-300 text-[11px]">
            <Link to="/orders" className="hover:text-terracotta-500 transition-colors">Track Order</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-terracotta-500 transition-colors flex items-center space-x-1">
              <FiHelpCircle className="w-3 h-3" />
              <span>Help Center</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <nav className="bg-cream-50/95 backdrop-blur-md border-b border-warmDark-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-warmDark-900 rounded-xl flex items-center justify-center border border-terracotta-500/40 shadow-sm group-hover:scale-105 transition-transform duration-300">
                {/* Frame Icon */}
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="7" y="7" width="10" height="10" rx="1" ry="1" strokeWidth="1.5" />
                  <path d="M10 13l2-2 4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-warmDark-900 leading-none">
                  Frame<span className="text-terracotta-600">Wala</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-warmDark-500 uppercase mt-0.5">
                  Frame Your Memories
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-warmDark-800">
              <Link to="/" className="hover:text-terracotta-600 transition-colors py-1">
                Home
              </Link>

              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdown(true)}
                onMouseLeave={() => setCategoriesDropdown(false)}
              >
                <button 
                  className="flex items-center space-x-1.5 hover:text-terracotta-600 transition-colors py-1 focus:outline-none"
                  onClick={() => setCategoriesDropdown(!categoriesDropdown)}
                >
                  <span>Categories</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesDropdown ? 'rotate-180 text-terracotta-600' : ''}`} />
                </button>

                <AnimatePresence>
                  {categoriesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-warm-lg border border-warmDark-100/60 p-3 grid grid-cols-1 gap-1 z-50 mt-1"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-warmDark-500 border-b border-cream-200 mb-1 flex items-center justify-between">
                        <span>Browse Collections</span>
                        <FiGrid className="w-3.5 h-3.5" />
                      </div>
                      {categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={cat.path}
                          onClick={() => setCategoriesDropdown(false)}
                          className="px-3 py-2 rounded-xl hover:bg-cream-100 transition-colors group flex flex-col"
                        >
                          <span className="text-sm font-semibold text-warmDark-900 group-hover:text-terracotta-600">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-warmDark-500 group-hover:text-warmDark-700">
                            {cat.desc}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/products?isCustomizable=true" className="hover:text-terracotta-600 transition-colors py-1 flex items-center space-x-1">
                <span>Custom Frames</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-amber-300">AI</span>
              </Link>
              
              <Link to="/products?category=gifts" className="hover:text-terracotta-600 transition-colors py-1">
                Gifts
              </Link>
              <Link to="/products?sort=bestseller" className="hover:text-terracotta-600 transition-colors py-1">
                Best Sellers
              </Link>
              <Link to="/about" className="hover:text-terracotta-600 transition-colors py-1">
                About
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden xl:block w-64 mx-4">
              <SearchBar onSearch={handleSearchSubmit} placeholder="Search frames, gifts..." />
            </div>

            {/* Action Icons */}
            <div className="hidden md:flex items-center space-x-5">
              
              {/* Search Toggle Icon for non-XL */}
              <div className="xl:hidden w-44">
                <SearchBar onSearch={handleSearchSubmit} placeholder="Search..." />
              </div>

              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative p-2 text-warmDark-800 hover:text-terracotta-600 transition-colors rounded-full hover:bg-cream-200/50" 
                title="Wishlist"
              >
                <FiHeart className="w-5.5 h-5.5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-terracotta-600 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border-2 border-cream-50">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 text-warmDark-800 hover:text-terracotta-600 transition-colors rounded-full hover:bg-cream-200/50" 
                title="Cart"
              >
                <FiShoppingCart className="w-5.5 h-5.5" />
                {cartTotalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-warmDark-900 text-cream-100 text-[10px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-cream-50">
                    {cartTotalItems}
                  </span>
                )}
              </Link>

              {/* Account */}
              {user ? (
                <div className="flex items-center space-x-3 border-l border-warmDark-200/60 pl-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-warmDark-800 hover:text-terracotta-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-extrabold text-xs border border-terracotta-300">
                      {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-bold max-w-[90px] truncate">{user.first_name}</span>
                  </Link>
                  <button 
                    onClick={logout} 
                    className="p-1.5 text-warmDark-500 hover:text-red-600 transition-colors" 
                    title="Logout"
                  >
                    <FiLogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-warmDark-900 hover:bg-terracotta-600 text-cream-50 rounded-full text-xs font-bold tracking-wide transition-all duration-200 shadow-sm active:scale-95 space-x-1.5"
                >
                  <FiUser className="w-3.5 h-3.5" />
                  <span>Account</span>
                </Link>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <div className="flex items-center lg:hidden space-x-3">
              <Link to="/cart" className="relative p-2 text-warmDark-900">
                <FiShoppingCart className="w-6 h-6" />
                {cartTotalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-terracotta-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-warmDark-900 focus:outline-none hover:text-terracotta-600 rounded-xl bg-cream-200/60"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-warmDark-100/50 bg-cream-50 px-4 py-5 space-y-4 shadow-xl"
            >
              <SearchBar onSearch={(q) => { handleSearchSubmit(q); setMobileMenuOpen(false); }} placeholder="Search frames, gifts..." />

              <div className="flex flex-col space-y-3 font-semibold text-warmDark-800 text-sm">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-terracotta-600 py-1">Home</Link>
                
                <div className="border-t border-b border-cream-200 py-2 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-warmDark-500">Categories</span>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {categories.slice(0, 6).map((cat, idx) => (
                      <Link
                        key={idx}
                        to={cat.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs bg-white border border-warmDark-100/50 rounded-lg p-2 text-warmDark-800 hover:text-terracotta-600 font-medium"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/products?isCustomizable=true" onClick={() => setMobileMenuOpen(false)} className="hover:text-terracotta-600 py-1 flex items-center justify-between">
                  <span>Custom Frames</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">FrameVision AI</span>
                </Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-terracotta-600 py-1">All Products</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-terracotta-600 py-1">About FrameWala</Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 hover:text-terracotta-600 py-1">
                  <FiHeart className="w-4 h-4 text-terracotta-600" />
                  <span>Wishlist ({wishlistItems.length})</span>
                </Link>
              </div>

              <div className="pt-3 border-t border-warmDark-200/50">
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link 
                      to="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-warmDark-900 font-bold"
                    >
                      <FiUser className="w-5 h-5 text-terracotta-600" />
                      <span>Hello, {user.first_name}</span>
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="flex items-center space-x-1 text-red-600 font-bold text-xs"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center py-2.5 bg-warmDark-900 text-cream-50 rounded-xl font-bold text-center text-sm shadow-md"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

    </header>
  );
};

export default Navbar;
