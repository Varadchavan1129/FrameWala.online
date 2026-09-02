// About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiAward, FiTruck, FiUsers } from 'react-icons/fi';

const About = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <div className="text-center space-y-3">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Story</span>
      <h1 className="text-4xl font-extrabold text-warmDark-900 tracking-tight">Framing Memories with Love</h1>
      <p className="text-warmDark-600 max-w-2xl mx-auto text-sm leading-relaxed">FrameWala crafts premium personalized photo frames and gifts that turn your favourite moments into timeless masterpieces. Every frame is handcrafted, quality-checked, and delivered with care.</p>
    </div>
    <div className="rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white">
      <img src="/images/hero_frame.jpg" alt="FrameWala craft" className="w-full h-72 object-cover" />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[{ icon: FiHeart, n: '10K+', l: 'Happy Customers' }, { icon: FiAward, n: 'Premium', l: 'Handcrafted Quality' }, { icon: FiTruck, n: '18K+', l: 'Pincodes Served' }, { icon: FiUsers, n: '4.8★', l: 'Average Rating' }].map((s, i) => (
        <div key={i} className="bg-white border border-warmDark-100/60 rounded-2xl p-6 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gold-100 text-brand-700 flex items-center justify-center"><s.icon className="w-6 h-6" /></div>
          <p className="text-xl font-extrabold text-warmDark-900">{s.n}</p>
          <p className="text-xs text-warmDark-500">{s.l}</p>
        </div>
      ))}
    </div>
    <div className="text-center">
      <Link to="/products" className="inline-block px-8 py-3.5 bg-brand-600 text-cream-50 rounded-full font-bold text-sm">Explore Our Frames</Link>
    </div>
  </div>
);

export default About;
