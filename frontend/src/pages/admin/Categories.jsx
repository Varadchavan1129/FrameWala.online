// Categories.jsx
// Admin categories management dashboard

import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { FiPlus, FiEdit2, FiTrash2, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategoriesList();
  }, []);

  const loadCategoriesList = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (cat) => {
    setEditId(cat.category_id);
    setName(cat.category_name);
    setDescription(cat.description || '');
    setShowModal(true);
  };

  const handleCreateOpen = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Category name is required.');
      return;
    }

    const payload = {
      category_name: name,
      description
    };

    try {
      setSaving(true);
      if (editId) {
        const res = await updateCategory(editId, payload);
        if (res.success) toast.success('Category updated successfully.');
      } else {
        const res = await createCategory(payload);
        if (res.success) toast.success('Category created successfully.');
      }
      setShowModal(false);
      loadCategoriesList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This might affect products catalog mappings.')) return;

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        toast.success('Category deleted.');
        loadCategoriesList();
      }
    } catch (error) {
      toast.error('Failed to delete category.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Product Categories</h2>
          <p className="text-slate-400 text-xs font-semibold">Manage classification tags for customized gifts</p>
        </div>
        
        <Button onClick={handleCreateOpen} size="small" className="font-bold flex items-center space-x-1">
          <FiPlus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Grid Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No categories found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.category_id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-extrabold text-slate-800">#CAT-{cat.category_id}</td>
                    <td className="p-4 font-extrabold text-slate-800">{cat.category_name}</td>
                    <td className="p-4 text-slate-500 max-w-sm truncate">{cat.description || 'N/A'}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleEditOpen(cat)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none inline-flex items-center"
                        title="Edit category"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.category_id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none inline-flex items-center"
                        title="Delete category"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white border border-slate-100 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-extrabold text-slate-800 text-base border-b pb-2 flex items-center space-x-2">
              <FiLayers className="w-5 h-5 text-indigo-500" />
              <span>{editId ? 'Edit Category #CAT-' + editId : 'Create Category'}</span>
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Printed T-Shirts"
                className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category details..."
                className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t">
              <Button
                onClick={() => setShowModal(false)}
                variant="secondary"
                size="small"
              >
                Close
              </Button>
              <Button
                type="submit"
                loading={saving}
                size="small"
              >
                Save Category
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Categories;
