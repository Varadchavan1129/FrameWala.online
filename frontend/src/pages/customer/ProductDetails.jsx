// ProductDetails.jsx
// Details Page for products with gallery, customization options, and ratings/reviews

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../../services/productService.js';
import { createReview, getProductReviews, updateReview, deleteReview } from '../../services/reviewService.js';
import { CartContext } from '../../context/CartContext.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import ProductCard from '../../components/customer/ProductCard.jsx';
import ProductCustomizer from '../../components/customizer/ProductCustomizer.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiHeart, FiShoppingCart, FiGift, FiStar, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Customizer state
  const [showCustomizer, setShowCustomizer] = useState(false);

  // New Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const prodRes = await getProductById(id);
        if (prodRes.success) {
          setProduct(prodRes.data.product);
          // Set initial large image
          const primaryImg = prodRes.data.product.images?.find(img => img.is_primary) || prodRes.data.product.images?.[0];
          setSelectedImage(primaryImg?.image_url || '');

          // Fetch related active items in the same category
          const relatedRes = await getProducts({
            categoryId: prodRes.data.product.category_id,
            isActive: 'true'
          });
          if (relatedRes.success) {
            const others = relatedRes.data.products.filter(p => p.product_id !== prodRes.data.product.product_id);
            setRelatedProducts(others.slice(0, 4));
          }
        }

        const revRes = await getProductReviews(id);
        if (revRes.success) {
          setReviews(revRes.data.reviews);
        }
      } catch (error) {
        console.error('Error loading product details:', error.message);
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to leave a review.');
      return;
    }

    try {
      setSubmittingReview(true);
      let res;
      if (editingReviewId) {
        res = await updateReview(editingReviewId, {
          rating: reviewRating,
          review: reviewText
        });
      } else {
        res = await createReview({
          product_id: id,
          rating: reviewRating,
          review: reviewText
        });
      }

      if (res.success) {
        toast.success(editingReviewId ? 'Review updated!' : 'Thank you for your feedback!');
        setReviews(res.data.reviews);
        setReviewText('');
        setReviewRating(5);
        setEditingReviewId(null);
        // Reload details to refresh avg rating
        const prodRes = await getProductById(id);
        if (prodRes.success) setProduct(prodRes.data.product);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to submit review.';
      toast.error(errMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await deleteReview(reviewId);
      if (res.success) {
        toast.success('Review deleted.');
        setReviews(res.data.reviews);
        // Reload details to refresh avg rating
        const prodRes = await getProductById(id);
        if (prodRes.success) setProduct(prodRes.data.product);
      }
    } catch (error) {
      toast.error('Failed to delete review.');
    }
  };

  const handleAddToCart = async () => {
    if (product.is_customizable) {
      setShowCustomizer(true);
      return;
    }
    await addToCart(product.product_id, 1);
  };

  const handleCustomizerAddToCart = async (customizationData) => {
    await addToCart(product.product_id, 1, customizationData);
  };

  if (loading) return <Loader />;
  if (!product) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl space-y-4">
        <p className="text-slate-400 font-semibold">Product not found.</p>
        <Link to="/products"><Button size="small">Return to Shop</Button></Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.product_id);
  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="space-y-12">
      
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <FiChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <FiChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-bold truncate max-w-[150px] sm:max-w-xs">{product.product_name}</span>
      </nav>

      {/* Main product details block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <img
              src={selectedImage || 'https://via.placeholder.com/600?text=No+Image'}
              alt={product.product_name}
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img) => (
                <button
                  key={img.image_id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 bg-slate-50 border rounded-xl overflow-hidden shrink-0 transition-all duration-200 ${
                    selectedImage === img.image_url 
                      ? 'border-indigo-600 ring-2 ring-indigo-100' 
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img.image_url} alt="product thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {product.category_name}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
              {product.product_name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center text-amber-500">
                <FiStar className="fill-current w-4.5 h-4.5" />
                <span className="font-extrabold text-sm ml-1 text-slate-800">{product.average_rating}</span>
              </div>
              <span className="text-slate-300 text-xs">|</span>
              <span className="text-slate-400 text-xs font-semibold">{product.total_reviews} Rating(s)</span>
            </div>

            {/* Price display */}
            <div className="text-2xl font-extrabold text-slate-800">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </div>

            {/* Product description */}
            <p className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
              {product.description || 'No description available for this item.'}
            </p>

            {/* Customization Details Trigger */}
            {product.is_customizable && (
              <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-xs text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <FiGift className="w-4 h-4 text-amber-600" />
                  <span>Customizable Product</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  This product supports custom printing, photo templates, custom text overlays, and scaling layouts.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCustomizer(true)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                  id="customize-product-btn"
                >
                  <FiGift className="w-4 h-4" />
                  <span>Customize Product</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Row Buttons */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Add to Cart button */}
              <Button
                onClick={handleAddToCart}
                disabled={outOfStock}
                variant="primary"
                className="flex-grow py-3 text-sm font-bold"
              >
                <FiShoppingCart className="mr-2 w-4.5 h-4.5" />
                <span>{outOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
              </Button>
              
              {/* Wishlist toggle button */}
              <button
                onClick={() => toggleWishlist(product.product_id)}
                className={`py-3 px-6 rounded-xl border flex items-center justify-center font-bold text-sm transition-all duration-200 focus:outline-none ${
                  isFavorited
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <FiHeart className={`mr-2 w-4.5 h-4.5 ${isFavorited ? 'fill-current' : ''}`} />
                <span>{isFavorited ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
            </div>
            
            {/* Inventory Alerts */}
            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
              <p className="text-red-500 text-xs font-semibold text-center">
                ⚠️ Hurry, only {product.stock_quantity} left in stock!
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: Reviews and Ratings */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Review form */}
          <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-2xl h-fit space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-slate-800 text-sm">{editingReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
              {editingReviewId && (
                <button
                  onClick={() => {
                    setEditingReviewId(null);
                    setReviewRating(5);
                    setReviewText('');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none text-amber-500 hover:scale-110 transition-transform"
                      >
                        <FiStar className={`w-6 h-6 ${reviewRating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Review Comment</label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts on print quality, frame durability, packaging..."
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-indigo-500 rounded-lg text-sm placeholder-slate-400 focus:outline-none bg-slate-50 focus:bg-white transition-all"
                    required
                  ></textarea>
                </div>

                <Button type="submit" loading={submittingReview} className="w-full text-xs font-bold py-2.5">
                  Submit Review
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl space-y-3">
                <p className="text-slate-400 text-xs font-semibold">Please log in to share your review.</p>
                <Link to="/login">
                  <Button variant="secondary" size="small">Login Page</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white border border-slate-100 rounded-2xl text-slate-400 font-semibold text-sm">
                No reviews yet for this product. Be the first to share your experience!
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div key={rev.review_id} className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 font-bold text-sm text-slate-800">
                        <span>{rev.first_name} {rev.last_name}</span>
                        {user && user.user_id === rev.user_id && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(rev.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {user && (user.user_id === rev.user_id || user.role === 'admin') && (
                          <div className="flex items-center space-x-2">
                            {user.user_id === rev.user_id && (
                              <button
                                onClick={() => {
                                  setEditingReviewId(rev.review_id);
                                  setReviewRating(rev.rating);
                                  setReviewText(rev.review || '');
                                }}
                                className="text-slate-400 hover:text-indigo-600 font-bold text-[10px] uppercase transition-colors"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(rev.review_id)}
                              className="text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Star row */}
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar key={star} className={`w-3.5 h-3.5 ${rev.rating >= star ? 'fill-current' : ''}`} />
                      ))}
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed">
                      {rev.review || 'No written feedback provided.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-slate-100 pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.product_id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {product && (
        <ProductCustomizer
          product={product}
          isOpen={showCustomizer}
          onClose={() => setShowCustomizer(false)}
          onAddToCart={handleCustomizerAddToCart}
        />
      )}

    </div>
  );
};

export default ProductDetails;
