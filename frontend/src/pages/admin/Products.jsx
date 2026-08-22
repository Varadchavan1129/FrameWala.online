// Products.jsx
// Admin product catalog CRUD panel with filters, multi-file uploads, and status parameters

import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImages } from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { FiPlus, FiEdit2, FiTrash2, FiFolderPlus, FiImage, FiX, FiSliders, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortByPrice, setSortByPrice] = useState('');
  const [sortByStock, setSortByStock] = useState('');

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Field values
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [customizable, setCustomizable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  // File upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Array of strings (URLs) on edit
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch all products (both active and inactive)
      const prodRes = await getProducts({ isActive: '' });
      const catRes = await getCategories();
      if (prodRes.success) setProducts(prodRes.data.products);
      if (catRes.success) setCategories(catRes.data.categories);
    } catch (error) {
      toast.error('Failed to load catalog inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeSelectedFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditOpen = (prod) => {
    setEditId(prod.product_id);
    setName(prod.product_name);
    setCategoryId(prod.category_id || '');
    setPrice(prod.price);
    setStock(prod.stock_quantity);
    setDescription(prod.description || '');
    setCustomizable(prod.is_customizable === 1 || prod.is_customizable === true);
    setIsActive(prod.is_active === 1 || prod.is_active === true);
    
    // Reset file uploads
    setSelectedFiles([]);
    setImagePreviews([]);
    
    // Set existing images
    setExistingImages(prod.images?.map(img => img.image_url) || []);
    setShowModal(true);
  };

  const handleCreateOpen = () => {
    setEditId(null);
    setName('');
    setCategoryId('');
    setPrice('');
    setStock('');
    setDescription('');
    setCustomizable(false);
    setIsActive(true);
    
    setSelectedFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation Checks
    if (!name.trim()) return toast.error('Product name is required.');
    if (!categoryId) return toast.error('Please select a product category.');
    if (!description.trim()) return toast.error('Product description is required.');
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return toast.error('Price must be a valid number greater than 0.');
    }

    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return toast.error('Stock must be a non-negative integer.');
    }

    try {
      setSaving(true);

      // 1. Upload new image files if any
      let uploadedUrls = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('images', file);
        });
        
        const uploadRes = await uploadImages(formData);
        if (uploadRes.success) {
          uploadedUrls = uploadRes.data.urls;
        }
      }

      // Combine existing URLs + newly uploaded URLs
      const finalImagesList = [...existingImages, ...uploadedUrls];

      const payload = {
        product_name: name,
        category_id: parseInt(categoryId),
        price: parsedPrice,
        stock_quantity: parsedStock,
        description,
        is_customizable: customizable ? 1 : 0,
        is_active: isActive ? 1 : 0,
        images: finalImagesList
      };

      if (editId) {
        // Update product details
        const res = await updateProduct(editId, payload);
        if (res.success) {
          toast.success('Product updated successfully.');
        }
      } else {
        // Create product
        const res = await createProduct(payload);
        if (res.success) {
          toast.success('Product created successfully.');
        }
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;

    try {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted.');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to delete product. Check if it is referenced in active orders.');
    }
  };

  // Client-side filtration & sorting logs
  let filteredProducts = products.filter(prod => {
    const matchesSearch = prod.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (prod.category_name && prod.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '' || Number(prod.category_id) === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Sort by Price
  if (sortByPrice === 'price-low') {
    filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortByPrice === 'price-high') {
    filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  // Sort by Stock
  if (sortByStock === 'low-stock') {
    filteredProducts.sort((a, b) => a.stock_quantity - b.stock_quantity);
  } else if (sortByStock === 'high-stock') {
    filteredProducts.sort((a, b) => b.stock_quantity - a.stock_quantity);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      
      {/* Title block with trigger button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Products Catalog</h2>
          <p className="text-slate-400 text-xs font-semibold">Track and edit FrameWala shop merchandise inventories</p>
        </div>
        
        <Button onClick={handleCreateOpen} size="small" className="font-bold flex items-center space-x-1 shrink-0">
          <FiPlus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold shrink-0">
          <FiSliders className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or category..."
          className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-48"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Sort Price */}
        <select
          value={sortByPrice}
          onChange={(e) => { setSortByPrice(e.target.value); setSortByStock(''); }}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
        >
          <option value="">Sort Price</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        {/* Sort Stock */}
        <select
          value={sortByStock}
          onChange={(e) => { setSortByStock(e.target.value); setSortByPrice(''); }}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
        >
          <option value="">Sort Stock</option>
          <option value="low-stock">Stock: Low to High</option>
          <option value="high-stock">Stock: High to Low</option>
        </select>
      </div>

      {/* Grid listing */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center">No products found matching filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] uppercase">
                  <th className="p-4 pl-6">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.product_id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={prod.primary_image || 'https://via.placeholder.com/100?text=No+Image'} 
                          alt={prod.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-slate-800">{prod.product_name}</td>
                    <td className="p-4 text-slate-500">{prod.category_name || 'Unassigned'}</td>
                    <td className="p-4 text-slate-800 font-extrabold">₹{parseFloat(prod.price).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`font-extrabold ${prod.stock_quantity === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                        {prod.stock_quantity === 0 ? 'Out of Stock' : prod.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wide font-extrabold border ${
                        prod.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        {prod.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleEditOpen(prod)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none inline-flex items-center"
                        title="Edit product"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.product_id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none inline-flex items-center"
                        title="Delete product"
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

      {/* Editor Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-4 shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <h3 className="font-extrabold text-slate-800 text-lg border-b pb-2 flex items-center space-x-2">
              <FiFolderPlus className="w-6 h-6 text-indigo-500" />
              <span>{editId ? 'Modify Product #FWP-' + editId : 'Introduce New Product'}</span>
            </h3>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wooden Photo Frame"
                className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="₹499"
                  className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Stock, Customizable, Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Stock Quantity *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="25"
                  className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="flex items-center justify-center pt-4">
                <label className="flex items-center space-x-2 text-xs text-slate-700 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customizable}
                    onChange={(e) => setCustomizable(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span>Customizable</span>
                </label>
              </div>

              <div className="flex items-center justify-center pt-4">
                <label className="flex items-center space-x-2 text-xs text-slate-700 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Description *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product details..."
                className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              ></textarea>
            </div>

            {/* Images Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Product Images</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="w-6 h-6 text-slate-400 mb-1" />
                    <p className="text-[10px] text-slate-500 font-bold">Select Images from Laptop</p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Image Previews grid (first image becomes default / primary automatically) */}
              {(imagePreviews.length > 0 || existingImages.length > 0) && (
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
                    Previews (First image is default):
                  </span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {/* Existing Images */}
                    {existingImages.map((url, idx) => (
                      <div key={'ext-' + idx} className="relative w-16 h-16 border rounded-xl overflow-hidden group">
                        <img src={url} alt="existing preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-0.5"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[8px] text-center font-bold uppercase py-0.5">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Newly Selected Image Files */}
                    {imagePreviews.map((url, idx) => (
                      <div key={'new-' + idx} className="relative w-16 h-16 border rounded-xl overflow-hidden group">
                        <img src={url} alt="new preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(idx)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-0.5"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                        {idx === 0 && existingImages.length === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[8px] text-center font-bold uppercase py-0.5">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-3 border-t">
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
                Save Changes
              </Button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default Products;
