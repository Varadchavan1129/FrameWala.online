// Footer.jsx
// Premium dark styled footer component

import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin, FiGift } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-2xl tracking-tight">
              <FiGift className="w-7 h-7 text-amber-500" />
              <span>Frame<span className="text-amber-500">Wala</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium customized photo frames, mugs, t-shirts, and engraved gifts designed to preserve your precious moments forever.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-full text-slate-400 transition-all duration-200">
                <FiFacebook className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-full text-slate-400 transition-all duration-200">
                <FiInstagram className="w-4.5 h-4.5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-full text-slate-400 transition-all duration-200">
                <FiTwitter className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Business Hours / Category tags */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products?categoryId=1" className="text-slate-400 hover:text-white transition-colors">Photo Frames</Link>
              </li>
              <li>
                <Link to="/products?categoryId=2" className="text-slate-400 hover:text-white transition-colors">Printed Mugs</Link>
              </li>
              <li>
                <Link to="/products?categoryId=3" className="text-slate-400 hover:text-white transition-colors">Custom T-Shirts</Link>
              </li>
              <li>
                <Link to="/products?categoryId=4" className="text-slate-400 hover:text-white transition-colors">Customized Gifts</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs">Contact Us</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">102, Crafting Street, IT Hub, Mumbai, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-slate-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-slate-400">support@framewala.online</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copy bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FrameWala. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
