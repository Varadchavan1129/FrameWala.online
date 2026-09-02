// Checkout.jsx — shipping form, order review, coupon, payment UI, order summary.

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { formatINR } from '../../data/mockData.js';
import toast from 'react-hot-toast';
import {
  FiShoppingCart, FiMapPin, FiChevronRight, FiCheckCircle, FiShield,
  FiRefreshCw, FiAward, FiTruck, FiTag,
} from 'react-icons/fi';

const COUPONS = { FRAMEWALA10: 0.1, FRAMEWALA15: 0.15 };
const PAYMENTS = [
  { id: 'upi', label: 'UPI / QR Code', tag: 'UPI' },
  { id: 'card', label: 'Credit / Debit Card', tag: 'VISA · MC' },
  { id: 'netbanking', label: 'Net Banking', tag: 'Banks' },
  { id: 'wallet', label: 'Wallets (PhonePe / Paytm)', tag: 'Wallets' },
  { id: 'cod', label: 'Cash on Delivery', tag: 'COD' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotalAmount, clearCart } = useContext(CartContext);

  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '', city: '', state: '', pincode: '' });
  const [payment, setPayment] = useState('cod');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [placed, setPlaced] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const delivery = cartTotalAmount >= 999 ? 0 : 60;
  const discount = coupon ? Math.round(cartTotalAmount * COUPONS[coupon]) : 0;
  const total = cartTotalAmount + delivery - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) { setCoupon(code); toast.success(`Coupon ${code} applied!`); }
    else { setCoupon(null); toast.error('Invalid coupon code.'); }
  };

  const placeOrder = () => {
    const required = ['name', 'mobile', 'address', 'city', 'state', 'pincode'];
    if (required.some((k) => !form[k].trim())) { toast.error('Please fill all delivery details.'); return; }
    clearCart();
    setPlaced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (placed) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4 space-y-6">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto"><FiCheckCircle className="w-11 h-11" /></div>
        <h1 className="text-3xl font-extrabold text-warmDark-900">Order Placed!</h1>
        <p className="text-warmDark-500 text-sm">Thank you, {form.name || 'friend'}. Your FrameWala order has been placed successfully. Estimated delivery in 3–5 business days.</p>
        <Link to="/products" className="inline-block px-8 py-3.5 bg-brand-600 text-cream-50 rounded-full font-bold text-sm" data-testid="order-continue">Continue Shopping</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-5">
        <h2 className="text-2xl font-extrabold text-warmDark-900">Your cart is empty</h2>
        <Link to="/products" className="inline-block px-8 py-3.5 bg-brand-600 text-cream-50 rounded-full font-bold text-sm">Shop Frames</Link>
      </div>
    );
  }

  const input = 'w-full px-4 py-2.5 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <nav className="flex items-center gap-2 text-xs font-semibold text-warmDark-400">
        <Link to="/" className="hover:text-brand-600">Home</Link><FiChevronRight className="w-3 h-3" />
        <Link to="/cart" className="hover:text-brand-600">Cart</Link><FiChevronRight className="w-3 h-3" />
        <span className="text-warmDark-800">Checkout</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Review order */}
          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-4">
            <h2 className="font-extrabold text-warmDark-900 flex items-center gap-2"><FiShoppingCart className="w-5 h-5 text-brand-600" /> Review Your Order</h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.lineId} className="flex items-center gap-4 border border-cream-200 rounded-2xl p-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-200 shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-warmDark-900 text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-warmDark-500">{[item.size, item.finish].filter(Boolean).join(' · ')}</p>
                    <p className="text-xs text-warmDark-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-warmDark-900 text-sm">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-4">
            <h2 className="font-extrabold text-warmDark-900 flex items-center gap-2"><FiMapPin className="w-5 h-5 text-brand-600" /> Delivery Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className={input} placeholder="Full Name" value={form.name} onChange={set('name')} data-testid="checkout-name" />
              <input className={input} placeholder="Mobile Number" value={form.mobile} onChange={set('mobile')} data-testid="checkout-mobile" />
              <input className={`${input} sm:col-span-2`} placeholder="Email Address" value={form.email} onChange={set('email')} data-testid="checkout-email" />
              <input className={`${input} sm:col-span-2`} placeholder="Street Address" value={form.address} onChange={set('address')} data-testid="checkout-address" />
              <input className={input} placeholder="City" value={form.city} onChange={set('city')} data-testid="checkout-city" />
              <input className={input} placeholder="State" value={form.state} onChange={set('state')} data-testid="checkout-state" />
              <input className={input} placeholder="Pincode" value={form.pincode} onChange={set('pincode')} data-testid="checkout-pincode" />
            </div>
            <div className="bg-cream-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-warmDark-700 flex items-center gap-2"><FiTruck className="w-4 h-4 text-brand-600" /> Estimated Delivery: 3–5 business days</div>
          </div>
        </div>

        {/* Summary + payment */}
        <div className="space-y-6 lg:sticky lg:top-28 h-fit">
          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-4">
            <h2 className="font-extrabold text-warmDark-900">Order Summary</h2>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <FiTag className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Enter Coupon Code" className={`${input} pl-9`} data-testid="coupon-input" />
              </div>
              <button onClick={applyCoupon} className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-xl text-sm font-bold" data-testid="coupon-apply">Apply</button>
            </div>
            <p className="text-[11px] text-warmDark-400">Try <span className="font-bold">FRAMEWALA10</span> or <span className="font-bold">FRAMEWALA15</span></p>
            <div className="space-y-2.5 text-sm border-t border-cream-200 pt-3">
              <div className="flex justify-between text-warmDark-500"><span>Subtotal</span><span className="font-bold text-warmDark-900">{formatINR(cartTotalAmount)}</span></div>
              <div className="flex justify-between text-warmDark-500"><span>Delivery Charges</span><span className={`font-bold ${delivery === 0 ? 'text-brand-600' : 'text-warmDark-900'}`}>{delivery === 0 ? 'FREE' : formatINR(delivery)}</span></div>
              {discount > 0 && <div className="flex justify-between text-warmDark-500"><span>Discount ({coupon})</span><span className="font-bold text-brand-600">− {formatINR(discount)}</span></div>}
              <div className="flex justify-between items-center border-t border-cream-200 pt-3">
                <span className="font-extrabold text-warmDark-900">Total Amount</span>
                <div className="text-right"><span className="font-extrabold text-brand-700 text-xl">{formatINR(total)}</span><p className="text-[10px] text-warmDark-400">Inclusive of all taxes</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-3">
            <h2 className="font-extrabold text-warmDark-900">Payment Methods</h2>
            {PAYMENTS.map((p) => (
              <label key={p.id} className={`flex items-center justify-between gap-3 border rounded-2xl px-4 py-3 cursor-pointer transition-all ${payment === p.id ? 'border-brand-600 bg-brand-50/40' : 'border-cream-200 hover:border-warmDark-200'}`} data-testid={`payment-${p.id}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-brand-600" />
                  <span className="text-sm font-semibold text-warmDark-800">{p.label}</span>
                </div>
                <span className="text-[10px] font-bold text-warmDark-400">{p.tag}</span>
              </label>
            ))}
            <p className="text-[11px] text-warmDark-400 flex items-center gap-1.5"><FiShield className="w-3.5 h-3.5" /> Your payment details are secure and encrypted.</p>
          </div>

          <button onClick={placeOrder} className="w-full py-4 bg-warmDark-900 hover:bg-brand-700 text-cream-50 rounded-full font-extrabold text-base shadow-warm-md transition-all active:scale-95 flex items-center justify-center gap-2" data-testid="place-order">
            Place Order <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-cream-200 pt-8">
        {[{ icon: FiShield, t: 'Secure Payments', d: '100% Protected' }, { icon: FiRefreshCw, t: 'Easy Returns', d: '7 Days Return Policy' }, { icon: FiAward, t: 'Premium Quality', d: 'Best Quality Frames' }, { icon: FiTruck, t: 'Fast Delivery', d: 'On time, every time' }].map((b, i) => (
          <div key={i} className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-gold-100 text-brand-700 flex items-center justify-center shrink-0"><b.icon className="w-5 h-5" /></div><div><p className="text-sm font-bold text-warmDark-900">{b.t}</p><p className="text-xs text-warmDark-500">{b.d}</p></div></div>
        ))}
      </div>
    </div>
  );
};

export default Checkout;
