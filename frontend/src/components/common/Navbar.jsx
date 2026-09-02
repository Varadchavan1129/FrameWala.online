// Navbar.jsx
// FrameWala premium header: forest-green announcement bar + cream nav with dropdowns.

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { FILTER_CATEGORIES } from '../../data/mockData.js';
import {
  FiHeart, FiShoppingCart, FiUser, FiMenu, FiX,
  FiPhoneCall, FiTruck, FiChevronDown, FiSearch, FiLogOut,
} from 'react-icons/fi';

const giftItems = [
  { name: 'Custom Mugs', path: '/products?category=gifts' },
  { name: 'Personalised T-Shirts', path: '/products?category=gifts' },
  { name: 'Photo Keychains', path: '/products?category=gifts' },
  { name: 'Gift Hampers', path: '/products?category=gifts' },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartTotalItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
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
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="bg-brand-900 text-cream-100 text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-medium">
          <div className="hidden sm:flex items-center gap-2 text-cream-200/90">
            <FiPhoneCall className="w-3.5 h-3.5" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 text-cream-100">
            <FiTruck className="w-4 h-4 text-gold-400" />
            <span>FREE Delivery on orders above ₹999</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-cream-200/90">
            <Link to="/about" className="hover:text-gold-400 transition-colors">Track Order</Link>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-cream-50/95 backdrop-blur-md border-b border-warmDark-100/50 shadow-warm-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[74px] gap-4">
            <Logo />

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-warmDark-800">
              <div className="relative" onMouseEnter={() => setOpenMenu('cat')} onMouseLeave={() => setOpenMenu(null)}>
                <button className="flex items-center gap-1 hover:text-brand-600 transition-colors py-2" data-testid="nav-categories">
                  Categories <FiChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'cat' ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openMenu === 'cat' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-warm-lg border border-warmDark-100/60 p-2.5 z-50"
                    >
                      {FILTER_CATEGORIES.map((c) => (
                        <Link key={c.id} to={`/products?category=${c.id}`} onClick={() => setOpenMenu(null)}
                          className="block px-3 py-2 rounded-xl hover:bg-cream-100 text-sm font-semibold text-warmDark-800 hover:text-brand-600 transition-colors">
                          {c.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/custom-frame" className="hover:text-brand-600 transition-colors py-2 flex items-center gap-1.5" data-testid="nav-custom-frames">
                Custom Frames
                <span className="bg-gold-100 text-gold-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">AI</span>
              </Link>

              <div className="relative" onMouseEnter={() => setOpenMenu('gift')} onMouseLeave={() => setOpenMenu(null)}>
                <button className="flex items-center gap-1 hover:text-brand-600 transition-colors py-2" data-testid="nav-gifts">
                  Gifts <FiChevronDown className={`w-4 h-4 transition-transform ${openMenu === 'gift' ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openMenu === 'gift' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-warm-lg border border-warmDark-100/60 p-2.5 z-50"
                    >
                      {giftItems.map((g, i) => (
                        <Link key={i} to={g.path} onClick={() => setOpenMenu(null)}
                          className="block px-3 py-2 rounded-xl hover:bg-cream-100 text-sm font-semibold text-warmDark-800 hover:text-brand-600 transition-colors">
                          {g.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/products?sort=bestseller" className="hover:text-brand-600 transition-colors py-2" data-testid="nav-bestsellers">Best Sellers</Link>
              <Link to="/products" className="hover:text-brand-600 transition-colors py-2" data-testid="nav-deals">Deals</Link>
              <Link to="/products" className="hover:text-brand-600 transition-colors py-2" data-testid="nav-new">New Arrivals</Link>
            </div>

            {/* Search */}
            <form onSubmit={submitSearch} className="hidden xl:flex relative w-64">
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for frames, gifts..."
                className="w-full pl-4 pr-10 py-2.5 bg-cream-200/70 border border-transparent focus:border-brand-300 rounded-full text-sm placeholder-warmDark-400 focus:outline-none focus:bg-white transition-all"
                data-testid="navbar-search-input"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-warmDark-600 hover:text-brand-600">
                <FiSearch className="w-4 h-4" />
              </button>
            </form>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <button onClick={logout} className="flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-logout">
                  <FiLogOut className="w-5 h-5" />
                  <span className="text-[10px] font-semibold mt-0.5">Logout</span>
                </button>
              ) : (
                <Link to="/login" className="flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-account">
                  <FiUser className="w-5 h-5" />
                  <span className="text-[10px] font-semibold mt-0.5">Account</span>
                </Link>
              )}

              <Link to="/wishlist" className="relative flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-wishlist">
                <FiHeart className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
                <span className="absolute -top-1.5 right-1 bg-brand-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">{wishlistItems.length}</span>
              </Link>

              <Link to="/cart" className="relative flex flex-col items-center text-warmDark-800 hover:text-brand-600 transition-colors" data-testid="navbar-cart">
                <FiShoppingCart className="w-5 h-5" />
                <span className="text-[10px] font-semibold mt-0.5">Cart</span>
                <span className="absolute -top-1.5 right-1 bg-gold-400 text-warmDark-900 text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">{cartTotalItems}</span>
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link to="/cart" className="relative p-1.5 text-warmDark-900">
                <FiShoppingCart className="w-6 h-6" />
                {cartTotalItems > 0 && <span className="absolute top-0 right-0 bg-brand-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">{cartTotalItems}</span>}
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl bg-cream-200/70 text-warmDark-900" data-testid="navbar-mobile-toggle">
                {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-warmDark-100/50 bg-cream-50 px-4 py-5 space-y-4">
              <form onSubmit={submitSearch} className="relative">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for frames, gifts..."
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
                <Link to="/custom-frame" onClick={() => setMobileOpen(false)} className="py-1">Custom Frames</Link>
                <Link to="/products" onClick={() => setMobileOpen(false)} className="py-1">All Products</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="py-1">Wishlist ({wishlistItems.length})</Link>
                <Link to="/about" onClick={() => setMobileOpen(false)} className="py-1">About</Link>
                {user ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-red-600 py-1">Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="py-1 text-brand-600">Login / Register</Link>
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
