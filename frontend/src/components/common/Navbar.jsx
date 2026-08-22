// Navbar.jsx
// Responsive navigation header with search and shopping cart counters

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import SearchBar from './SearchBar.jsx';
import { FiHeart, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiGift } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartTotalItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-extrabold text-2xl tracking-tight font-sans">
            <FiGift className="w-7 h-7 text-amber-500 animate-bounce" />
            <span>Frame<span className="text-amber-500">Wala</span></span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearchSubmit} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </div>

          {/* Action Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-1.5 text-slate-600 hover:text-indigo-600 transition-colors" title="Wishlist">
              <FiHeart className="w-5.5 h-5.5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="relative p-1.5 text-slate-600 hover:text-indigo-600 transition-colors" title="Cart">
              <FiShoppingCart className="w-5.5 h-5.5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            {/* Authentication Link */}
            {user ? (
              <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
                <Link to="/profile" className="flex items-center space-x-1 text-slate-700 hover:text-indigo-600 transition-colors">
                  <FiUser className="w-5 h-5" />
                  <span className="text-xs font-semibold max-w-[80px] truncate">{user.first_name}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-1.5 text-slate-500 hover:text-red-500 transition-colors" 
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-4  py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center md:hidden space-x-3">
            <Link to="/cart" className="relative p-1.5 text-slate-600">
              <FiShoppingCart className="w-6 h-6" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 focus:outline-none hover:text-indigo-600"
            >
              {mobileMenuOpen ? <FiX className="w-6.5 h-6.5" /> : <FiMenu className="w-6.5 h-6.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 bg-white px-4 py-4 space-y-3 shadow-inner">
          <div className="pb-3 border-b border-slate-100">
            <SearchBar onSearch={(q) => { handleSearchSubmit(q); setMobileMenuOpen(false); }} />
          </div>
          
          <div className="flex flex-col space-y-2.5 font-medium text-slate-600 text-sm">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-1">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-1">Products</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-1">About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 transition-colors py-1">Contact</Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-1.5 hover:text-indigo-600 transition-colors py-1">
              <FiHeart className="w-4 h-4" />
              <span>Wishlist ({wishlistItems.length})</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-1 text-slate-800 font-bold"
                >
                  <FiUser className="w-5 h-5 text-indigo-500" />
                  <span>Hello, {user.first_name}</span>
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-1 text-red-500 font-semibold"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-2 bg-indigo-600 text-white rounded-lg font-semibold text-center hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
