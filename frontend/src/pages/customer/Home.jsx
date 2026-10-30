// Home.jsx — Redesigned FrameWala storefront specializing in photo frames.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { CATEGORY_TILES, HIGHLIGHTS } from '../../constants/productConstants.js';
import { getProducts } from '../../services/productService.js';
import {
  FiArrowRight, FiImage, FiGrid, FiSliders, FiHeart, FiUsers,
  FiCheckCircle, FiShield, FiTruck, FiHeadphones, FiUpload,
  FiAward, FiShoppingBag, FiStar
} from 'react-icons/fi';

const iconMap = {
  image: FiImage,
  grid: FiGrid,
  sliders: FiSliders,
  heart: FiHeart,
  users: FiUsers,
};

const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };

const SectionHead = ({ eyebrow, title, subtitle, to }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
    <div>
      {eyebrow && <span className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</span>}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1">{title}</h2>
      {subtitle && <p className="text-warmDark-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {to && (
      <Link to={to} className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors flex items-center gap-1.5 shrink-0">
        View All Frames <FiArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const prodRes = await getProducts();
        const rawList = Array.isArray(prodRes?.data?.products)
          ? prodRes.data.products
          : (Array.isArray(prodRes?.products)
            ? prodRes.products
            : (Array.isArray(prodRes) ? prodRes : []));

        const mappedProducts = rawList.map(p => ({
          ...p,
          id: p.product_id || p.id,
          name: p.product_name || p.name,
          subtitle: p.description || p.subtitle || '',
          price: Number(p.price) || 0,
          mrp: Number(p.mrp) || Math.round((Number(p.price) || 0) * 1.25),
          primary_image: p.primary_image || '/images/products/product_01.jpg',
          product_code: p.product_code || `FW-FRM-${String(p.product_id || p.id).padStart(4, '0')}`,
          rating: p.rating ? Number(p.rating) : null,
          review_count: Number(p.review_count) || 0,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Backend API Error:", err);
        setError(err.message || "Failed to load products from catalog.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-700"></div>
        <p className="text-xs font-bold text-warmDark-500 uppercase tracking-wider">Loading Frame Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] pb-4 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Error Loading Catalog</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const bestSellers = products.slice(0, 5);
  const collageFrames = products.filter(p => (p.category_name && p.category_name.toLowerCase().includes('collage')) || p.category_id === 2);
  const personalizedFrames = products.filter(p => p.is_customizable || p.category_id === 3);
  const newArrivals = products.slice(5, 10).length > 0 ? products.slice(5, 10) : products.slice(0, 5);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-b from-cream-200/90 via-cream-100 to-cream-50 border-b border-warmDark-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="lg:col-span-7 space-y-6">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 text-brand-900 rounded-full text-xs font-bold uppercase tracking-wider border border-gold-200">
                <span>Handcrafted with Care</span>
                <span className="text-gold-600">•</span>
                <span className="text-gold-600 font-extrabold">100% Solid Wood</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-warmDark-900 leading-[1.08] tracking-tight">
                Turn Cherished Memories Into <span className="text-brand-700 underline decoration-gold-400 decoration-4 underline-offset-8">Masterpieces</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-warmDark-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Explore India’s premium collection of collage photo frames, personalized wall galleries, and anniversary keepsakes crafted to last generations.
              </motion.p>

              {/* Value Badges */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { icon: FiImage, l1: 'Collage', l2: 'Frames' },
                  { icon: FiAward, l1: 'Museum', l2: 'UV Glass' },
                  { icon: FiShield, l1: 'Solid', l2: 'Wood Core' },
                  { icon: FiTruck, l1: 'Safely', l2: 'Delivered' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-warmDark-100/50 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-gold-100 text-brand-800 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold text-warmDark-900 leading-tight">
                      {f.l1}<br />{f.l2}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5 pt-2">
                <Link to="/products" className="px-8 py-4 bg-brand-700 hover:bg-brand-800 text-cream-50 rounded-full font-bold text-sm shadow-warm-md hover:shadow-warm-lg transition-all active:scale-95 flex items-center gap-2" data-testid="hero-shop-now">
                  Explore All Frames <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/custom-frame" className="px-7 py-4 bg-white hover:bg-cream-100 text-warmDark-900 border border-warmDark-200 rounded-full font-bold text-sm shadow-warm-sm transition-all active:scale-95 flex items-center gap-2" data-testid="hero-customize">
                  <FiUpload className="w-4 h-4 text-brand-700" /> Custom Frame Studio
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image Showcase */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white bg-cream-100">
                <img
                  src="/images/hero_frame.jpg"
                  alt="Premium Personalized Photo Frames"
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/products/product_01.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-2xl p-4 border border-white/50 shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Flagship Series</p>
                    <p className="font-extrabold text-sm text-warmDark-900">Collage Photo Frame (8x10)</p>
                  </div>
                  <span className="font-mono font-bold text-xs bg-warmDark-900 text-cream-50 px-2.5 py-1 rounded-md">
                    FW-FRM-0001
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Curated Styles"
          title="Shop by Frame Category"
          subtitle="Discover the perfect frame for every wall, desk, and memory"
          to="/products"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORY_TILES.map((cat) => {
            const Icon = iconMap[cat.icon] || FiImage;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className="group p-5 bg-white border border-warmDark-100/80 hover:border-brand-500 rounded-2xl shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-100 group-hover:bg-brand-700 text-brand-800 group-hover:text-cream-50 flex items-center justify-center transition-colors mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-warmDark-900 text-sm group-hover:text-brand-700 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-warmDark-500 text-xs mt-1 line-clamp-1">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. BEST-SELLING PHOTO FRAMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Most Loved"
          title="Best-Selling Photo Frames"
          subtitle="Customer favorites backed by craftsmanship and rave reviews"
          to="/products?sort=bestseller"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. CUSTOM FRAME STUDIO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-900 to-warmDark-900 text-cream-50 rounded-3xl p-8 sm:p-12 shadow-warm-lg overflow-hidden relative">
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block px-3 py-1 bg-gold-400 text-warmDark-950 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Interactive Frame Studio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Preview Your Photos in Real Frames Before You Buy
              </h2>
              <p className="text-cream-200 text-sm sm:text-base leading-relaxed max-w-xl">
                Upload your portrait or family pictures, test finishes like Natural Oak, Dark Walnut, and Matte Black, and pick the perfect size for your living room gallery.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/custom-frame" className="px-8 py-3.5 bg-gold-400 hover:bg-gold-500 text-warmDark-950 font-extrabold rounded-full text-sm shadow transition-all active:scale-95 flex items-center gap-2">
                  Launch Studio Now <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products?category=2" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-cream-50 border border-white/20 font-bold rounded-full text-sm transition-all">
                  Browse Collage Styles
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img
                  src="/images/custom_section.png"
                  alt="Custom Frame Studio Preview"
                  className="w-full h-64 object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/products/product_01.jpg'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COLLAGE & MULTI-OPENING FRAMES */}
      {collageFrames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Storytelling Walls"
            title="Multi-Photo Collage Frames"
            subtitle="Display 4, 6, or 9 memorable moments in a single harmonious centerpiece"
            to="/products?category=2"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {collageFrames.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. PERSONALIZED PHOTO GIFTS */}
      {personalizedFrames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Custom Engraving & Themes"
            title="Personalized Keepsakes"
            subtitle="Frames customized with names, anniversary dates, and celebratory messages"
            to="/products?category=3"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {personalizedFrames.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Fresh In Studio"
          title="New Arrivals"
          subtitle="Explore the latest handcrafted profiles, shadow boxes, and gallery collections"
          to="/products?sort=newest"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 8. WHY CHOOSE FRAMEWALA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-100/70 border border-warmDark-100/70 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">The FrameWala Standard</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-warmDark-900 tracking-tight">
              Why 10,000+ Homes Trust Our Frames
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-warmDark-100/60 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gold-100 text-brand-800 flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-brand-700" />
                </div>
                <h3 className="font-extrabold text-warmDark-900 text-base">{h.title}</h3>
                <p className="text-xs text-warmDark-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
