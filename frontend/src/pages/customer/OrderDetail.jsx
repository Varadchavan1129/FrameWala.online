// OrderDetail.jsx
// Detailed breakdown of a single order for the customer

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../../services/orderService.js';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiArrowLeft, FiAlertTriangle, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatINR } from '../../utils/formatters.js';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(id);
      if (res.success) {
        setOrder(res.data.order);
      }
    } catch (error) {
      toast.error('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await cancelOrder(order.order_id);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        loadOrder();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[status] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  if (loading) return <Loader />;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-white border border-warmDark-100 rounded-3xl space-y-4">
        <p className="text-warmDark-500 font-semibold">Order not found.</p>
        <Link to="/orders"><Button>Return to Orders</Button></Link>
      </div>
    );
  }

  const isPendingPayment = order.payment_status === 'pending';
  const isCancellable = order.order_status === 'pending' || order.order_status === 'processing';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-warmDark-500 hover:text-brand-600 mb-4 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-warmDark-900">Order #FW-{order.order_id}</h1>
            <p className="text-warmDark-500 text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-4 py-1.5 border rounded-full text-xs font-extrabold uppercase tracking-wide ${getStatusStyle(order.order_status)}`}>
              Order: {order.order_status}
            </span>
            <span className={`px-4 py-1.5 border rounded-full text-xs font-extrabold uppercase tracking-wide ${getStatusStyle(order.payment_status)}`}>
              Payment: {order.payment_status}
            </span>
          </div>
        </div>
      </div>

      {isPendingPayment && order.order_status !== 'cancelled' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-5 rounded-2xl text-sm font-semibold flex items-start gap-4 shadow-sm">
          <FiAlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-base font-extrabold">Payment Verification Pending</p>
            <p className="font-medium opacity-90">Your order is received but we are waiting for payment verification. If you haven't completed the payment yet, please send the details to our admin on WhatsApp.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details (Items) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="font-extrabold text-warmDark-900 text-lg border-b border-cream-200 pb-4">Items Ordered</h2>
            
            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.order_item_id} className="flex gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-cream-100 rounded-2xl overflow-hidden shrink-0 border border-cream-200">
                    <img src={item.primary_image || 'https://via.placeholder.com/150'} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-warmDark-900 text-sm sm:text-base">{item.product_name}</h3>
                      {(item.custom_text || item.custom_image_url) && (
                        <p className="text-xs text-brand-600 font-semibold mt-1 bg-brand-50 inline-block px-2 py-0.5 rounded">Customized</p>
                      )}
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-sm font-semibold text-warmDark-500">Qty: {item.quantity}</span>
                      <span className="font-extrabold text-warmDark-900 text-base">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-cream-200 pt-6 mt-6 space-y-3">
              <div className="flex justify-between text-warmDark-500 font-medium">
                <span>Subtotal</span>
                <span>{formatINR(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-warmDark-500 font-medium">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-cream-200">
                <span className="font-extrabold text-warmDark-900 text-lg">Total</span>
                <span className="font-extrabold text-brand-700 text-xl">{formatINR(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-warmDark-900 flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-brand-600" /> Delivery Address
            </h3>
            <div className="text-sm text-warmDark-600 space-y-1">
              <p className="font-extrabold text-warmDark-900">{order.shipping_name}</p>
              <p>{order.address_line}</p>
              <p>{order.city}, {order.state} - {order.pincode}</p>
              <p className="pt-2 font-medium">Phone: {order.shipping_phone}</p>
            </div>
          </div>

          <div className="bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-warmDark-900 flex items-center gap-2">
              <FiCreditCard className="w-5 h-5 text-brand-600" /> Payment Info
            </h3>
            <div className="text-sm text-warmDark-600 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-warmDark-500">Method</span>
                <span className="font-extrabold text-warmDark-900">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-warmDark-500">Status</span>
                <span className="font-bold text-warmDark-900 capitalize">{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to={`/orders/${order.order_id}/track`} className="block">
              <Button className="w-full justify-center gap-2" variant="secondary">
                <FiTruck className="w-4 h-4" /> Track Shipping
              </Button>
            </Link>

            {isCancellable && (
              <button
                onClick={handleCancel}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <FiAlertTriangle className="w-4 h-4" /> Cancel Order
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
