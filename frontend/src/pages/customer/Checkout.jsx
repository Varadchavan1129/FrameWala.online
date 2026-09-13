// Checkout.jsx — shipping form, order review, coupon, payment UI, order summary.

import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { CustomerAuthContext } from '../../context/CustomerAuthContext.jsx';
import { formatINR } from '../../utils/formatters.js';
import toast from 'react-hot-toast';
import { getAddresses, addAddress } from '../../services/authService.js';
import { placeOrder as apiPlaceOrder } from '../../services/orderService.js';
import {
  FiShoppingCart, FiMapPin, FiChevronRight, FiCheckCircle, FiShield,
  FiRefreshCw, FiAward, FiTruck, FiTag, FiPlus
} from 'react-icons/fi';

const COUPONS = { FRAMEWALA10: 0.1, FRAMEWALA15: 0.15 };
const PAYMENTS = [
  { id: 'upi', label: 'UPI / QR Code', tag: 'UPI', method: 'UPI' },
  { id: 'card', label: 'Credit / Debit Card', tag: 'VISA · MC', method: 'Card' },
  { id: 'netbanking', label: 'Net Banking', tag: 'Banks', method: 'NetBanking' },
  { id: 'wallet', label: 'Wallets (PhonePe / Paytm)', tag: 'Wallets', method: 'Wallet' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotalAmount, clearCart, loadCart, loading: cartLoading } = useContext(CartContext);
  const { user, loading: authLoading } = useContext(CustomerAuthContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [form, setForm] = useState({ full_name: '', phone: '', address_line: '', city: '', state: '', pincode: '' });
  const [payment, setPayment] = useState('upi');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [adminWhatsapp, setAdminWhatsapp] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const setFormKey = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const delivery = cartTotalAmount >= 999 ? 0 : 60;
  const discount = coupon ? Math.round(cartTotalAmount * COUPONS[coupon]) : 0;
  const total = cartTotalAmount + delivery - discount;

  useEffect(() => {
    // If not logged in, force login (Checkout requires authenticated user)
    if (!localStorage.getItem('customer_token')) {
      toast.error('Please login to checkout.');
      navigate('/login?redirect=/checkout');
      return;
    }
    
    // Load user addresses
    const loadSavedAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await getAddresses();
        if (res.success) {
          setAddresses(res.data.addresses || []);
          if (res.data.addresses && res.data.addresses.length > 0) {
            setSelectedAddressId(res.data.addresses[0].address_id);
            setIsAddingAddress(false);
          } else {
            setIsAddingAddress(true);
          }
        }
      } catch (err) {
        toast.error('Failed to load addresses.');
      } finally {
        setLoadingAddresses(false);
      }
    };
    loadSavedAddresses();
  }, [navigate]);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) { setCoupon(code); toast.success(`Coupon ${code} applied!`); }
    else { setCoupon(null); toast.error('Invalid coupon code.'); }
  };

  const handleAddAddress = async (e) => {
    if (e) e.preventDefault();
    const required = ['full_name', 'phone', 'address_line', 'city', 'state', 'pincode'];
    if (required.some((k) => !form[k]?.trim())) { toast.error('Please fill all delivery details.'); return null; }
    
    try {
      const res = await addAddress(form);
      if (res.success) {
        toast.success('Address added successfully!');
        setAddresses(res.data.addresses);
        setSelectedAddressId(res.data.address_id);
        setIsAddingAddress(false);
        setForm({ full_name: '', phone: '', address_line: '', city: '', state: '', pincode: '' });
        return res.data.address_id;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address.');
      return null;
    }
  };

  const placeOrder = async () => {
    let addressIdToUse = selectedAddressId;

    if (!addressIdToUse) {
      const required = ['full_name', 'phone', 'address_line', 'city', 'state', 'pincode'];
      const isFormFilled = required.every((k) => form[k]?.trim());
      if (isFormFilled) {
        setIsPlacingOrder(true);
        addressIdToUse = await handleAddAddress();
        if (!addressIdToUse) {
          setIsPlacingOrder(false);
          return;
        }
      } else {
        toast.error('Please select or fill in a delivery address.');
        return;
      }
    }

    const selectedPaymentMethod = PAYMENTS.find((p) => p.id === payment)?.method || 'COD';

    try {
      setIsPlacingOrder(true);
      const res = await apiPlaceOrder({
        address_id: addressIdToUse,
        payment_method: selectedPaymentMethod,
      });

      if (res.success) {
        clearCart();
        await loadCart();
        setPlacedOrder(res.data.order);
        setAdminWhatsapp(res.data.admin_whatsapp);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (placedOrder) {
    const handleWhatsApp = () => {
      if (!adminWhatsapp) return;
      const { order_id, created_at, shipping_name, email, shipping_phone, items, total_amount, payment_method, address_line, city, state, pincode } = placedOrder;
      
      const lines = [
        `*New Order: #FW-${order_id}*`,
        `Date: ${new Date(created_at).toLocaleString()}`,
        ``,
        `*Customer Details:*`,
        `Name: ${shipping_name}`,
        `Email: ${email || user?.email}`,
        `Phone: ${shipping_phone || user?.phone}`,
        ``,
        `*Order Items:*`
      ];

      items.forEach(item => {
        lines.push(`- ${item.product_name} (x${item.quantity}) = ₹${item.price * item.quantity}`);
      });

      lines.push(``);
      lines.push(`*Totals:*`);
      lines.push(`Total Amount: ₹${total_amount}`);
      lines.push(`Payment Method: ${payment_method}`);
      lines.push(`Payment Status: Pending Verification`);
      lines.push(``);
      lines.push(`*Delivery Address:*`);
      lines.push(`${address_line}, ${city}, ${state} - ${pincode}`);

      const message = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/${adminWhatsapp}?text=${message}`, '_blank');
    };

    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4 space-y-6">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto"><FiCheckCircle className="w-11 h-11" /></div>
        <h1 className="text-3xl font-extrabold text-warmDark-900">Order Placed!</h1>
        <p className="text-warmDark-500 text-sm">Thank you, {user?.first_name || 'friend'}. Your FrameWala order has been placed successfully.</p>
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-5 rounded-2xl text-sm font-semibold text-left space-y-4">
          <p className="leading-relaxed">Since you chose a prepaid method (<span className="font-extrabold text-yellow-900">{placedOrder.payment_method}</span>), please send your order details to our admin on WhatsApp to complete payment and verification.</p>
          <button onClick={handleWhatsApp} className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
            Send Order Details on WhatsApp
          </button>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Link to="/orders" className="inline-block px-8 py-3.5 bg-brand-50 text-brand-700 rounded-full font-bold text-sm">Track Order</Link>
          <Link to="/products" className="inline-block px-8 py-3.5 bg-brand-600 text-cream-50 rounded-full font-bold text-sm" data-testid="order-continue">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (cartLoading || authLoading || loadingAddresses) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700"></div>
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
            <h2 className="font-extrabold text-warmDark-900 flex items-center justify-between">
              <span className="flex items-center gap-2"><FiMapPin className="w-5 h-5 text-brand-600" /> Delivery Information</span>
              {!isAddingAddress && addresses.length > 0 && (
                <button onClick={() => setIsAddingAddress(true)} className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:text-brand-700">
                  <FiPlus className="w-3 h-3" /> Add New
                </button>
              )}
            </h2>

            {loadingAddresses ? (
              <div className="py-4 text-center text-sm text-warmDark-400">Loading addresses...</div>
            ) : isAddingAddress ? (
              <form onSubmit={handleAddAddress} className="space-y-4 border border-cream-200 p-4 rounded-2xl bg-cream-50/50">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className={input} placeholder="Full Name" value={form.full_name} onChange={setFormKey('full_name')} required />
                  <input className={input} placeholder="Mobile Number" value={form.phone} onChange={setFormKey('phone')} required />
                  <input className={`${input} sm:col-span-2`} placeholder="Street Address" value={form.address_line} onChange={setFormKey('address_line')} required />
                  <input className={input} placeholder="City" value={form.city} onChange={setFormKey('city')} required />
                  <input className={input} placeholder="State" value={form.state} onChange={setFormKey('state')} required />
                  <input className={input} placeholder="Pincode" value={form.pincode} onChange={setFormKey('pincode')} required />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="px-5 py-2 text-sm font-bold text-warmDark-500 hover:text-warmDark-800">Cancel</button>
                  )}
                  <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold">Save & Select</button>
                </div>
              </form>
            ) : (
              <div className="grid gap-3">
                {addresses.map((addr) => (
                  <label key={addr.address_id} className={`flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${selectedAddressId === addr.address_id ? 'border-brand-600 bg-brand-50/40' : 'border-cream-200 hover:border-warmDark-200'}`}>
                    <input type="radio" name="address" checked={selectedAddressId === addr.address_id} onChange={() => setSelectedAddressId(addr.address_id)} className="mt-1 accent-brand-600" />
                    <div>
                      <p className="font-bold text-sm text-warmDark-900">{addr.full_name}</p>
                      <p className="text-xs text-warmDark-500 mt-0.5">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-xs text-warmDark-500 mt-0.5">Phone: {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            <div className="bg-cream-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-warmDark-700 flex items-center gap-2 mt-4"><FiTruck className="w-4 h-4 text-brand-600" /> Estimated Delivery: 3–5 business days</div>
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

          <button onClick={placeOrder} disabled={isPlacingOrder} className="w-full py-4 bg-warmDark-900 hover:bg-brand-700 text-cream-50 rounded-full font-extrabold text-base shadow-warm-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" data-testid="place-order">
            {isPlacingOrder ? 'Processing...' : 'Place Order'} <FiChevronRight className="w-5 h-5" />
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
