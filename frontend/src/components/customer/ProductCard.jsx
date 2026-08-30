// ProductCard.jsx
// Premium photo frame product card component with Framer Motion animations and warm cream aesthetic

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { FiHeart, FiShoppingCart, FiStar, FiGift, FiEye } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const productId = product.product_id || product.id;
  const isFavorited = isInWishlist(productId);
  const outOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white border border-warmDark-100/70 rounded-2xl overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* 1. Image Container with Hover Zoom */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full bg-cream-200/50 overflow-hidden">
        <img
          src={product.primary_image || product.image || '/images/products/product_01.jpg'}
          alt={product.product_name || product.title}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-warmDark-900 text-cream-50 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border border-warmDark-700/50">
              {product.badge}
            </span>
          )}
          {product.is_customizable && !product.badge && (
            <span className="bg-terracotta-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
              <FiGift className="w-3 h-3 text-amber-300 animate-bounce" />
              <span>AI Frame</span>
            </span>
          )}
        </div>

        {/* Favorite Wishlist Icon Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all duration-300 z-10 focus:outline-none ${
            isFavorited 
              ? 'bg-red-50 text-red-600 border border-red-200 scale-110' 
              : 'bg-white/90 text-warmDark-700 hover:text-red-500 hover:bg-white hover:scale-110'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <FiHeart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-warmDark-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <Link
            to={`/product/${productId}`}
            className="pointer-events-auto px-4 py-2 bg-cream-50/95 hover:bg-cream-50 text-warmDark-900 font-bold text-xs rounded-full shadow-lg flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </Link>
        </div>

        {/* Stock status overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-warmDark-900/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-red-600 text-white font-extrabold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-terracotta-600 uppercase tracking-wider line-clamp-1">
            {product.category_name || 'FrameWala Classic'}
          </span>
          <div className="flex items-center space-x-1 text-amber-500 text-xs shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
            <FiStar className="w-3 h-3 fill-current" />
            <span className="font-extrabold text-warmDark-900 text-[11px]">
              {product.rating || '4.9'}
            </span>
            <span className="text-warmDark-500 text-[10px]">
              ({product.review_count || product.reviews || 128})
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Link 
          to={`/product/${productId}`} 
          className="text-warmDark-900 font-extrabold text-sm sm:text-base line-clamp-1 hover:text-terracotta-600 transition-colors mb-1.5"
        >
          {product.product_name || product.title}
        </Link>
        
        {/* Short Subtitle / Description */}
        <p className="text-warmDark-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.subtitle || product.description || 'High quality wooden frame designed to protect and showcase your special memories.'}
        </p>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-cream-200">
          <div className="flex flex-col">
            <span className="text-xs text-warmDark-500 line-through leading-none">
              ₹{Math.round(parseFloat(product.price || 799) * 1.25)}
            </span>
            <span className="text-warmDark-900 font-extrabold text-base sm:text-lg leading-tight mt-0.5">
              ₹{parseFloat(product.price || 599).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="px-3.5 py-2 bg-warmDark-900 hover:bg-terracotta-600 text-cream-50 rounded-xl transition-all duration-200 active:scale-95 flex items-center space-x-1.5 font-bold text-xs shadow-sm hover:shadow-warm-md disabled:opacity-50 disabled:pointer-events-none"
            title="Add to cart"
          >
            <FiShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>

    </motion.div>
  );
};

export default ProductCard;
