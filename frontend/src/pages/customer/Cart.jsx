// Cart.jsx — shopping cart with photo frame customizations, quantity controls, and summary.

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { formatINR } from '../../utils/formatters.js';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus, FiImage } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, cartTotalAmount, cartTotalItems, updateQty, removeFromCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6">
        <div className="w-20 h-20 bg-gold-100 text-brand-700 rounded-3xl flex items-center justify-center mx-auto">
          <FiShoppingBag className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-warmDark-900">Your Cart is Empty</h2>
          <p className="text-warmDark-500 text-sm">Explore our handcrafted photo frames and customize your favorite memories.</p>
        </div>
        <Link to="/products" className="inline-block px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm shadow-warm-md transition-all active:scale-95" data-testid="cart-empty-shop">
          Start Browsing Frames
        </Link>
      </div>
    );
  }

  const delivery = cartTotalAmount >= 999 ? 0 : 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-warmDark-900">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.lineId} className="flex gap-4 bg-white border border-warmDark-100/60 p-4 rounded-2xl shadow-warm-sm" data-testid={`cart-item-${item.id}`}>
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream-200 shrink-0 relative border border-warmDark-100">
                <img
                  src={item.custom_image || item.image || '/images/products/product_01.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/products/product_01.jpg'; }}
                />
                {item.custom_image && (
                  <span className="absolute bottom-1 right-1 bg-brand-700 text-cream-50 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    Custom Photo
                  </span>
                )}
              </div>
              <div className="flex-grow min-w-0 space-y-1">
                <Link to={`/product/${item.id}`} className="font-extrabold text-warmDark-900 text-sm hover:text-brand-600 line-clamp-1">
                  {item.name}
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-warmDark-500">
                  {item.size && <span>Size: <span className="font-semibold text-warmDark-800">{item.size}</span></span>}
                  {(item.finish || item.color || item.frame_color) && (
                    <span>Moulding: <span className="font-semibold text-warmDark-800">{item.finish || item.color || item.frame_color}</span></span>
                  )}
                </div>
                {item.custom_text && (
                  <div className="inline-block mt-1 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-semibold px-2 py-0.5 rounded">
                    Engraved: "{item.custom_text}"
                  </div>
                )}
                <p className="text-warmDark-900 font-extrabold text-base pt-1">{formatINR(item.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <button onClick={() => removeFromCart(item.lineId)} className="text-warmDark-400 hover:text-red-500 transition-colors" data-testid={`cart-remove-${item.id}`} title="Remove item">
                  <FiTrash2 className="w-4.5 h-4.5" />
                </button>
                <div className="flex items-center bg-cream-100 rounded-full border border-warmDark-100">
                  <button onClick={() => updateQty(item.lineId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-warmDark-700 hover:text-brand-700 font-bold" data-testid={`cart-dec-${item.id}`}>
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.lineId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-warmDark-700 hover:text-brand-700 font-bold" data-testid={`cart-inc-${item.id}`}>
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-warmDark-100/60 p-6 rounded-3xl h-fit space-y-5 lg:sticky lg:top-28 shadow-warm-sm">
          <h3 className="font-extrabold text-warmDark-900 text-lg border-b border-cream-200 pb-3">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-warmDark-500"><span>Subtotal ({cartTotalItems} items)</span><span className="font-bold text-warmDark-900">{formatINR(cartTotalAmount)}</span></div>
            <div className="flex justify-between text-warmDark-500"><span>Delivery</span><span className={`font-bold ${delivery === 0 ? 'text-brand-600' : 'text-warmDark-900'}`}>{delivery === 0 ? 'FREE' : formatINR(delivery)}</span></div>
            <div className="border-t border-cream-200 pt-3 flex justify-between text-base"><span className="font-extrabold text-warmDark-900">Total</span><span className="font-extrabold text-brand-700">{formatINR(cartTotalAmount + delivery)}</span></div>
          </div>
          <Link to="/checkout" className="w-full flex items-center justify-center gap-2 py-3.5 bg-warmDark-900 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm shadow-warm-md transition-all active:scale-95" data-testid="cart-checkout">
            Proceed to Checkout <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/products" className="block text-center text-xs font-bold text-brand-600 hover:text-brand-800">Continue Browsing Frames</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;