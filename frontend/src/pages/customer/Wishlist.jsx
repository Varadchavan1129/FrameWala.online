// Wishlist.jsx — saved products grid.

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import ProductCard from '../../components/customer/ProductCard.jsx';
import { getProductById } from '../../data/mockData.js';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlistItems } = useContext(WishlistContext);
  const products = wishlistItems.map((i) => getProductById(i.id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto"><FiHeart className="w-9 h-9" /></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-warmDark-900">Your Wishlist is Empty</h2>
          <p className="text-warmDark-500 text-sm">Tap the heart on any frame to save it here for later.</p>
        </div>
        <Link to="/products" className="inline-block px-8 py-3.5 bg-brand-600 text-cream-50 rounded-full font-bold text-sm">Find Frames</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-warmDark-900">Your Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export default Wishlist;
