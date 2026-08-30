// ProductCard.jsx
// Premium frame product card matching the FrameWala reference (best seller / grid).

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { formatINR } from '../../data/mockData.js';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const favorited = isInWishlist(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, { size: product.sizes?.[1]?.label, finish: product.finishes?.[0]?.name });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -6 }}
      className="group relative bg-white border border-warmDark-100/70 rounded-2xl overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-shadow duration-300 flex flex-col h-full"
      data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="relative block aspect-square bg-cream-200/50 overflow-hidden">
        <img src={product.primary_image} alt={product.name} loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-brand-700 text-cream-50 font-bold text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </span>
        )}
        <button onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${favorited ? 'bg-red-50 text-red-500' : 'bg-white/95 text-warmDark-600 hover:text-red-500'}`}
          data-testid={`wishlist-btn-${product.id}`} aria-label="Toggle wishlist">
          <FiHeart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="font-extrabold text-warmDark-900 text-sm sm:text-[15px] leading-snug hover:text-brand-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <p className="text-warmDark-500 text-xs mt-1 line-clamp-1">{product.subtitle}</p>

        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <FiStar className="w-3.5 h-3.5 text-gold-400 fill-current" />
          <span className="font-bold text-warmDark-800">{product.rating}</span>
          <span className="text-warmDark-400">({product.review_count})</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-warmDark-900 font-extrabold text-lg">{formatINR(product.price)}</span>
            <span className="text-warmDark-400 text-xs line-through">{formatINR(product.mrp)}</span>
          </div>
          <button onClick={handleAdd}
            className="w-10 h-10 rounded-xl bg-gold-100 hover:bg-brand-600 text-brand-700 hover:text-cream-50 flex items-center justify-center transition-all active:scale-95"
            data-testid={`add-cart-btn-${product.id}`} aria-label="Add to cart">
            <FiShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
