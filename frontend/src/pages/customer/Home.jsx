// Home.jsx
// Complete FrameWala E-Commerce Homepage UI with Framer Motion animations & warm cream aesthetic

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';
import ProductCard from '../../components/customer/ProductCard.jsx';
import FrameVisionAI from '../../components/customer/FrameVisionAI.jsx';
import Loader from '../../components/common/Loader.jsx';
import { toast } from 'react-hot-toast';
import { 
  FiGift, FiHeart, FiSmile, FiShield, FiTruck, FiArrowRight, 
  FiStar, FiUpload, FiSliders, FiCheckCircle, FiAward, FiSend,
  FiGrid, FiChevronRight, FiCheck
} from 'react-icons/fi';

// Master product list mapping directly to the 10 uploaded product images
const UPLOADED_PRODUCTS = [
  {
    product_id: 1,
    product_name: 'Classic Wooden Photo Frame',
    category_name: 'Personalized Frames',
    price: 599,
    rating: 4.9,
    review_count: 176,
    subtitle: 'Timeless elegance for your precious family memories.',
    primary_image: '/images/products/product_01.jpg',
    is_customizable: true,
    badge: 'Best Seller'
  },
  {
    product_id: 2,
    product_name: 'Multi Photo Collage Frame',
    category_name: 'Collage Frames',
    price: 1099,
    rating: 4.8,
    review_count: 125,
    subtitle: 'Showcase multiple moments in one beautiful wooden frame.',
    primary_image: '/images/products/product_02.jpg',
    is_customizable: true,
    badge: 'Trending'
  },
  {
    product_id: 3,
    product_name: 'Natural Wood Grain Frame',
    category_name: 'Family Frames',
    price: 699,
    rating: 4.9,
    review_count: 94,
    subtitle: 'Simple, natural teak finish perfect for every home decor.',
    primary_image: '/images/products/product_03.jpg',
    is_customizable: false,
    badge: 'Popular'
  },
  {
    product_id: 4,
    product_name: 'Heart Shape Couple Frame',
    category_name: 'Couple Frames',
    price: 859,
    rating: 4.9,
    review_count: 210,
    subtitle: 'Perfect romantic gift for anniversaries and special moments.',
    primary_image: '/images/products/product_04.jpg',
    is_customizable: true,
    badge: 'Gift Choice'
  },
  {
    product_id: 5,
    product_name: 'Modern White Baby Frame',
    category_name: 'Baby Frames',
    price: 899,
    rating: 4.9,
    review_count: 82,
    subtitle: 'Sleek and minimal white frame designed for baby milestones.',
    primary_image: '/images/products/product_05.jpg',
    is_customizable: true,
    badge: 'New'
  },
  {
    product_id: 6,
    product_name: 'Warm Glow LED Light Frame',
    category_name: 'LED Light Frames',
    price: 1299,
    rating: 4.7,
    review_count: 291,
    subtitle: 'Light up your memories with a warm ambient backlight.',
    primary_image: '/images/products/product_06.jpg',
    is_customizable: true,
    badge: '20% OFF'
  },
  {
    product_id: 7,
    product_name: 'Rustic Vintage Wooden Frame',
    category_name: 'Personalized Frames',
    price: 749,
    rating: 4.8,
    review_count: 67,
    subtitle: 'Vintage distressed look for a classic rustic charm.',
    primary_image: '/images/products/product_07.jpg',
    is_customizable: false,
  },
  {
    product_id: 8,
    product_name: 'Acrylic Table Floating Frame',
    category_name: 'Couple Frames',
    price: 699,
    rating: 4.9,
    review_count: 114,
    subtitle: 'Sleek, stylish floating frame with premium acrylic glass.',
    primary_image: '/images/products/product_08.jpg',
    is_customizable: true,
    badge: 'Sleek'
  },
  {
    product_id: 9,
    product_name: 'Wedding Shadow Box Frame',
    category_name: 'Wedding Frames',
    price: 1199,
    rating: 4.9,
    review_count: 153,
    subtitle: 'Preserve wedding dried flowers & keepsake photo memories.',
    primary_image: '/images/products/product_09.jpg',
    is_customizable: true,
    badge: 'Premium'
  },
  {
    product_id: 10,
    product_name: 'Hanging Rope Wooden Frame',
    category_name: 'Family Frames',
    price: 799,
    rating: 4.9,
    review_count: 188,
    subtitle: 'Rope hanging wooden accent perfect for feature walls.',
    primary_image: '/images/products/product_10.jpg',
    is_customizable: false,
  },
];

// 6 Homepage Category Cards specified in prompt
const CATEGORY_ITEMS = [
  {
    id: 'family',
    title: 'Family Frames',
    subtitle: 'Capture cherished family bonds',
    image: '/images/hero_frame.jpg',
    badge: 'Popular',
    link: '/products?category=family'
  },
  {
    id: 'couple',
    title: 'Couple Frames',
    subtitle: 'Romantic anniversary gifts',
    image: '/images/products/product_08.jpg',
    badge: 'Love Special',
    link: '/products?category=couple'
  },
  {
    id: 'baby',
    title: 'Baby Frames',
    subtitle: 'Cherish cute baby milestones',
    image: '/images/products/product_05.jpg',
    badge: 'Milestone',
    link: '/products?category=baby'
  },
  {
    id: 'wedding',
    title: 'Wedding Frames',
    subtitle: 'Timeless marriage keepsakes',
    image: '/images/products/product_09.jpg',
    badge: 'Elegant',
    link: '/products?category=wedding'
  },
  {
    id: 'collage',
    title: 'Collage Frames',
    subtitle: 'Multiple memories in one',
    image: '/images/products/product_02.jpg',
    badge: 'Multi-Photo',
    link: '/products?category=collage'
  },
  {
    id: 'personalized',
    title: 'Personalized Frames',
    subtitle: 'Custom name & date prints',
    image: '/images/products/product_01.jpg',
    badge: 'Custom Text',
    link: '/products?category=personalized'
  },
];

const Home = () => {
  const [products, setProducts] = useState(UPLOADED_PRODUCTS);
  const [activeTab, setActiveTab] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt fetching live products from backend API, fallback cleanly to UPLOADED_PRODUCTS
    const loadProducts = async () => {
      try {
        const res = await getProducts({ isActive: 'true' });
        if (res.success && res.data.products && res.data.products.length > 0) {
          // Merge images from uploaded set if backend missing images
          const merged = res.data.products.map((p, idx) => ({
            ...p,
            primary_image: p.primary_image || UPLOADED_PRODUCTS[idx % UPLOADED_PRODUCTS.length].primary_image,
            rating: p.rating || 4.9,
            review_count: p.review_count || 120 + idx * 15,
          }));
          setProducts(merged);
        }
      } catch (err) {
        console.log('Using static product list:', err.message);
      }
    };
    loadProducts();
  }, []);

  // Filter products by tab
  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter(p => p.category_name.toLowerCase().includes(activeTab.toLowerCase()));

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('🎉 Discount Code: FRAMEWALA15 sent to your inbox!');
    setNewsletterEmail('');
  };

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="space-y-20 pb-16 overflow-x-hidden">
      
      {/* 3. HERO SECTION */}
      <section className="relative pt-6 pb-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Main Banner Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-cream-200/90 via-cream-100 to-warmDark-100/40 border border-warmDark-100/80 shadow-warm-lg p-6 sm:p-10 lg:p-14 overflow-hidden">
          
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              
              {/* Top Tagline Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-4 py-1.5 bg-cream-50/90 border border-warmDark-200/60 rounded-full text-xs font-bold text-warmDark-800 shadow-xs">
                <FiGift className="w-4 h-4 text-terracotta-600 animate-pulse" />
                <span>Turn Your Memories Into Masterpieces</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-warmDark-900 tracking-tight leading-[1.1] font-sans">
                Personalized Frames, <br />
                <span className="text-terracotta-600 font-serif italic font-normal">Made Just For You</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p variants={fadeInUp} className="text-warmDark-700 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Upload your photos, customize your frame, and cherish your memories forever. Handcrafted wooden finishes, crystal UV clarity, and instant AI live previews.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-warmDark-900 hover:bg-terracotta-600 text-cream-50 rounded-full font-extrabold text-sm tracking-wide shadow-warm-md hover:shadow-warm-lg transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Shop Collection</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/products?isCustomizable=true"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-cream-100 text-warmDark-900 border border-warmDark-200 rounded-full font-extrabold text-sm tracking-wide shadow-warm-sm transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <FiGift className="w-4 h-4 text-terracotta-600" />
                  <span>Customize Your Frame</span>
                </Link>
              </motion.div>

              {/* Mini Feature Tags */}
              <motion.div variants={fadeInUp} className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="flex items-center space-x-2 text-xs font-bold text-warmDark-800">
                  <div className="w-2 h-2 rounded-full bg-terracotta-600"></div>
                  <span>Custom Photo Frames</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-warmDark-800">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Perfect For Gifting</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-warmDark-800">
                  <div className="w-2 h-2 rounded-full bg-terracotta-600"></div>
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-warmDark-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span>Fast & Safe Delivery</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Hero Image Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative group max-w-md w-full">
                
                {/* Frame Showcase Card */}
                <div className="relative p-3 bg-white border border-warmDark-200/80 rounded-3xl shadow-warm-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1">
                  <img
                    src="/images/hero_frame.jpg"
                    alt="FrameWala Hero Family Photo Frame"
                    className="w-full h-[380px] sm:h-[420px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Offer Ribbon Overlay */}
                  <div className="absolute top-6 right-6 bg-terracotta-600 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-lg border border-terracotta-400 flex items-center space-x-1.5">
                    <span>Flat 10% OFF 🎉</span>
                  </div>

                  {/* Customer Rating Sticker */}
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-warmDark-900 p-3 rounded-2xl shadow-xl border border-warmDark-100 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-extrabold text-xs">
                      4.9★
                    </div>
                    <div>
                      <p className="text-xs font-extrabold">10,000+ Happy Frames</p>
                      <p className="text-[10px] text-warmDark-500">Verified Customer Reviews</p>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>

        </div>

        {/* Hero Bottom Trust Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-warmDark-100/60 p-4 rounded-2xl shadow-warm-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
              <FiSmile className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-warmDark-900">10K+ Customers</p>
              <p className="text-[11px] text-warmDark-500">Smiles Delivered Across India</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warmDark-100/60 p-4 rounded-2xl shadow-warm-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FiStar className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-warmDark-900">4.8 Average Rating</p>
              <p className="text-[11px] text-warmDark-500">Over 2,500 5-Star Reviews</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warmDark-100/60 p-4 rounded-2xl shadow-warm-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-warmDark-900">100% Secure</p>
              <p className="text-[11px] text-warmDark-500">Encrypted Safe Payment</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-warmDark-100/60 p-4 rounded-2xl shadow-warm-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-warmDark-50 text-warmDark-800 flex items-center justify-center shrink-0">
              <FiTruck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-warmDark-900">Fast Shipping</p>
              <p className="text-[11px] text-warmDark-500">Dispatched in 24 Hours</p>
            </div>
          </div>
        </motion.div>

      </section>

      {/* 4. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Curated Collections</span>
            <h2 className="text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1 font-sans">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-warmDark-900 hover:text-terracotta-600 transition-colors flex items-center space-x-1"
          >
            <span>View All Categories</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {CATEGORY_ITEMS.map((cat) => (
            <motion.div key={cat.id} variants={fadeInUp}>
              <Link
                to={cat.link}
                className="group block bg-white border border-warmDark-100/80 rounded-2xl overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 text-center"
              >
                <div className="relative aspect-square overflow-hidden bg-cream-200">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warmDark-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  {cat.badge && (
                    <span className="absolute top-2 right-2 bg-cream-50/90 text-warmDark-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-white">
                  <h3 className="font-extrabold text-warmDark-900 text-sm group-hover:text-terracotta-600 transition-colors line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-warmDark-500 mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </section>

      {/* 5. FEATURED FRAMES (PRODUCT GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Handcrafted Excellence</span>
            <h2 className="text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1 font-sans">
              Featured Frame Collections
            </h2>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {['All', 'Personalized', 'Collage', 'Couple', 'Baby', 'LED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab 
                    ? 'bg-warmDark-900 text-cream-50 shadow-sm' 
                    : 'bg-white text-warmDark-700 hover:bg-cream-200/60 border border-warmDark-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </motion.div>

      </section>

      {/* 6. FRAMEVISION AI FEATURE SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FrameVisionAI />
      </div>

      {/* 7. CUSTOM FRAME PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Simple 4-Step Journey</span>
          <h2 className="text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1 font-sans">
            How Custom Framing Works
          </h2>
          <p className="text-warmDark-600 text-sm mt-2">
            Create something unique for your home or loved ones in just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm hover:shadow-warm-md transition-all text-center relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cream-200 text-warmDark-900 font-black text-lg flex items-center justify-center mx-auto border border-warmDark-200">
              01
            </div>
            <h3 className="font-extrabold text-warmDark-900 text-base">Choose Frame</h3>
            <p className="text-xs text-warmDark-500 leading-relaxed">
              Select your favorite design from Classic Wood, LED Light, Acrylic, or Collage frames.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm hover:shadow-warm-md transition-all text-center relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-700 font-black text-lg flex items-center justify-center mx-auto border border-terracotta-200">
              02
            </div>
            <h3 className="font-extrabold text-warmDark-900 text-base">Upload Photo</h3>
            <p className="text-xs text-warmDark-500 leading-relaxed">
              Upload high-res photos directly from your phone, computer, or Instagram account.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm hover:shadow-warm-md transition-all text-center relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-lg flex items-center justify-center mx-auto border border-amber-200">
              03
            </div>
            <h3 className="font-extrabold text-warmDark-900 text-base">Customize & Preview</h3>
            <p className="text-xs text-warmDark-500 leading-relaxed">
              Adjust sizing, mats, crop area, and see instant 3D FrameVision AI previews.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm hover:shadow-warm-md transition-all text-center relative space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-lg flex items-center justify-center mx-auto border border-emerald-200">
              04
            </div>
            <h3 className="font-extrabold text-warmDark-900 text-base">Order & Delivery</h3>
            <p className="text-xs text-warmDark-500 leading-relaxed">
              We handcraft, UV glass protect, and safely deliver your frame straight to your doorstep.
            </p>
          </div>

        </div>

      </section>

      {/* 8. BEST SELLERS / TRENDING FRAMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Most Loved</span>
            <h2 className="text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1 font-sans">
              Best Sellers & Trending
            </h2>
          </div>
          <Link
            to="/products?sort=bestseller"
            className="text-xs font-bold text-warmDark-900 hover:text-terracotta-600 transition-colors flex items-center space-x-1"
          >
            <span>Explore All Trending</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {UPLOADED_PRODUCTS.slice(4, 10).map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </motion.div>

      </section>

      {/* 9. WHY CHOOSE FRAMEWALA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-warmDark-900 text-cream-100 rounded-3xl p-8 sm:p-12 border border-warmDark-800 shadow-warm-lg">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-terracotta-500">The FrameWala Promise</span>
            <h2 className="text-3xl font-extrabold text-cream-50 tracking-tight mt-1 font-sans">
              Why Choose FrameWala?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-terracotta-600/30 text-terracotta-500 flex items-center justify-center mx-auto sm:mx-0">
                <FiAward className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-cream-50 text-base">Premium Quality</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                Handcrafted from real teak & synthetic wood, with non-fading archival inks and crystal clear glass.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
                <FiGift className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-cream-50 text-base">Personalized Memories</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                Custom layouts, photo enhancements, and personalized text engravings tailored to your exact story.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-cream-50 text-base">Secure Packaging</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                3-layer protective bubble wrap & double-walled corrugated box guarantees zero transit breakage.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto sm:mx-0">
                <FiTruck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-cream-50 text-base">Fast Delivery</h3>
              <p className="text-xs text-cream-300/70 leading-relaxed">
                Quick production & dispatch through top tier courier partners across 18,000+ pincodes in India.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">Loved By Customers</span>
          <h2 className="text-3xl font-extrabold text-warmDark-900 tracking-tight mt-1 font-sans">
            Stories Framed With Love
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm space-y-4">
            <div className="flex items-center space-x-1 text-amber-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-current" />
              ))}
            </div>
            <p className="text-xs text-warmDark-700 italic leading-relaxed">
              "The wooden frame quality exceeded my expectations! The AI preview was exact and the print was so vibrant. My parents loved their anniversary gift!"
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-cream-200">
              <div className="w-9 h-9 rounded-full bg-terracotta-100 text-terracotta-700 font-extrabold text-xs flex items-center justify-center">
                RS
              </div>
              <div>
                <h4 className="text-xs font-bold text-warmDark-900">Rahul Sharma</h4>
                <p className="text-[10px] text-warmDark-500">Verified Buyer • Mumbai</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm space-y-4">
            <div className="flex items-center space-x-1 text-amber-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-current" />
              ))}
            </div>
            <p className="text-xs text-warmDark-700 italic leading-relaxed">
              "Ordered a collage frame for our wedding memories. Delivered within 3 days, perfectly wrapped in bubble layers without any scratch!"
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-cream-200">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">
                PD
              </div>
              <div>
                <h4 className="text-xs font-bold text-warmDark-900">Pooja Deshmukh</h4>
                <p className="text-[10px] text-warmDark-500">Verified Buyer • Pune</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-warmDark-100 shadow-warm-sm space-y-4">
            <div className="flex items-center space-x-1 text-amber-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-current" />
              ))}
            </div>
            <p className="text-xs text-warmDark-700 italic leading-relaxed">
              "The LED light frame creates such a mesmerizing warm mood in our living room. Truly worth every rupee! Will definitely order again."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-cream-200">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold text-warmDark-900">Amit Kapoor</h4>
                <p className="text-[10px] text-warmDark-500">Verified Buyer • Delhi</p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 11. NEWSLETTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-warmDark-900 text-white rounded-3xl p-8 sm:p-12 shadow-warm-lg flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="space-y-2 max-w-lg text-center md:text-left z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-amber-200">
              <FiGift className="w-3.5 h-3.5" />
              <span>Exclusive Member Discount</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Get 15% Off Your First Custom Frame
            </h2>
            <p className="text-cream-200/90 text-xs sm:text-sm">
              Subscribe to join the FrameWala family & receive insider discount codes, photo memory tips, and early sale access.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md space-y-2 z-10">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 bg-white text-warmDark-900 placeholder-warmDark-400 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-warmDark-950 font-extrabold text-xs rounded-full shadow-md transition-all duration-200 shrink-0"
              >
                Claim 15% OFF
              </button>
            </div>
            <p className="text-[10px] text-cream-300/60 text-center sm:text-left">No spam, ever. Unsubscribe at any time.</p>
          </form>

        </div>
      </section>

    </div>
  );
};

export default Home;
