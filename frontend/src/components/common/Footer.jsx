// Footer.jsx
// Complete premium footer with newsletter subscription, payment badges, quick links and social accounts

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiSend, 
  FiShield, FiRefreshCw, FiAward, FiTruck 
} from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to FrameWala!');
    setEmail('');
  };

  return (
    <footer className="bg-warmDark-900 text-cream-100 pt-16 pb-8 border-t border-warmDark-800">
      
      {/* 1. Value Props Bar in Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-warmDark-800/80">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-warmDark-800/40 border border-warmDark-700/30">
            <div className="w-12 h-12 rounded-xl bg-terracotta-600/20 text-terracotta-500 flex items-center justify-center shrink-0">
              <FiRefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-cream-50">Easy Returns</h4>
              <p className="text-[11px] text-cream-300/70 mt-0.5">7 Days Hassle-free Policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-warmDark-800/40 border border-warmDark-700/30">
            <div className="w-12 h-12 rounded-xl bg-terracotta-600/20 text-terracotta-500 flex items-center justify-center shrink-0">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-cream-50">100% Protected</h4>
              <p className="text-[11px] text-cream-300/70 mt-0.5">Secure Encrypted Payments</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-warmDark-800/40 border border-warmDark-700/30">
            <div className="w-12 h-12 rounded-xl bg-terracotta-600/20 text-terracotta-500 flex items-center justify-center shrink-0">
              <FiAward className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-cream-50">Premium Quality</h4>
              <p className="text-[11px] text-cream-300/70 mt-0.5">Handcrafted Teak & Synthetic Wood</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-warmDark-800/40 border border-warmDark-700/30">
            <div className="w-12 h-12 rounded-xl bg-terracotta-600/20 text-terracotta-500 flex items-center justify-center shrink-0">
              <FiTruck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-cream-50">Fast Delivery</h4>
              <p className="text-[11px] text-cream-300/70 mt-0.5">Safely Packaged & Shipped Nationwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cream-50 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-warmDark-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <rect x="7" y="7" width="10" height="10" rx="1" ry="1" strokeWidth="1.5" />
                  <path d="M10 13l2-2 4 4" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="10" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-cream-50">
                Frame<span className="text-terracotta-500">Wala</span>
              </span>
            </Link>
            
            <p className="text-cream-300/80 text-xs leading-relaxed max-w-sm">
              Personalized frames and gifts made with love to cherish your precious memories forever. Handcrafted wooden finishes, crystal-clear UV prints, and instant AI previews.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-warmDark-800 border border-warmDark-700/60 flex items-center justify-center text-cream-300 hover:text-terracotta-500 hover:border-terracotta-500 transition-colors">
                <FiInstagram className="w-4.5 h-4.5" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-warmDark-800 border border-warmDark-700/60 flex items-center justify-center text-cream-300 hover:text-terracotta-500 hover:border-terracotta-500 transition-colors">
                <FiFacebook className="w-4.5 h-4.5" />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-warmDark-800 border border-warmDark-700/60 flex items-center justify-center text-cream-300 hover:text-terracotta-500 hover:border-terracotta-500 transition-colors">
                <FiTwitter className="w-4.5 h-4.5" />
              </a>
              <a href="#youtube" className="w-9 h-9 rounded-full bg-warmDark-800 border border-warmDark-700/60 flex items-center justify-center text-cream-300 hover:text-terracotta-500 hover:border-terracotta-500 transition-colors">
                <FiYoutube className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-50 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-xs text-cream-300/80">
              <li><Link to="/products" className="hover:text-terracotta-500 transition-colors">All Photo Frames</Link></li>
              <li><Link to="/products?category=led" className="hover:text-terracotta-500 transition-colors">LED Light Frames</Link></li>
              <li><Link to="/products?category=collage" className="hover:text-terracotta-500 transition-colors">Collage Frames</Link></li>
              <li><Link to="/products?isCustomizable=true" className="hover:text-terracotta-500 transition-colors">Custom AI Frames</Link></li>
              <li><Link to="/products?category=gifts" className="hover:text-terracotta-500 transition-colors">Custom Mugs & Gifts</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-50 uppercase tracking-wider">Help & Support</h4>
            <ul className="space-y-2 text-xs text-cream-300/80">
              <li><Link to="/orders" className="hover:text-terracotta-500 transition-colors">Track Your Order</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta-500 transition-colors">Returns & Refund Policy</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta-500 transition-colors">Shipping Information</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-50 uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-cream-300/80 leading-relaxed">
              Subscribe to receive special discount codes & once-in-a-lifetime deals.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-3 pr-10 py-2 bg-warmDark-800 border border-warmDark-700 rounded-xl text-cream-50 text-xs placeholder-warmDark-500 focus:outline-none focus:border-terracotta-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-lg transition-colors"
                  title="Subscribe"
                >
                  <FiSend className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* 3. Bottom Bar & Payment Gateways */}
        <div className="pt-8 border-t border-warmDark-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-300/60">
          <p>© 2026 FrameWala. All rights reserved. Frame Your Memories.</p>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-cream-300/70 mr-1">100% Safe Payment:</span>
            <span className="px-2 py-1 bg-warmDark-800 border border-warmDark-700/60 rounded text-[10px] font-bold text-cream-200">UPI</span>
            <span className="px-2 py-1 bg-warmDark-800 border border-warmDark-700/60 rounded text-[10px] font-bold text-cream-200">VISA</span>
            <span className="px-2 py-1 bg-warmDark-800 border border-warmDark-700/60 rounded text-[10px] font-bold text-cream-200">MasterCard</span>
            <span className="px-2 py-1 bg-warmDark-800 border border-warmDark-700/60 rounded text-[10px] font-bold text-cream-200">PhonePe</span>
            <span className="px-2 py-1 bg-warmDark-800 border border-warmDark-700/60 rounded text-[10px] font-bold text-cream-200">Paytm</span>
            <span className="px-2 py-1 bg-warmDark-800 border border-warmDark-700/60 rounded text-[10px] font-bold text-cream-200">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
