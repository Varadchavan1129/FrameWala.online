// ProductCard.jsx
// Grid view item card for products

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import { FiHeart, FiShoppingCart, FiGift } from 'react-icons/fi';
import Button from '../common/Button.jsx';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const isFavorited = isInWishlist(product.product_id);
  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-200/60 transition-all duration-300 flex flex-col h-full hover-scale">
      
      {/* Product Image Section */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={product.primary_image || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.product_name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Icon */}
        <button
          onClick={() => toggleWishlist(product.product_id)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 focus:outline-none ${
            isFavorited 
              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
              : 'bg-white/90 text-slate-500 hover:text-red-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Customization Badge */}
        {product.is_customizable ? (
          <span className="absolute bottom-3 left-3 bg-amber-500 text-white font-bold tracking-wide uppercase text-[9px] px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1 border border-amber-400">
            <FiGift className="w-3.5 h-3.5" />
            <span>Customize</span>
          </span>
        ) : null}

        {/* Stock status badge */}
        {outOfStock ? (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-extrabold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-md">
              Out of Stock
            </span>
          </div>
        ) : product.stock_quantity <= 5 ? (
          <span className="absolute top-3 left-3 bg-red-100 border border-red-200 text-red-700 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded">
            Only {product.stock_quantity} left
          </span>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
          {product.category_name}
        </span>
        <Link 
          to={`/product/${product.product_id}`} 
          className="text-slate-800 font-bold text-sm line-clamp-1 hover:text-indigo-600 transition-colors mb-2 block"
        >
          {product.product_name}
        </Link>
        
        {/* Description Snippet */}
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description || 'No description available.'}
        </p>

        {/* Price & Cart Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <span className="text-slate-800 font-extrabold text-base">
            ₹{parseFloat(product.price).toLocaleString('en-IN')}
          </span>

          <div className="flex space-x-2">
            <Link 
              to={`/product/${product.product_id}`}
              className="px-3.5 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition-colors duration-200 active:scale-95"
            >
              Details
            </Link>
            {!outOfStock && (
              <button
                onClick={() => addToCart(product.product_id, 1)}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 active:scale-95 flex items-center justify-center"
                title="Add to cart"
              >
                <FiShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
