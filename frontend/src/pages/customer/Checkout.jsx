// Checkout.jsx
// Order checkout billing and shipping selections page

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import { getAddresses, addAddress } from '../../services/authService.js';
import { placeOrder } from '../../services/orderService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { FiMapPin, FiCreditCard, FiDollarSign, FiPlus, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotalAmount, clearCart } = useContext(CartContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addingAddr, setAddingAddr] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Cannot checkout.');
      navigate('/cart');
      return;
    }
    loadAddresses();
  }, [cartItems]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      if (res.success) {
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0].address_id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to load addresses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      toast.error('Please fill in all address fields.');
      return;
    }

    try {
      setAddingAddr(true);
      const res = await addAddress({
        full_name: fullName,
        phone,
        address_line: addressLine,
        city,
        state,
        pincode
      });

      if (res.success) {
        toast.success('Address added successfully.');
        setAddresses(res.data.addresses);
        setSelectedAddressId(res.data.address_id.toString());
        
        // Reset Form
        setFullName('');
        setPhone('');
        setAddressLine('');
        setCity('');
        setState('');
        setPincode('');
        setShowAddressForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address.');
    } finally {
      setAddingAddr(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please choose or enter a shipping address.');
      return;
    }

    try {
      setSubmittingOrder(true);
      const res = await placeOrder({
        address_id: selectedAddressId,
        payment_method: paymentMethod
      });

      if (res.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transaction checkout failed.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        <p className="text-slate-400 text-sm mt-1">Specify dispatch addresses and complete your order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Addresses & Payments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Address Panel */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-800 text-sm flex items-center space-x-2">
                <FiMapPin className="w-5 h-5 text-indigo-500" />
                <span>Shipping Address</span>
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center space-x-1"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Selection Radio Cards */}
            {addresses.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center">No addresses found. Add an address to continue.</p>
            ) : (
              <div className="space-y-3.5">
                {addresses.map((addr) => (
                  <label 
                    key={addr.address_id}
                    className={`flex items-start border p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                      selectedAddressId === addr.address_id.toString()
                        ? 'border-indigo-600 bg-indigo-50/20'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_address"
                      value={addr.address_id}
                      checked={selectedAddressId === addr.address_id.toString()}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 shrink-0"
                    />
                    <div className="ml-3 text-xs font-semibold space-y-1">
                      <span className="font-extrabold text-slate-800 text-sm block">{addr.full_name}</span>
                      <span className="text-slate-500 block">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</span>
                      <span className="text-slate-400 block">Phone: {addr.phone}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Add Address Form Accordion */}
            {showAddressForm && (
              <form onSubmit={handleAddAddressSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 pt-4">
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">New Shipping Address</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Receiver Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Varad Chavan"
                      className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. Flat No. 201, Sunshine Heights"
                    className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400001"
                      className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    onClick={() => setShowAddressForm(false)}
                    variant="secondary"
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={addingAddr}
                    size="small"
                  >
                    Save Address
                  </Button>
                </div>

              </form>
            )}
          </div>

          {/* Payment Method Panel */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4">
            <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center space-x-2">
              <FiCreditCard className="w-5 h-5 text-indigo-500" />
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cash On Delivery */}
              <label 
                className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-600 bg-indigo-50/20'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3 flex items-center space-x-2">
                  <FiDollarSign className="w-5 h-5 text-slate-600" />
                  <div className="text-xs font-semibold">
                    <span className="font-extrabold text-slate-800 text-sm block">Cash on Delivery</span>
                    <span className="text-slate-400 block text-[10px]">Pay when items are delivered</span>
                  </div>
                </div>
              </label>

              {/* Online payment (Mocked) */}
              <label 
                className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'Card'
                    ? 'border-indigo-600 bg-indigo-50/20'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3 flex items-center space-x-2">
                  <FiCreditCard className="w-5 h-5 text-slate-600" />
                  <div className="text-xs font-semibold">
                    <span className="font-extrabold text-slate-800 text-sm block">Online UPI/Card</span>
                    <span className="text-amber-600 block text-[10px] font-bold">Mock Payment Mode</span>
                  </div>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Side: Invoice Subtotal Summary */}
        <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl h-fit space-y-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3">Billing Info</h3>

          <div className="space-y-4">
            {/* List items mini preview */}
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="flex justify-between text-xs font-semibold text-slate-500">
                  <span className="truncate max-w-[150px]">{item.product_name} <span className="text-[10px] font-black text-indigo-500">x{item.quantity}</span></span>
                  <span className="text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-800 font-extrabold">₹{cartTotalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping Fee</span>
                <span className="text-emerald-600 font-extrabold uppercase">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-sm">
                <span className="text-slate-800 font-extrabold">Total Amount</span>
                <span className="text-indigo-600 font-black">₹{cartTotalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePlaceOrder}
            loading={submittingOrder}
            disabled={!selectedAddressId}
            className="w-full py-3 text-sm font-bold shadow-lg"
          >
            <span>Confirm & Place Order</span>
          </Button>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
