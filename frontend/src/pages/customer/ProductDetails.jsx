// ProductDetails.jsx
// Redesigned photo frame detail view with SKU, real reviews list, sizes, and finish selector.

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { CustomerAuthContext as AuthContext } from '../../context/CustomerAuthContext.jsx';
import { FRAME_COLORS, SIZES as CONST_SIZES, HIGHLIGHTS, resolveFrameColor } from '../../constants/productConstants.js';
import { formatINR } from '../../utils/formatters.js';
import { getProductById, getProducts } from '../../services/productService.js';
import { getProductReviews, createReview } from '../../services/reviewService.js';
import toast from 'react-hot-toast';
import {
  FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield,
  FiChevronLeft, FiChevronRight, FiCheck, FiRefreshCw, FiImage, FiAward
} from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        const productData = res?.data?.product || res?.product || res;

        if (!productData || (!productData.product_id && !productData.id)) {
          if (isMounted) setLoading(false);
          return;
        }

        const rawPrice = parseFloat(productData.price) || 0;
        const pId = productData.product_id || productData.id;
        const mappedProduct = {
          ...productData,
          id: pId,
          product_code: productData.product_code || `FW-FRM-${String(pId).padStart(4, '0')}`,
          name: productData.product_name || productData.name || 'Photo Frame',
          subtitle: productData.description || '',
          category_name: productData.category_name || (productData.categories?.category_name || 'Photo Frames'),
          price: rawPrice,
          mrp: parseFloat(productData.mrp) || Math.round(rawPrice * 1.25),
          primary_image: productData.images?.find(img => img.is_primary)?.image_url || productData.images?.[0]?.image_url || productData.primary_image || '/images/products/product_01.jpg',
          images: (productData.images && productData.images.length > 0)
            ? productData.images.map(img => typeof img === 'string' ? img : img.image_url)
            : [productData.primary_image || '/images/products/product_01.jpg'],
          sizes: (productData.sizes && productData.sizes.length > 0) ? productData.sizes : CONST_SIZES,
          finishes: (productData.finishes && productData.finishes.length > 0) ? productData.finishes.map(f => resolveFrameColor(f)) : FRAME_COLORS,
          highlights: HIGHLIGHTS
        };

        if (isMounted) {
          setProduct(mappedProduct);
          setImgIndex(0);
        }

        // Fetch related products
        try {
          const allRes = await getProducts();
          const allProducts = allRes?.data?.products || allRes?.products || [];
          if (isMounted) {
            setRelated(allProducts
              .filter(p => (p.product_id || p.id) !== pId)
              .slice(0, 4)
              .map(p => ({
                ...p,
                id: p.product_id || p.id,
                name: p.product_name || p.name,
                primary_image: p.primary_image || '/images/products/product_01.jpg',
                product_code: p.product_code || `FW-FRM-${String(p.product_id || p.id).padStart(4, '0')}`,
                price: parseFloat(p.price) || 0,
                mrp: (parseFloat(p.price) || 0) * 1.25,
              }))
            );
          }
        } catch (err) {
          console.error('Failed to load related products', err);
        }

        // Fetch real reviews
        try {
          const revRes = await getProductReviews(pId);
          const revList = revRes?.data?.reviews || revRes?.reviews || (Array.isArray(revRes) ? revRes : []);
          if (isMounted) {
            setReviews(revList);
          }
        } catch (err) {
          console.error('Failed to load reviews', err);
        }

      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-700"></div>
        <p className="text-xs font-bold text-warmDark-500 uppercase tracking-wider">Loading Frame Specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <p className="text-4xl">🖼️</p>
        <h2 className="text-xl font-bold text-warmDark-900">Photo Frame Not Found</h2>
        <p className="text-xs text-warmDark-500">The frame you are looking for may have been retired or moved.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-brand-700 text-cream-50 font-bold rounded-full text-xs">
          Browse Active Catalog
        </Link>
      </div>
    );
  }

  const pId = product.id || product.product_id;
  const favorited = isInWishlist(pId);
  const activeSizes = product.sizes || CONST_SIZES;
  const activeFinishes = product.finishes || FRAME_COLORS;
  const currentSize = activeSizes[selectedSize] || activeSizes[0];
  const currentFinish = activeFinishes[selectedFinish] || activeFinishes[0];

  const basePrice = Number(product.price) || 0;
  const unitPrice = basePrice + (currentSize?.delta || 0);
  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    addToCart(product, qty, {
      price: unitPrice,
      size: currentSize?.label,
      finish: currentFinish?.name,
      color: currentFinish?.name,
    });
    toast.success(`Added ${product.name} (${currentSize?.label}) to cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a verified frame review.');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please share a few words about your experience with this frame.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await createReview({
        product_id: pId,
        rating: newRating,
        review: newComment.trim(),
      });
      toast.success('Thank you for reviewing this frame!');
      setNewComment('');
      // Refresh reviews
      const updated = await getProductReviews(pId);
      setReviews(updated?.data?.reviews || updated?.reviews || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-warmDark-400 font-medium">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-700">Photo Frames</Link>
        <span>/</span>
        <span className="text-warmDark-800 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square bg-cream-100 rounded-3xl overflow-hidden border border-warmDark-100/80 shadow-warm-md">
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                favorited ? 'bg-red-50 text-red-500' : 'bg-white/90 text-warmDark-600 hover:text-red-500'
              }`}
              data-testid="pdp-wishlist"
              aria-label="Wishlist frame"
            >
              <FiHeart className={`w-4.5 h-4.5 ${favorited ? 'fill-current' : ''}`} />
            </button>

            {/* Product Code Badge */}
            <span className="absolute top-4 left-4 z-10 bg-warmDark-900/90 backdrop-blur text-cream-50 font-mono font-bold text-xs px-3 py-1 rounded-md shadow border border-warmDark-700/60">
              {product.product_code}
            </span>

            <motion.img
              key={imgIndex}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images[imgIndex] || '/images/products/product_01.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="pdp-main-image"
              onError={(e) => {
                if (!e.currentTarget.dataset.errored) {
                  e.currentTarget.dataset.errored = "1";
                  e.currentTarget.src = '/images/products/product_01.jpg';
                }
              }}
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-warmDark-800 transition-all"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-warmDark-800 transition-all"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    imgIndex === i ? 'border-brand-700 ring-2 ring-brand-100' : 'border-warmDark-100 hover:border-warmDark-300'
                  }`}
                  data-testid={`pdp-thumb-${i}`}
                >
                  <img
                    src={img || '/images/products/product_01.jpg'}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.errored) {
                        e.currentTarget.dataset.errored = "1";
                        e.currentTarget.src = '/images/products/product_01.jpg';
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Add-to-Cart */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
                {product.category_name}
              </span>
              <span className="text-warmDark-300">•</span>
              <span className="font-mono text-xs text-warmDark-500 font-semibold">{product.product_code}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-warmDark-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-warmDark-600 text-sm mt-2 leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* Genuine Review Summary */}
          <div className="flex items-center gap-3 py-2 border-y border-cream-200 text-xs">
            {averageRating ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-gold-100 text-brand-900 px-2 py-0.5 rounded font-extrabold">
                  <FiStar className="w-3.5 h-3.5 text-gold-500 fill-current" />
                  <span>{averageRating}</span>
                </div>
                <span className="text-warmDark-600 font-semibold">({reviews.length} customer ratings)</span>
              </div>
            ) : (
              <span className="text-warmDark-400 font-medium italic">No reviews yet — Be the first to review!</span>
            )}
            <span className="text-warmDark-300">•</span>
            <span className="text-brand-700 font-bold">In Stock & Ready to Ship</span>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-warmDark-900">{formatINR(unitPrice)}</span>
              {product.mrp > unitPrice && (
                <span className="text-base text-warmDark-400 line-through">{formatINR(product.mrp)}</span>
              )}
              <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                Inclusive of GST
              </span>
            </div>
            <p className="text-[11px] text-warmDark-500">Free courier delivery on orders above ₹999</p>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-warmDark-800 uppercase tracking-wide">Select Frame Size:</span>
              <span className="text-brand-700 font-bold">{currentSize?.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {activeSizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(i)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    selectedSize === i
                      ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-600'
                      : 'border-warmDark-200 bg-white text-warmDark-700 hover:border-warmDark-400'
                  }`}
                >
                  <p>{s.label}</p>
                  {s.delta !== 0 && (
                    <p className="text-[10px] text-warmDark-400 mt-0.5">
                      {s.delta > 0 ? `+₹${s.delta}` : `-₹${Math.abs(s.delta)}`}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Finish / Colour Selector */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-warmDark-800 uppercase tracking-wide">Frame Moulding Finish:</span>
              <span className="text-brand-700 font-bold">{currentFinish?.name}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {activeFinishes.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFinish(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedFinish === i
                      ? 'border-brand-700 bg-brand-50 text-brand-900 shadow-sm'
                      : 'border-warmDark-200 bg-white text-warmDark-700 hover:border-warmDark-400'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: f.hex }}></span>
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-warmDark-200 bg-white rounded-xl">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-warmDark-600 hover:text-brand-700 font-bold"
                >
                  -
                </button>
                <span className="px-3 font-extrabold text-sm text-warmDark-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-warmDark-600 hover:text-brand-700 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-brand-700 hover:bg-brand-800 text-cream-50 font-extrabold text-sm rounded-xl shadow-warm-md hover:shadow-warm-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FiShoppingCart className="w-4 h-4" /> Add to Cart — {formatINR(totalPrice)}
              </button>
            </div>

            {product.is_customizable && (
              <Link
                to="/custom-frame"
                className="w-full block text-center py-2.5 border border-brand-700 text-brand-800 hover:bg-brand-50 font-bold text-xs rounded-xl transition-colors"
              >
                Open in Custom Frame Studio with Photo Upload →
              </Link>
            )}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cream-200 text-xs">
            <div className="flex items-center gap-2 text-warmDark-700">
              <FiTruck className="w-4 h-4 text-brand-700 shrink-0" />
              <span>Safe multi-layer packaging</span>
            </div>
            <div className="flex items-center gap-2 text-warmDark-700">
              <FiShield className="w-4 h-4 text-brand-700 shrink-0" />
              <span>Transit breakage replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <section className="bg-white rounded-3xl border border-warmDark-100 p-8">
        <h2 className="text-xl font-extrabold text-warmDark-900 mb-6">Specifications & Craft Details</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((h, i) => (
            <div key={i} className="space-y-1.5 p-4 rounded-xl bg-cream-50 border border-warmDark-100/60">
              <FiAward className="w-5 h-5 text-brand-700" />
              <p className="font-extrabold text-sm text-warmDark-900">{h.title}</p>
              <p className="text-xs text-warmDark-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real Reviews Section */}
      <section className="bg-cream-100/60 rounded-3xl border border-warmDark-100/80 p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-warmDark-900">Verified Customer Reviews</h2>
            <p className="text-xs text-warmDark-500 mt-0.5">
              Authentic feedback from FrameWala customers
            </p>
          </div>
          {averageRating && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-warmDark-100 shadow-sm">
              <FiStar className="w-5 h-5 text-gold-400 fill-current" />
              <span className="text-xl font-extrabold text-warmDark-900">{averageRating}</span>
              <span className="text-xs text-warmDark-400">/ 5.0</span>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-warmDark-100/60 space-y-2">
            <p className="text-2xl">✨</p>
            <p className="font-bold text-sm text-warmDark-800">No reviews yet for this photo frame.</p>
            <p className="text-xs text-warmDark-500 max-w-sm mx-auto">
              Be the first to share your thoughts once you receive and hang your frame!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={r.review_id || i} className="bg-white p-5 rounded-2xl border border-warmDark-100/60 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs">
                      {r.users?.first_name ? r.users.first_name[0] : 'U'}
                    </div>
                    <span className="text-xs font-bold text-warmDark-900">
                      {r.users?.first_name ? `${r.users.first_name} ${r.users.last_name || ''}` : 'Verified Customer'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <FiStar
                        key={s}
                        className={`w-3.5 h-3.5 ${s < (r.rating || 5) ? 'text-gold-400 fill-current' : 'text-warmDark-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-warmDark-700 leading-relaxed">{r.review}</p>
                <p className="text-[10px] text-warmDark-400">
                  {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review Form */}
        <div className="bg-white rounded-2xl p-6 border border-warmDark-100/70 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-warmDark-900">Write a Review for {product.name}</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-warmDark-600 block mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <FiStar
                      className={`w-6 h-6 ${star <= newRating ? 'text-gold-400 fill-current' : 'text-warmDark-200'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-warmDark-600 block mb-1">Your Experience / Feedback</label>
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="How does the frame look on your wall? How was the wood and glass quality?"
                className="w-full text-xs p-3 border border-warmDark-200 rounded-xl focus:outline-none focus:border-brand-600"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-cream-50 font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              {submittingReview ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </form>
        </div>
      </section>

      {/* Related Frames */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">More Inspiration</span>
              <h2 className="text-2xl font-extrabold text-warmDark-900 tracking-tight mt-0.5">Related Photo Frames</h2>
            </div>
            <Link to="/products" className="text-xs font-bold text-brand-700 hover:text-brand-900">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group bg-white border border-warmDark-100 rounded-2xl p-3 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-cream-100 mb-2.5 relative">
                  <img
                    src={p.primary_image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = '/images/products/product_01.jpg'; }}
                  />
                  <span className="absolute top-2 left-2 bg-warmDark-900/80 text-cream-50 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                    {p.product_code}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-warmDark-900 line-clamp-1 group-hover:text-brand-700 transition-colors">
                  {p.name}
                </h4>
                <p className="text-xs font-extrabold text-brand-700 mt-1">{formatINR(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
