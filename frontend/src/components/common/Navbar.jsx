// Navbar.jsx
// FrameWala premium header: forest-green announcement bar + warm cream navigation.

import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerAuthContext as AuthContext } from '../../context/CustomerAuthContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { FILTER_CATEGORIES } from '../../constants/productConstants.js';
import {
  FiHeart, FiShoppingCart, FiUser, FiMenu, FiX,
  FiPhoneCall, FiTruck, FiChevronDown, FiSearch, FiLogOut,
  FiPackage, FiSettings, FiImage
} from 'react-icons/fi';

const giftItems = [
  { name: 'Personalized Name Frames', path: '/products?category=3' },
  { name: 'Couple & Wedding Frames', path: '/products?category=4' },
  { name: 'Family Heritage Frames', path: '/products?category=5' },
  { name: 'Collage Wall Sets', path: '/products?category=2' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartTotalItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const accountMenuRef = useRef(null);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setOpenMenu((prev) => (prev === 'account' ? null : prev));
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const Logo = () => (
    <Link to="/" className="flex items-center gap-2.5 group shrink-0" data-testid="navbar-logo">
      <div className="w-11 h-11 flex items-center justify-center text-brand-700 group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.4">
          <rect x="6" y="6" width="26" height="30" rx="3" transform="rotate(-8 19 21)" />
          <rect x="16" y="12" width="26" height="30" rx="3" className="text-gold-500" />
          <circle cx="24" cy="23" r="3.2" className="text-gold-500" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-2xl tracking-tight text-warmDark-900">
          Frame<span className="text-brand-600">Wala</span>
        </span>
        <span className="text-[10px] font-semibold tracking-[0.15em] text-warmDark-500 uppercase mt-1">
          Frame Your Memories
        </span>
      </div>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* Announcement bar */}
      <div className="bg-brand-900 text-cream-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-cream-200">
            <FiPhoneCall className="w-3.5 h-3.5 text-gold-400" />
            <span>Customer Care: +91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0 font-medium tracking-wide">
            <FiTruck className="w-3.5 h-3.5 text-gold-400" />
            <span>FREE Express Shipping on photo frame orders above ₹999</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-cream-200 text-xs">
            <Link to="/orders" className="hover:text-gold-300 transition-colors">Track Order</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gold-300 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-cream-50/95 backdrop-blur border-b border-warmDark-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            <Logo />

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-warmDark-800">
              <div className="relative" onMouseEnter={() => setOpenMenu('cat')} onMouseLeave={() => setOpenMenu(null)}>
                <button className="flex items-center gap-1 hover:text-brand-600 transition-colors py-2" data-testid="nav-categories">
                  Categories <FiChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'cat' ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openMenu === 'cat' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-warm-lg border border-warmDark-100/60 p-2.5 z-50"
                    >
                      {FILTER_CATEGORIES.map((c) => (
                        <Link key={c.id} to={`/products?category=${c.id}`} onClick={() => setOpenMenu(null)}
                          className="block px-3.5 py-2.5 rounded-xl hover:bg-cream-100 text-sm font-semibold text-warmDark-800 hover:text-brand-600 transition-colors">
                          {c.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/custom-frame" className="hover:text-brand-600 transition-colors py-2 flex items-center gap-1.5" data-testid="nav-custom-frames">
                Custom Frames
                <span className="bg-gold-100 text-gold-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-gold-200">Studio</span>
              </Link>

              <div className="relative" onMouseEnter={() => setOpenMenu('gift')} onMouseLeave={() => setOpenMenu(null)}>
                <button className="flex items-center gap-1 hover:text-brand-600 transition-colors py-2" data-testid="nav-gifts">
                  Gift Ideas <FiChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'gift' ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openMenu === 'gift' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-warm-lg border border-warmDark-100/60 p-2.5 z-50"
                    >
                      {giftItems.map((g, i) => (
                        <Link key={i} to={g.path} onClick={() => setOpenMenu(null)}
                          className="block px-3.5 py-2.5 rounded-xl hover:bg-cream-100 text-sm font-semibold text-warmDark-800 hover:text-brand-600 transition-colors">
                          {g.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/products?sort=bestseller" className="hover:text-brand-600 transition-colors py-2" data-testid="nav-bestsellers">Best Sellers</Link>
              <Link to="/products?sort=newest" className="hover:text-brand-600 transition-colors py-2" data-testid="nav-new">New Arrivals</Link>
              <Link to="/about" className="hover:text-brand-600 transition-colors py-2">About Us</Link>
            </div>

            {/* Desktop search bar */}
            <form onSubmit={submitSearch} className="hidden md:flex items-center relative flex-1 max-w-xs xl:max-w-sm">
              <input
                type="text"
                placeholder="Search frames by name, SKU or size..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-cream-200/60 hover:bg-cream-200/90 focus:bg-white text-warmDark-900 placeholder-warmDark-400 text-xs font-medium rounded-full pl-4 pr-10 py-2.5 border border-warmDark-200/50 focus:border-brand-500 focus:outline-none transition-all shadow-inner"
                data-testid="navbar-search"
              />
              <button type="submit" aria-label="Submit search" className="absolute right-3 text-warmDark-500 hover:text-brand-600 transition-colors">
                <FiSearch className="w-4 h-4" />
              </button>
            </form>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-6">
              {user ? (
                <div className="relative" ref={accountMenuRef}>
                  <button
                    onClick={() => setOpenMenu((prev) => (prev === 'account' ? null : 'account'))}
                    className="flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors"
                    data-testid="navbar-account-logged-in"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs border border-brand-200">
                      {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[65px]">{user.first_name || 'Account'}</span>
                  </button>

                  <AnimatePresence>
                    {openMenu === 'account' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-warm-lg border border-warmDark-100/60 p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-cream-200">
                          <p className="text-xs font-bold text-warmDark-900 truncate">{user.first_name} {user.last_name}</p>
                          <p className="text-[11px] text-warmDark-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/profile" onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-warmDark-700 hover:bg-cream-100 hover:text-brand-600 rounded-xl transition-colors">
                            <FiSettings className="w-4 h-4" /> Account Profile
                          </Link>
                          <Link to="/orders" onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-warmDark-700 hover:bg-cream-100 hover:text-brand-600 rounded-xl transition-colors">
                            <FiPackage className="w-4 h-4" /> My Frame Orders
                          </Link>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left">
                            <FiLogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-account">
                  <FiUser className="w-5 h-5" />
                  <span className="text-[10px] font-semibold mt-0.5">Account</span>
                </Link>
              )}

              <Link to="/wishlist" className="relative flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-wishlist">
                <FiHeart className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 right-1 bg-brand-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-cart">
                <FiShoppingCart className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-0.5">Cart</span>
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1.5 right-1 bg-gold-500 text-warmDark-900 text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile hamburger & cart */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link to="/cart" className="relative p-1.5 text-warmDark-900">
                <FiShoppingCart className="w-6 h-6" />
                {cartTotalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartTotalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl bg-cream-200/70 text-warmDark-900" data-testid="navbar-mobile-toggle">
                {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-warmDark-100/50 bg-cream-50 px-4 py-5 space-y-4">
              <form onSubmit={submitSearch} className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search photo frames..."
                  className="w-full pl-4 pr-10 py-2.5 bg-cream-200/70 rounded-full text-sm focus:outline-none" />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark-600"><FiSearch className="w-4 h-4" /></button>
              </form>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_CATEGORIES.map((c) => (
                  <Link key={c.id} to={`/products?category=${c.id}`} onClick={() => setMobileOpen(false)}
                    className="text-xs bg-white border border-warmDark-100/60 rounded-xl p-2.5 font-semibold text-warmDark-800">{c.label}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm font-semibold text-warmDark-800">
                <Link to="/custom-frame" onClick={() => setMobileOpen(false)} className="py-1 flex items-center gap-1.5 text-brand-700">
                  <FiImage className="w-4 h-4" /> Custom Frame Studio
                </Link>
                <Link to="/products" onClick={() => setMobileOpen(false)} className="py-1">All Frames Catalog</Link>
                <Link to="/products?sort=bestseller" onClick={() => setMobileOpen(false)} className="py-1">Best Sellers</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="py-1">Wishlist ({wishlistItems.length})</Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="py-1">About FrameWala</Link>
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="py-1">My Account</Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)} className="py-1">My Orders</Link>
                    <button onClick={handleLogout} className="text-left text-red-600 py-1">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="py-1 text-brand-700">Login / Register</Link>
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
