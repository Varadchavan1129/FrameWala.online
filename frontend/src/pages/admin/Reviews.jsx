// Reviews.jsx
// Admin ratings and reviews moderation panel

import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/productService.js';
import { getProductReviews } from '../../services/reviewService.js';
import Loader from '../../components/common/Loader.jsx';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    loadProductsList();
  }, []);

  const loadProductsList = async () => {
    try {
      setLoadingProducts(true);
      const res = await getProducts();
      if (res.success) {
        setProducts(res.data.products);
        if (res.data.products.length > 0) {
          setSelectedProductId(res.data.products[0].product_id.toString());
        }
      }
    } catch (error) {
      toast.error('Failed to load products list.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      loadReviews(selectedProductId);
    }
  }, [selectedProductId]);

  const loadReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      const res = await getProductReviews(productId);
      if (res.success) {
        setReviews(res.data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleModerate = () => {
    // In a real app, delete review. Here we mock it.
    toast.success('Review has been moderated successfully (mocked).');
  };

  if (loadingProducts) return <Loader />;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reviews Moderation</h2>
          <p className="text-slate-400 text-xs font-semibold">Track rating comments and moderate customer reviews</p>
        </div>

        {/* Product selector dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold text-slate-400">Select Product</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
          >
            {products.map((prod) => (
              <option key={prod.product_id} value={prod.product_id}>
                {prod.product_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews list logs */}
      {loadingReviews ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FiMessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">No Reviews Registered</h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto">This product doesn't have any rating reviews posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div 
              key={rev.review_id}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-extrabold text-slate-800 text-sm">{rev.first_name} {rev.last_name}</span>
                  <span className="text-slate-400">{new Date(rev.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                
                {/* Stars */}
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className={`w-3.5 h-3.5 ${rev.rating >= star ? 'fill-current' : ''}`} />
                  ))}
                </div>

                <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">{rev.review || 'No written text review.'}</p>
              </div>

              {/* Moderate Option */}
              <button
                onClick={handleModerate}
                className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[10px] uppercase font-bold rounded-lg transition-colors focus:outline-none"
              >
                Moderate
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Reviews;
