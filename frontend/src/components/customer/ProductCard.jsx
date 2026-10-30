// ProductCard.jsx
// Premium frame product card with SKU display, real image fallback, and genuine rating indicators.

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { formatINR } from '../../utils/formatters.js';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const favorited = isInWishlist(product.id || product.product_id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, { size: product.sizes?.[1]?.label || '8 x 6 inch', finish: product.finishes?.[0]?.name || 'Classic Black' });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const productId = product.id || product.product_id;
  const productCode = product.product_code || `FW-FRM-${String(productId).padStart(4, '0')}`;
  const price = Number(product.price) || 0;
  const mrp = Number(product.mrp) || Math.round(price * 1.25);
  const rating = product.rating ? Number(product.rating) : null;
  const reviewCount = Number(product.review_count) || 0;

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -6 }}
      className="group relative bg-white border border-warmDark-100/70 rounded-2xl overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col h-full"
      data-testid={`product-card-${productId}`}>
      <Link to={`/product/${productId}`} className="relative block aspect-square bg-cream-100 overflow-hidden">
        <img
          src={product.primary_image || '/images/products/product_01.jpg'}
          alt={product.name || product.product_name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            if (!e.currentTarget.dataset.errored) {
              e.currentTarget.dataset.errored = "1";
              e.currentTarget.src = '/images/products/product_01.jpg';
            }
          }}
        />

        {/* Product Code Badge */}
        <span className="absolute top-3 left-3 bg-warmDark-900/85 backdrop-blur text-cream-50 font-mono font-bold text-[10px] tracking-wider px-2 py-0.5 rounded-md shadow-sm border border-warmDark-700/50">
          {productCode}
        </span>

        {/* Customization Available Tag */}
        {product.is_customizable && (
          <span className="absolute bottom-3 left-3 bg-brand-700/90 backdrop-blur text-cream-50 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
            Customizable
          </span>
        )}

        <button onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${favorited ? 'bg-red-50 text-red-500' : 'bg-white/95 text-warmDark-600 hover:text-red-500'}`}
          data-testid={`wishlist-btn-${productId}`} aria-label="Toggle wishlist">
          <FiHeart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-[11px] font-bold text-brand-700 uppercase tracking-wider mb-1 truncate">
          {product.category_name || 'Photo Frame'}
        </div>

        <Link to={`/product/${productId}`} className="font-extrabold text-warmDark-900 text-sm sm:text-[15px] leading-snug hover:text-brand-600 transition-colors line-clamp-1">
          {product.name || product.product_name}
        </Link>
        <p className="text-warmDark-500 text-xs mt-1 line-clamp-2 leading-relaxed flex-1">
          {product.subtitle || product.description}
        </p>

        {/* Real Review Rating / Clean Initial State */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs">
          {rating && reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-1 bg-gold-50 text-gold-700 border border-gold-200/60 px-1.5 py-0.5 rounded font-extrabold text-[11px]">
                <FiStar className="w-3 h-3 text-gold-500 fill-current" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <span className="text-warmDark-400 font-medium">({reviewCount} reviews)</span>
            </>
          ) : (
            <span className="text-warmDark-400 text-[11px] font-medium italic">No reviews yet</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-cream-200/60">
          <div className="flex items-baseline gap-2">
            <span className="text-warmDark-900 font-extrabold text-base sm:text-lg">{formatINR(price)}</span>
            {mrp > price && (
              <span className="text-warmDark-400 text-xs line-through">{formatINR(mrp)}</span>
            )}
          </div>
          <button onClick={handleAdd}
            className="w-10 h-10 rounded-xl bg-gold-100 hover:bg-brand-600 text-brand-700 hover:text-cream-50 flex items-center justify-center transition-all active:scale-95 shadow-sm"
            data-testid={`add-cart-btn-${productId}`} aria-label="Add frame to cart">
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
