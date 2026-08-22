// Wishlist.jsx
// Wishlist favorites items page

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import ProductCard from '../../components/customer/ProductCard.jsx';
import Button from '../../components/common/Button.jsx';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlistItems } = useContext(WishlistContext);

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <FiHeart className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-800">Your Wishlist is Empty</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Save custom frames, personalized keychains, and photo mugs that catch your eye. Tap the heart on products to save them here.
          </p>
        </div>
        <Link to="/products" className="block">
          <Button className="w-full text-xs font-bold py-3">Find Products</Button>
        </Link>
      </div>
    );
  }

  // Format wishlist item to look exactly like standard product object
  const products = wishlistItems.map((item) => ({
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    stock_quantity: item.stock_quantity,
    is_customizable: item.is_customizable,
    primary_image: item.primary_image
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Wishlist</h1>
        <p className="text-slate-400 text-sm mt-1">Keep track of customized products you love and plan to purchase.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <ProductCard key={prod.product_id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
