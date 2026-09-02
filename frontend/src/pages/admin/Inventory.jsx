// Inventory.jsx
// Admin Inventory and stock alerts panel

import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '../../services/productService.js';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { FiDatabase, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Restock form states
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      if (res.success) {
        // Filter products with stock <= 5
        const lowStockItems = res.data.products.filter(p => p.stock_quantity <= 5);
        setProducts(lowStockItems);
      }
    } catch (error) {
      toast.error('Failed to load inventory stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockProduct || !restockQty) return;

    try {
      setSaving(true);
      const newStock = parseInt(restockProduct.stock_quantity) + parseInt(restockQty);
      
      const res = await updateProduct(restockProduct.product_id, {
        product_name: restockProduct.product_name,
        price: restockProduct.price,
        stock_quantity: newStock,
        is_customizable: restockProduct.is_customizable
      });

      if (res.success) {
        toast.success(`Restocked ${restockProduct.product_name} successfully.`);
        setRestockProduct(null);
        setRestockQty('');
        loadInventory();
      }
    } catch (error) {
      toast.error('Failed to update stock.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-bold text-slate-800">Inventory Alerts</h2>
        <p className="text-slate-400 text-xs font-semibold">Real-time alerts for products running low on stock (5 units or less)</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">All Stock Levels Secure</h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto">All active products currently have sufficient inventory levels.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock Remaining</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-extrabold text-slate-800">#FWP-{prod.product_id}</td>
                    <td className="p-4 font-extrabold text-slate-800">{prod.product_name}</td>
                    <td className="p-4 text-slate-500">{prod.category_name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wide font-extrabold border bg-red-50 text-red-600 border-red-200`}>
                        {prod.stock_quantity === 0 ? 'Out of Stock' : `Only ${prod.stock_quantity} left`}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => { setRestockProduct(prod); setRestockQty(''); }}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-[10px] uppercase rounded-lg hover:bg-indigo-700 active:scale-95"
                      >
                        Quick Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock dialog overlay */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleRestockSubmit}
            className="bg-white border border-slate-100 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-extrabold text-slate-800 text-base border-b pb-2 flex items-center space-x-2">
              <FiDatabase className="w-5 h-5 text-indigo-500" />
              <span>Quick Restock: {restockProduct.product_name}</span>
            </h3>

            <p className="text-slate-400 text-xs">
              Current stock: <span className="font-bold text-slate-800">{restockProduct.stock_quantity} unit(s)</span>. 
              Enter the quantity you wish to add to inventory:
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Restock Quantity</label>
              <input
                type="number"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                required
                min="1"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t">
              <Button
                onClick={() => setRestockProduct(null)}
                variant="secondary"
                size="small"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={saving}
                size="small"
              >
                Add Stock
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Inventory;
