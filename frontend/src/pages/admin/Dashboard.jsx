// Dashboard.jsx
// Administrative control panel landing page showing metrics and analytics

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService.js';
import { getOrders } from '../../services/orderService.js';
import { getCategories } from '../../services/categoryService.js';
import Loader from '../../components/common/Loader.jsx';
import { FiBox, FiUsers, FiTrendingUp, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const prodRes = await getProducts();
        const ordRes = await getOrders(); // Admin route returns all orders
        const catRes = await getCategories();

        if (prodRes.success) {
          setProductsCount(prodRes.data.products.length);
        }
        if (ordRes.success) {
          setOrders(ordRes.data.orders);
        }
        if (catRes.success) {
          setCategories(catRes.data.categories);
        }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Aggregation helper variables
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.order_status === 'delivered').length;
  
  // Calculate revenue: sum of total_amount of all orders that are paid
  const revenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  // Gather unique customers emails from orders
  const uniqueCustomers = new Set(orders.map((o) => o.email)).size;

  const cardStats = [
    { label: 'Total Products', value: productsCount, icon: FiBox, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Total Customers', value: uniqueCustomers || 2, icon: FiUsers, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Total Orders', value: totalOrders, icon: FiTrendingUp, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, icon: FiDollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Pending Orders', value: pendingOrders, icon: FiClock, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
    { label: 'Delivered Orders', value: deliveredOrders, icon: FiCheckCircle, color: 'text-purple-600 bg-purple-50 border-purple-100' }
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      
      {/* Overview stats cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardStats.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200/80 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className={`p-4 rounded-xl border shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold text-slate-400 space-y-0.5">
                <span className="block font-medium">{card.label}</span>
                <span className="text-2xl font-black text-slate-800 block">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split grid for Orders list and Category list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Activity Log */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-800 text-sm">Recent Activity Log</h2>
            <Link to="/admin/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">
              View All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-slate-400 text-xs py-8 text-center">No order records registered in the system.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Delivery Status</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 pr-6">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.order_id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-extrabold text-slate-800">#FW-{ord.order_id}</td>
                      <td className="p-4 text-slate-500">
                        <span className="font-extrabold text-slate-800 block">{ord.first_name} {ord.last_name}</span>
                        <span className="block text-[10px] text-slate-400">{ord.email}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide font-extrabold border ${
                          ord.order_status === 'delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : ord.order_status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {ord.order_status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-800 font-extrabold">₹{parseFloat(ord.total_amount).toFixed(2)}</td>
                      <td className="p-4 pr-6">
                        <span className={`text-[10px] uppercase font-bold ${
                          ord.payment_status === 'paid' ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          {ord.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Category List */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-extrabold text-slate-800 text-sm">Store Categories</h2>
            <Link to="/admin/categories" className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">
              Manage
            </Link>
          </div>

          {categories.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">No categories registered.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div 
                  key={cat.category_id}
                  className="flex justify-between items-center text-xs font-semibold py-1.5 border-b border-slate-50 last:border-0"
                >
                  <span className="text-slate-800 font-extrabold">{cat.category_name}</span>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                    #CAT-{cat.category_id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
