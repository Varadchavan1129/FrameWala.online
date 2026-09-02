// Footer.jsx — dark premium footer matching the reference.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiSend } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const subscribe = (e) => { e.preventDefault(); if (!email) return; toast.success('Thanks for subscribing to FrameWala!'); setEmail(''); };

  const col = (title, links) => (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-cream-50 uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2 text-xs text-cream-300/80">
        {links.map((l, i) => <li key={i}><Link to={l.to} className="hover:text-gold-400 transition-colors">{l.label}</Link></li>)}
      </ul>
    </div>
  );

  return (
    <footer className="bg-warmDark-900 text-cream-100 pt-14 pb-8 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 pb-12 border-b border-warmDark-800">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center text-gold-400">
                <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <rect x="6" y="6" width="26" height="30" rx="3" transform="rotate(-8 19 21)" />
                  <rect x="16" y="12" width="26" height="30" rx="3" />
                  <circle cx="24" cy="23" r="3.2" strokeWidth="2" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl text-cream-50">Frame<span className="text-gold-400">Wala</span></span>
            </Link>
            <p className="text-cream-300/80 text-xs leading-relaxed max-w-sm">Personalized frames and gifts made with love to cherish your precious memories forever.</p>
            <div className="flex items-center gap-3 pt-1">
              {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-warmDark-800 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:bg-warmDark-700 transition-colors"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
          {col('Shop', [{ to: '/products', label: 'All Frames' }, { to: '/products?category=led', label: 'LED Frames' }, { to: '/products', label: 'Photo Frames' }, { to: '/custom-frame', label: 'Custom Frames' }, { to: '/products?category=gifts', label: 'Gifts' }])}
          {col('Help', [{ to: '/contact', label: 'Track Order' }, { to: '/contact', label: 'Returns & Refunds' }, { to: '/contact', label: 'Shipping Policy' }, { to: '/contact', label: 'Privacy Policy' }, { to: '/contact', label: 'Terms & Conditions' }])}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-cream-50 uppercase tracking-wider">Newsletter</h4>
            <p className="text-xs text-cream-300/80 leading-relaxed">Subscribe for special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form onSubmit={subscribe} className="relative pt-1">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                className="w-full pl-3 pr-10 py-2.5 bg-warmDark-800 border border-warmDark-700 rounded-xl text-cream-50 text-xs placeholder-warmDark-400 focus:outline-none focus:border-gold-400" data-testid="footer-newsletter-input" />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-gold-400 text-warmDark-900 rounded-lg hover:bg-gold-100 transition-colors" data-testid="footer-newsletter-submit"><FiSend className="w-3.5 h-3.5" /></button>
            </form>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-300/60">
          <p>© {new Date().getFullYear()} FrameWala. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['VISA', 'MasterCard', 'UPI', 'PhonePe', 'Paytm', 'COD'].map((p) => (
              <span key={p} className="px-2 py-1 bg-warmDark-800 rounded text-[10px] font-bold text-cream-200">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
