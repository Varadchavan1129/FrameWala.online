// Orders.jsx
// Customer order history dashboard

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../../services/orderService.js';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiPackage, FiTruck, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      if (res.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error.message);
      toast.error('Failed to retrieve order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        // Refresh orders list
        loadOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-600 border-red-200'
    };
    return styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
          <FiPackage className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-800">No Orders Found</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            You haven't placed any orders yet. Once you check out items in your cart, they will appear here.
          </p>
        </div>
        <Link to="/products" className="block">
          <Button className="w-full text-xs font-bold py-3">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Orders</h1>
        <p className="text-slate-400 text-sm mt-1">Track shipping updates, download invoices, or cancel pending checkouts.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order.order_id}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
          >
            
            {/* Header bar */}
            <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Order Date</span>
                  <span className="text-slate-800 font-extrabold">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Order ID</span>
                  <span className="text-slate-800 font-extrabold">#FW-{order.order_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px]">Total Amount</span>
                  <span className="text-indigo-600 font-extrabold">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-3 py-1 border rounded-full text-xs font-extrabold uppercase tracking-wide ${getStatusStyle(order.order_status)}`}>
                {order.order_status}
              </span>
            </div>

            {/* Core address / items details */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Shipping address details */}
              <div className="md:col-span-1 space-y-2 border-r border-slate-50 pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ship To</span>
                <div className="text-xs font-semibold text-slate-500 space-y-0.5">
                  <span className="text-slate-800 font-extrabold text-sm block">{order.shipping_name}</span>
                  <span className="block">{order.city}, {order.state}</span>
                  <span className="block">Payment: <span className="font-extrabold text-slate-700 uppercase">{order.payment_status}</span></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 flex flex-col justify-center sm:flex-row items-center sm:justify-end gap-3.5 pl-0 md:pl-6">
                <Link 
                  to={`/orders/${order.order_id}/track`}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <FiTruck className="mr-1.5 w-4 h-4" />
                  <span>Track Shipping</span>
                </Link>

                {/* Cancel Trigger */}
                {(order.order_status === 'pending' || order.order_status === 'processing') && (
                  <button
                    onClick={() => handleCancel(order.order_id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors"
                  >
                    <FiAlertTriangle className="mr-1.5 w-4 h-4" />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Orders;
