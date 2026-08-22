// Orders.jsx
// Admin checkout orders tracker and status manager

import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, getOrderById } from '../../services/orderService.js';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiTrendingUp, FiEye, FiEdit2, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

const renderAdminCustomizationPreview = (item) => {
  const isMug = (item.product_name || '').toLowerCase().includes('mug') || 
                (item.category_name || '').toLowerCase().includes('mug') ||
                item.template_name;
  if (!isMug) return null;

  let parsedText = null;
  let name = '';
  let message = '';
  let bold = true;
  let italic = false;
  let align = 'center';
  let textRotation = 0;
  let textX = 0;
  let textY = 80;

  if (item.custom_text) {
    try {
      parsedText = JSON.parse(item.custom_text);
      name = parsedText.name || '';
      message = parsedText.message || '';
      bold = parsedText.bold !== undefined ? parsedText.bold : true;
      italic = parsedText.italic || false;
      align = parsedText.align || 'center';
      textRotation = parsedText.textRotation || 0;
      textX = parsedText.textX || 0;
      textY = parsedText.textY || 80;
    } catch (e) {
      name = item.custom_text;
    }
  }

  const combinedText = [name.trim(), message.trim()].filter(Boolean).join('\n');
  const uploadedImage = item.custom_image_url;
  const previewImageUrl = uploadedImage || 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=500';
  const defaultMugImage = 'https://images.cloudinary.com/framewala/white_mug.jpg';
  const originalMug = item.primary_image || defaultMugImage;

  const scaleFactor = 0.5;

  return (
    <div className="mt-4 border-t pt-4 space-y-4 text-xs">
      <div className="flex items-center space-x-1">
        <FiGift className="w-4 h-4 text-indigo-500" />
        <span className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wider">
          Visual Printing Specifications
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        {/* Original Mug */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Original Mug</span>
          <div className="w-full h-36 border bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <img src={originalMug} alt="Original Mug template" className="h-full object-contain pointer-events-none" />
          </div>
        </div>

        {/* Customer Preview */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Customer Preview</span>
          {item.preview_image ? (
            <div className="w-full h-36 border bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-1">
              <img src={item.preview_image} alt="High quality preview" className="h-full object-contain" />
            </div>
          ) : (
            <div className="w-full h-36 border bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center relative select-none">
              <img 
                src={originalMug} 
                alt="Preview base" 
                className="h-32 object-contain pointer-events-none z-10" 
              />
              <div 
                className="absolute border border-dashed border-indigo-500/50 overflow-hidden z-20"
                style={{
                  width: `${124 * scaleFactor}px`,
                  height: `${142 * scaleFactor}px`,
                  top: '47px',
                  left: '49px',
                  borderRadius: '3px',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={previewImageUrl}
                    alt="custom preview layer"
                    className="max-w-none origin-center pointer-events-none"
                    style={{
                      transform: `translate(${item.custom_position_x * scaleFactor}px, ${item.custom_position_y * scaleFactor}px) scale(${item.custom_scale}) rotate(${item.custom_rotation}deg)`,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {combinedText.trim() && (
                  <div
                    className="absolute z-10 select-none whitespace-pre-line pointer-events-none font-semibold text-shadow"
                    style={{
                      transform: `translate(${textX * scaleFactor}px, ${textY * scaleFactor}px) rotate(${textRotation}deg)`,
                      fontFamily: item.custom_font || 'system-ui, sans-serif',
                      fontSize: `${Math.max(5, item.custom_font_size * scaleFactor)}px`,
                      color: item.custom_font_color || '#ffffff',
                      fontWeight: bold ? 'bold' : 'normal',
                      fontStyle: italic ? 'italic' : 'normal',
                      textAlign: align,
                      lineHeight: '1.25',
                      width: '57px',
                      wordBreak: 'break-word'
                    }}
                  >
                    {combinedText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">
        
        {/* Uploaded Image */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Uploaded Image</span>
          {uploadedImage ? (
            <div className="border bg-slate-50 rounded-xl p-2.5 flex flex-col items-center justify-center text-center space-y-2 h-28">
              <img src={uploadedImage} alt="Raw customer upload" className="h-14 rounded-md object-cover border" />
              <a 
                href={uploadedImage} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-indigo-600 font-extrabold hover:underline"
              >
                View Full Photo
              </a>
            </div>
          ) : (
            <div className="border bg-slate-50 rounded-xl p-2.5 flex items-center justify-center text-center text-slate-400 italic text-[10px] h-28">
              No photo uploaded (Used sample image)
            </div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Text Particulars</span>
          <div className="border bg-slate-50 rounded-xl p-3 space-y-1.5 text-[10px] font-semibold text-slate-600 h-28 overflow-y-auto">
            {combinedText.trim() ? (
              <>
                {name && (
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Name Text</span>
                    <span className="text-slate-800 font-extrabold">"{name}"</span>
                  </div>
                )}
                {message && (
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Message Text</span>
                    <span className="text-slate-800 font-extrabold">"{message}"</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-slate-400 italic">No custom text overlays</span>
            )}
          </div>
        </div>

      </div>

      {/* Design JSON representation */}
      {item.design_json && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Design JSON Configurations</span>
          <pre className="bg-slate-50 border p-3 rounded-xl text-[9px] font-mono overflow-x-auto max-h-36 whitespace-pre-wrap text-slate-600">
            {JSON.stringify(typeof item.design_json === 'string' ? JSON.parse(item.design_json) : item.design_json, null, 2)}
          </pre>
        </div>
      )}

      {/* Print Instructions */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Print Instructions</span>
        <div className="border bg-white rounded-xl overflow-hidden">
          <table className="w-full text-left text-[9px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b font-bold text-slate-400 text-[8px] uppercase">
                <th className="p-2 border-r">Parameter</th>
                <th className="p-2">Value / Configuration</th>
              </tr>
            </thead>
            <tbody className="divide-y font-semibold text-slate-600">
              <tr>
                <td className="p-2 border-r bg-slate-50/30">Template Name</td>
                <td className="p-2 font-mono">{item.template_name || 'white_mug'}</td>
              </tr>
              <tr>
                <td className="p-2 border-r bg-slate-50/30">Image Scaling (Zoom)</td>
                <td className="p-2 font-mono">{item.custom_scale || '1.0'}x</td>
              </tr>
              <tr>
                <td className="p-2 border-r bg-slate-50/30">Image Rotation Angle</td>
                <td className="p-2 font-mono">{item.custom_rotation || '0'}°</td>
              </tr>
              <tr>
                <td className="p-2 border-r bg-slate-50/30">Image Translation Offset</td>
                <td className="p-2 font-mono">X={item.custom_position_x || '0'}, Y={item.custom_position_y || '0'}</td>
              </tr>
              {combinedText.trim() && (
                <>
                  <tr>
                    <td className="p-2 border-r bg-slate-50/30">Font Family Selection</td>
                    <td className="p-2 font-mono">{item.custom_font ? item.custom_font.split(',')[0] : 'Default'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r bg-slate-50/30">Font Size</td>
                    <td className="p-2 font-mono">{item.custom_font_size ? `${item.custom_font_size}px` : '14px'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r bg-slate-50/30">Font Text Color</td>
                    <td className="p-2 font-mono flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.custom_font_color || '#ffffff' }}></span>
                      <span>{item.custom_font_color || '#ffffff'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r bg-slate-50/30">Text Styling Details</td>
                    <td className="p-2 font-mono">
                      {bold ? 'Bold' : 'Normal'}{italic ? ', Italic' : ''} | Align={align} | Rot={textRotation}°
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrdersList();
  }, []);

  const loadOrdersList = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      if (res.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error('Failed to load orders history.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = async (ord) => {
    setSelectedOrder(ord);
    setOrderStatus(ord.order_status);
    setPaymentStatus(ord.payment_status);
    try {
      const res = await getOrderById(ord.order_id);
      if (res.success) {
        setSelectedOrder(res.data.order);
      }
    } catch (err) {
      toast.error('Failed to load order item specifications.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await updateOrderStatus(selectedOrder.order_id, {
        order_status: orderStatus,
        payment_status: paymentStatus
      });

      if (res.success) {
        toast.success('Order status updated successfully.');
        setSelectedOrder(null);
        loadOrdersList();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Orders Management</h2>
        <p className="text-slate-400 text-xs font-semibold">Track and dispatch customer orders and record payment status logs</p>
      </div>

      {/* Grid listing */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Delivery Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Order Total</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.order_id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-extrabold text-slate-800">#FW-{ord.order_id}</td>
                    <td className="p-4 text-slate-500">
                      <span className="font-extrabold text-slate-800 block">{ord.first_name} {ord.last_name}</span>
                      <span className="block text-[10px] text-slate-400">{ord.email}</span>
                    </td>
                    <td className="p-4 text-slate-500">{ord.city}, {ord.state}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase font-extrabold tracking-wide ${getStatusStyle(ord.order_status)}`}>
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold ${
                        ord.payment_status === 'paid' ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-800 font-extrabold">₹{parseFloat(ord.total_amount).toFixed(2)}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleEditOpen(ord)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none inline-flex items-center"
                        title="Update status"
                      >
                        <FiEdit2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleUpdateSubmit}
            className="bg-white border border-slate-100 w-full max-w-2xl rounded-3xl p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-extrabold text-slate-800 text-base border-b pb-2 flex items-center space-x-2">
              <FiTrendingUp className="w-5 h-5 text-indigo-500" />
              <span>Update Order Status #FW-{selectedOrder.order_id}</span>
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Delivery Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid (Completed)</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Customization Details List */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="space-y-3 pt-2 border-t">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Order Items & Customizations
                </h4>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {selectedOrder.items.map((item) => (
                    <div key={item.order_item_id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center font-bold text-slate-800 border-b pb-2">
                        <span className="text-sm">{item.product_name}</span>
                        <span className="text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded text-[10px]">Qty: {item.quantity}</span>
                      </div>
                      
                      {/* Render custom visual printing specs if customizable, otherwise show plain info */}
                      {(item.custom_image_url || item.custom_text) ? (
                        renderAdminCustomizationPreview(item)
                      ) : (
                        <span className="text-slate-400 text-[10px] italic block pt-1">No customizations configured.</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2 border-t">
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="secondary"
                size="small"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={updating}
                size="small"
              >
                Update Status
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Orders;
