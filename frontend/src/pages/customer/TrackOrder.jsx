// TrackOrder.jsx
// Order shipment tracking page

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orderService.js';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiCheck, FiTruck, FiMapPin, FiPackage, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        if (res.success) {
          setOrder(res.data.order);
        }
      } catch (error) {
        console.error('Failed to load tracking details:', error.message);
        toast.error('Failed to retrieve tracking information.');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl space-y-4">
        <p className="text-slate-400 font-semibold">Order not found.</p>
        <Link to="/orders"><Button size="small">Return to Orders</Button></Link>
      </div>
    );
  }

  // Define tracking steps
  const steps = [
    { label: 'Order Placed', status: 'pending', desc: 'We have received your custom order requests.' },
    { label: 'Processing', status: 'processing', desc: 'Your customizations are being manually printed/framed.' },
    { label: 'Shipped', status: 'shipped', desc: 'Your package was dispatched with the courier service.' },
    { label: 'Delivered', status: 'delivered', desc: 'Package was successfully received at your address.' }
  ];

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    if (status === 'pending') return 0;
    if (status === 'processing') return 1;
    if (status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const activeIndex = getStepIndex(order.order_status);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Track Order #FW-{order.order_id}</h1>
        <p className="text-slate-400 text-sm mt-1">Review dispatch milestones and shipping carrier particulars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Step-by-step progress list */}
        <div className="md:col-span-2 bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl space-y-8">
          
          {order.order_status === 'cancelled' ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3 text-sm font-semibold">
              <span className="text-lg">⚠️</span>
              <span>This order has been cancelled and its inventory stock has been restored.</span>
            </div>
          ) : (
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {steps.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isActive = idx === activeIndex;

                return (
                  <div key={step.label} className="relative flex items-start space-x-4">
                    {/* Visual dot indicator */}
                    <div 
                      className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isCompleted 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'bg-white border-slate-200 text-slate-400'
                      } ${isActive ? 'ring-4 ring-indigo-100' : ''}`}
                    >
                      {isCompleted ? <FiCheck className="w-3.5 h-3.5" /> : null}
                    </div>

                    <div className="text-xs font-semibold space-y-1">
                      <h3 className={`text-sm font-extrabold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step.label}
                      </h3>
                      <p className="text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Courier dispatch information panel */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Tracking Details */}
          {order.shipment && (
            <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center space-x-1.5">
                <FiTruck className="w-5 h-5 text-indigo-500" />
                <span>Shipping Info</span>
              </h3>

              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] mb-0.5">Carrier Courier</span>
                  <span className="text-slate-700 font-extrabold block">{order.shipment.courier_name || 'Delhivery Logistics'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] mb-0.5">Tracking Number</span>
                  <span className="text-slate-700 font-mono font-extrabold block">{order.shipment.tracking_number || 'N/A'}</span>
                </div>
                <div className="flex items-start space-x-2 bg-indigo-50/50 p-3 border border-indigo-100/50 rounded-xl mt-2">
                  <FiCalendar className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block uppercase text-[8px] font-extrabold">Expected Arrival</span>
                    <span className="text-indigo-700 font-extrabold text-sm block">
                      {order.shipment.expected_delivery 
                        ? new Date(order.shipment.expected_delivery).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Within 5 Working Days'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery destination card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center space-x-1.5">
              <FiMapPin className="w-5 h-5 text-indigo-500" />
              <span>Recipient Address</span>
            </h3>

            <div className="text-xs font-semibold text-slate-500 space-y-1">
              <span className="text-slate-800 font-extrabold text-sm block">{order.shipping_name}</span>
              <span className="block">{order.address_line}</span>
              <span className="block">{order.city}, {order.state} - {order.pincode}</span>
              <span className="block">Mobile: {order.shipping_phone}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TrackOrder;
