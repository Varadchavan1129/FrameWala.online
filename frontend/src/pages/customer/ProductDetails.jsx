// ProductDetails.jsx — gallery, size/finish/qty options, Buy Now / Add to Cart, reviews.

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { getProductById, getProducts } from '../../services/productService.js';
import {
  FiHeart, FiShoppingCart, FiStar, FiChevronRight, FiChevronLeft, FiTruck,
  FiRefreshCw, FiShield, FiImage, FiCheckCircle, FiZap,
} from 'react-icons/fi';

const highlightIcon = { wood: FiCheckCircle, print: FiImage, glass: FiShield, clean: FiZap };

// Fallback constants since MySQL doesn't store these yet
const FINISHES = [
  { name: 'Dark Walnut', hex: '#4A2E1C' },
  { name: 'Natural Oak', hex: '#C8A06A' },
  { name: 'Matte White', hex: '#F3F0E9' },
  { name: 'Classic Black', hex: '#191512' }
];

const SIZES = [
  { label: '6 x 4 inch', delta: -100 },
  { label: '8 x 6 inch', delta: 0 },
  { label: '10 x 8 inch', delta: 200 }
];

const HIGHLIGHTS = [
  { icon: 'wood', title: 'Premium Wooden', desc: 'High quality wood' },
  { icon: 'print', title: 'High Definition Print', desc: 'Vibrant & long lasting' }
];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id);
        const productData = res?.data?.product || res?.product || res;
        if (!productData || (!productData.product_id && !productData.id)) {
          throw new Error('Product not found');
        }

        const rawPrice = parseFloat(productData.price) || 0;
        const mappedProduct = {
          ...productData,
          id: productData.product_id || productData.id,
          name: productData.product_name || productData.name || 'Photo Frame',
          subtitle: productData.description || '',
          category_name: productData.category_name || '',
          price: rawPrice,
          mrp: rawPrice * 1.2,
          rating: productData.average_rating && parseFloat(productData.average_rating) > 0 ? String(productData.average_rating) : '4.8',
          review_count: productData.total_reviews || 120,
          primary_image: productData.images?.find(img => img.is_primary)?.image_url || productData.images?.[0]?.image_url || productData.primary_image || '/images/products/product_01.jpg',
          images: (productData.images && productData.images.length > 0)
            ? productData.images.map(img => typeof img === 'string' ? img : img.image_url)
            : [productData.primary_image || '/images/products/product_01.jpg'],
          sizes: SIZES,
          finishes: FINISHES,
          highlights: HIGHLIGHTS
        };

        if (isMounted) {
          setProduct(mappedProduct);
        }

        // Fetch related products
        try {
          const allRes = await getProducts();
          const allProducts = allRes?.data?.products || allRes?.products || [];
          if (isMounted) {
            setRelated(allProducts.slice(0, 4).map(p => ({
              ...p,
              id: p.product_id || p.id,
              name: p.product_name || p.name,
              primary_image: p.primary_image || '/images/products/product_01.jpg',
              price: parseFloat(p.price) || 0,
              mrp: (parseFloat(p.price) || 0) * 1.2,
              rating: '4.8',
              review_count: 120,
            })));
          }
        } catch (relatedErr) {
          console.error('Failed to load related products', relatedErr);
        }
      } catch (err) {
        console.error('Failed to load product', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }
    return () => { isMounted = false; };
  }, [id]);

  const reviews = useMemo(() => {
    if (!product) return [];
    return [
      { id: 1, name: 'Rahul Sharma', rating: 5, date: '12 Sep 2026', text: 'Excellent frame quality!' },
      { id: 2, name: 'Pooja Deshmukh', rating: 4, date: '10 Sep 2026', text: 'Beautiful finish.' }
    ];
  }, [product]);

  const [imgIndex, setImgIndex] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [finishIdx, setFinishIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const price = product ? (product.price || 0) + (product.sizes?.[sizeIdx]?.delta || 0) : 0;
  const favorited = product ? isInWishlist(product.id) : false;
  const options = () => product ? { price, size: product.sizes?.[sizeIdx]?.label, finish: product.finishes?.[finishIdx]?.name, image: product.primary_image } : {};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] pb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-warmDark-500 font-semibold">Product not found.</p>
        <Link to="/products" className="inline-block px-6 py-3 bg-brand-600 text-cream-50 rounded-full font-bold text-sm">Back to Shop</Link>
      </div>
    );
  }

  const handleAdd = async () => {
    await addToCart(product, qty, options());
  };
  const handleBuyNow = async () => {
    const success = await addToCart(product, qty, options());
    if (success) {
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      <nav className="flex items-center gap-2 text-xs font-semibold text-warmDark-400">
        <Link to="/" className="hover:text-brand-600">Home</Link><FiChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-brand-600">Photo Frames</Link><FiChevronRight className="w-3 h-3" />
        <span className="text-warmDark-800 truncate max-w-[160px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-cream-200/50 rounded-3xl overflow-hidden border border-warmDark-100/60">
            {product.badge && <span className="absolute top-4 left-4 z-10 bg-brand-700 text-cream-50 text-[11px] font-bold px-3 py-1 rounded-full">{product.badge}</span>}
            <button onClick={() => toggleWishlist(product)} className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${favorited ? 'bg-red-50 text-red-500' : 'bg-white text-warmDark-600'}`} data-testid="pdp-wishlist">
              <FiHeart className={`w-4.5 h-4.5 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <motion.img key={imgIndex} initial={{ opacity: 0.4, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
              src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" data-testid="pdp-main-image" />
            <button onClick={() => setImgIndex((i) => (i - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"><FiChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setImgIndex((i) => (i + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"><FiChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setImgIndex(i)} className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${imgIndex === i ? 'border-brand-600' : 'border-warmDark-100 hover:border-warmDark-300'}`} data-testid={`pdp-thumb-${i}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold text-warmDark-900 tracking-tight">{product.name}</h1>
          <p className="text-warmDark-600 text-sm">{product.subtitle}</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 bg-brand-600 text-cream-50 px-2 py-0.5 rounded-md font-bold text-xs"><FiStar className="w-3 h-3 fill-current" /> {product.rating}</span>
            <span className="text-warmDark-500">({product.review_count}) Ratings</span>
          </div>

          <div className="border-t border-cream-200 pt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-warmDark-900">{formatINR(price)}</span>
              <span className="text-warmDark-400 line-through">{formatINR(product.mrp + product.sizes[sizeIdx].delta)}</span>
            </div>
            <p className="text-xs text-warmDark-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-warmDark-900">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s, i) => (
                <button key={s.label} onClick={() => setSizeIdx(i)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${sizeIdx === i ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-warmDark-100 text-warmDark-700 hover:border-warmDark-300'}`} data-testid={`size-${i}`}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* Finish */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-warmDark-900">Finish</p>
            <div className="flex flex-wrap gap-3">
              {product.finishes.map((f, i) => (
                <button key={f.name} onClick={() => setFinishIdx(i)} title={f.name} className={`w-9 h-9 rounded-full border-2 transition-all ${finishIdx === i ? 'ring-2 ring-brand-600 ring-offset-2 border-white' : 'border-white shadow'}`} style={{ backgroundColor: f.hex }} data-testid={`finish-${i}`} />
              ))}
            </div>
            <p className="text-xs text-warmDark-500">Selected: {product.finishes[finishIdx].name}</p>
          </div>

          {/* Customize box */}
          <div className="flex items-center justify-between gap-4 bg-cream-100 border border-warmDark-100/60 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white text-brand-700 flex items-center justify-center border border-warmDark-100"><FiImage className="w-5 h-5" /></div>
              <div><p className="text-sm font-bold text-warmDark-900">Make it personal!</p><p className="text-xs text-warmDark-500">Add your photo and see how it looks.</p></div>
            </div>
            <Link to="/custom-frame" className="px-4 py-2 border-2 border-brand-600 text-brand-700 rounded-full text-xs font-bold hover:bg-brand-600 hover:text-cream-50 transition-colors shrink-0" data-testid="pdp-customize">Customize Now</Link>
          </div>

          {/* Qty + actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-cream-100 rounded-full border border-warmDark-100">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-warmDark-700 text-lg" data-testid="qty-minus">−</button>
              <span className="w-8 text-center font-bold" data-testid="qty-value">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-warmDark-700 text-lg" data-testid="qty-plus">+</button>
            </div>
            {product.stock <= 15 && <p className="text-xs text-terracotta-600 font-bold">Only {product.stock} left! Hurry up</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleBuyNow} className="py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm shadow-warm-md transition-all active:scale-95" data-testid="buy-now">Buy Now</button>
            <button onClick={handleAdd} className="py-3.5 bg-white border-2 border-warmDark-900 text-warmDark-900 hover:bg-warmDark-900 hover:text-cream-50 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2" data-testid="add-to-cart"><FiShoppingCart className="w-4 h-4" /> Add to Cart</button>
          </div>

          {/* Delivery badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-cream-200 pt-5">
            {[{ icon: FiTruck, t: 'Free Delivery', d: 'Above ₹999' }, { icon: FiRefreshCw, t: '7 Days Return', d: 'Easy returns' }, { icon: FiShield, t: 'Secure Payment', d: '100% protected' }].map((b, i) => (
              <div key={i} className="flex items-center gap-2"><b.icon className="w-5 h-5 text-brand-600 shrink-0" /><div><p className="text-[11px] font-bold text-warmDark-900 leading-tight">{b.t}</p><p className="text-[10px] text-warmDark-500">{b.d}</p></div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <section>
        <h2 className="text-xl font-extrabold text-warmDark-900 mb-4">Product Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.highlights.map((h, i) => {
            const Icon = highlightIcon[h.icon] || FiCheckCircle;
            return (
              <div key={i} className="flex items-center gap-3 bg-white border border-warmDark-100/60 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-brand-700 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                <div><p className="text-sm font-bold text-warmDark-900">{h.title}</p><p className="text-xs text-warmDark-500">{h.desc}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Description + Reviews */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-extrabold text-warmDark-900">Description</h2>
          <p className="text-warmDark-600 text-sm leading-relaxed">{product.description}</p>
          <h3 className="text-lg font-extrabold text-warmDark-900 pt-4">Customer Reviews</h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border border-warmDark-100/60 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-warmDark-900 text-sm">{r.name}</span>
                  <span className="text-[11px] text-warmDark-400">{r.date}</span>
                </div>
                <div className="flex text-gold-400">{[1, 2, 3, 4, 5].map((s) => <FiStar key={s} className={`w-3.5 h-3.5 ${r.rating >= s ? 'fill-current' : 'text-warmDark-200'}`} />)}</div>
                <p className="text-warmDark-600 text-sm">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-cream-100 border border-warmDark-100/60 rounded-2xl p-6 h-fit text-center space-y-2">
          <p className="text-5xl font-extrabold text-warmDark-900">{product.rating}</p>
          <div className="flex justify-center text-gold-400">{[1, 2, 3, 4, 5].map((s) => <FiStar key={s} className={`w-5 h-5 ${product.rating >= s ? 'fill-current' : 'text-warmDark-200'}`} />)}</div>
          <p className="text-sm text-warmDark-500">Based on {product.review_count} reviews</p>
        </div>
      </section>

      {/* Related */}
      <section>
        <h2 className="text-xl font-extrabold text-warmDark-900 mb-5">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
