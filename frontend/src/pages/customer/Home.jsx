// Home.jsx — FrameWala homepage matching the reference design.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { PRODUCTS, CATEGORY_TILES, formatINR } from '../../data/mockData.js';
import {
  FiArrowRight, FiImage, FiZap, FiCoffee, FiTag, FiSquare, FiKey, FiSmartphone,
  FiGift, FiCheckCircle, FiStar, FiShield, FiHeadphones, FiUpload, FiSliders,
  FiShoppingBag, FiTruck, FiRefreshCw, FiAward,
} from 'react-icons/fi';

const iconMap = { image: FiImage, zap: FiZap, coffee: FiCoffee, tag: FiTag, square: FiSquare, key: FiKey, phone: FiSmartphone, gift: FiGift };

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const SectionHead = ({ eyebrow, title, to }) => (
  <div className="flex items-end justify-between gap-4 mb-7">
    <div>
      {eyebrow && <span className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</span>}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1">{title}</h2>
    </div>
    {to && (
      <Link to={to} className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 shrink-0">
        View All <FiArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </div>
);

const Home = () => {
  const bestSellers = PRODUCTS.slice(0, 5);
  const newArrivals = PRODUCTS.slice(5, 10);

  return (
    <div className="pb-4">
      {/* HERO */}
      <section className="bg-gradient-to-b from-cream-200/80 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-warmDark-700">
                Turn Your Memories Into Masterpieces <FiStar className="w-4 h-4 text-gold-400 fill-current" />
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-warmDark-900 leading-[1.02] tracking-tight">
                Personalized Frames,<br />
                <span className="text-brand-700">Made Just For You</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-warmDark-600 text-base sm:text-lg max-w-md leading-relaxed">
                Upload your photos, customize your frame, and cherish your memories forever.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg">
                {[
                  { icon: FiImage, l1: 'Custom', l2: 'Photo Frames' },
                  { icon: FiGift, l1: 'Perfect', l2: 'For Gifting' },
                  { icon: FiShield, l1: 'Premium', l2: 'Quality' },
                  { icon: FiTruck, l1: 'Fast & Safe', l2: 'Delivery' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gold-100 text-brand-700 flex items-center justify-center shrink-0"><f.icon className="w-4 h-4" /></div>
                    <div className="text-[11px] font-bold text-warmDark-800 leading-tight">{f.l1}<br />{f.l2}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-1">
                <Link to="/products" className="px-8 py-4 bg-warmDark-900 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm shadow-warm-md transition-all active:scale-95 flex items-center gap-2" data-testid="hero-shop-now">
                  Shop Now <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/custom-frame" className="px-8 py-4 bg-white hover:bg-cream-100 text-warmDark-900 border border-warmDark-200 rounded-full font-bold text-sm shadow-warm-sm transition-all active:scale-95 flex items-center gap-2" data-testid="hero-customize">
                  Customize Now <FiUpload className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border border-white/60">
                <img src="/images/hero_frame.jpg" alt="Personalized photo frames" className="w-full h-[440px] object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 w-36 h-44 rounded-2xl overflow-hidden shadow-warm-lg border-4 border-white rotate-[-6deg]">
                <img src="/images/products/product_04.jpg" alt="Heart frame" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-warm-lg px-4 py-3 flex items-center gap-2 border border-warmDark-100">
                <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-extrabold text-xs">4.8★</div>
                <div className="text-[11px] font-bold text-warmDark-900 leading-tight">10,000+<br /><span className="text-warmDark-500 font-medium">Happy Frames</span></div>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-10 bg-white rounded-3xl shadow-warm-md border border-warmDark-100/60 grid grid-cols-2 md:grid-cols-4 divide-x divide-cream-200">
            {[
              { icon: FiCheckCircle, big: '10K+', small: 'Happy Customers' },
              { icon: FiStar, big: '4.8', small: 'Average Rating' },
              { icon: FiShield, big: '100% Secure', small: 'Payments' },
              { icon: FiHeadphones, big: '24/7', small: 'Customer Support' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-5">
                <div className="w-11 h-11 rounded-xl bg-gold-100 text-brand-700 flex items-center justify-center shrink-0"><s.icon className="w-5 h-5" /></div>
                <div><p className="font-extrabold text-warmDark-900 text-base leading-tight">{s.big}</p><p className="text-xs text-warmDark-500">{s.small}</p></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16">
        {/* SHOP BY CATEGORY */}
        <section>
          <SectionHead title="Shop By Category" to="/products" />
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORY_TILES.map((c) => {
              const Icon = iconMap[c.icon];
              return (
                <Link key={c.id} to={`/products?category=${c.id}`} className="group flex flex-col items-center gap-2 text-center" data-testid={`category-${c.id}`}>
                  <div className="w-full aspect-square rounded-2xl bg-cream-200/70 group-hover:bg-gold-100 border border-warmDark-100/60 flex items-center justify-center transition-colors">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-brand-700" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-warmDark-800 group-hover:text-brand-600 transition-colors">{c.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* BEST SELLERS */}
        <section>
          <SectionHead eyebrow="Most Loved" title="Best Sellers" to="/products?sort=bestseller" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        </section>

        {/* CUSTOMIZE YOUR FRAME */}
        <section className="bg-gradient-to-br from-cream-200/70 to-cream-100 rounded-3xl border border-warmDark-100/60 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Simple 4-Step Journey</span>
                <h2 className="text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1">Customize Your Frame</h2>
                <p className="text-warmDark-600 text-sm mt-2">Create something unique in just a few simple steps.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: FiImage, t: 'Choose Frame', d: 'Pick a design' },
                  { icon: FiUpload, t: 'Upload Photo', d: 'Add your memory' },
                  { icon: FiSliders, t: 'Customize', d: 'Adjust & preview' },
                  { icon: FiShoppingBag, t: 'Place Order', d: 'We deliver joy' },
                ].map((s, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-warmDark-100 text-brand-700 flex items-center justify-center shadow-warm-sm"><s.icon className="w-5 h-5" /></div>
                    <p className="text-xs font-extrabold text-warmDark-900">{s.t}</p>
                    <p className="text-[10px] text-warmDark-500">{s.d}</p>
                  </div>
                ))}
              </div>
              <Link to="/custom-frame" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm shadow-warm-md transition-all active:scale-95" data-testid="customize-cta">
                Start Customizing <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg border-4 border-white">
              <img src="/images/custom_section.png" alt="Customize your frame" className="w-full h-72 object-cover"
                onError={(e) => { e.currentTarget.src = '/images/products/product_01.jpg'; }} />
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section>
          <SectionHead eyebrow="Fresh In" title="New Arrivals" to="/products" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        </section>

        {/* PROMO BANNERS */}
        <section className="grid md:grid-cols-3 gap-5">
          <div className="relative rounded-3xl overflow-hidden bg-warmDark-900 text-cream-50 p-7 min-h-[190px] flex flex-col justify-between">
            <div><p className="text-2xl font-extrabold">Flat 20% Off</p><p className="text-sm text-cream-200 mt-1">On LED Frames</p></div>
            <Link to="/products?category=led" className="self-start px-5 py-2.5 bg-gold-400 text-warmDark-900 rounded-full text-xs font-bold hover:bg-gold-100 transition-colors">Shop Now</Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-gold-100 text-warmDark-900 p-7 min-h-[190px] flex flex-col justify-between">
            <div><p className="text-2xl font-extrabold">Perfect Gifts</p><p className="text-sm text-warmDark-600 mt-1">For Every Occasion</p></div>
            <Link to="/products?category=gifts" className="self-start px-5 py-2.5 bg-warmDark-900 text-cream-50 rounded-full text-xs font-bold hover:bg-brand-700 transition-colors">Explore Gifts</Link>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-cream-200 text-warmDark-900 p-7 min-h-[190px] flex flex-col justify-between border border-warmDark-100">
            <div><p className="text-2xl font-extrabold">Custom Mugs</p><p className="text-sm text-warmDark-600 mt-1">Starting from {formatINR(399)}</p></div>
            <Link to="/products?category=gifts" className="self-start px-5 py-2.5 bg-brand-600 text-cream-50 rounded-full text-xs font-bold hover:bg-brand-700 transition-colors">Shop Mugs</Link>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FiRefreshCw, t: 'Easy Returns', d: 'Hassle free returns' },
            { icon: FiShield, t: 'Secure Payments', d: '100% protected' },
            { icon: FiAward, t: 'Premium Quality', d: 'The best for you' },
            { icon: FiTruck, t: 'Fast Delivery', d: 'On time, every time' },
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-warmDark-100/60 rounded-2xl p-4 shadow-warm-sm">
              <div className="w-11 h-11 rounded-xl bg-gold-100 text-brand-700 flex items-center justify-center shrink-0"><v.icon className="w-5 h-5" /></div>
              <div><p className="font-bold text-warmDark-900 text-sm">{v.t}</p><p className="text-xs text-warmDark-500">{v.d}</p></div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;
