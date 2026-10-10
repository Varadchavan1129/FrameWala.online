// WishlistContext.jsx
// Hybrid wishlist: backend API for logged-in customers, localStorage fallback for guests.

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getWishlist, addToWishlist as apiAdd, removeFromWishlist as apiRemove } from '../services/wishlistService.js';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

const WL_KEY = 'framewala_wishlist';
const loadLocal = () => {
  try {
    const raw = localStorage.getItem(WL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const getToken = () => localStorage.getItem('customer_token');

  // --- Load wishlist from backend or localStorage ---
  const loadWishlist = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        const res = await getWishlist();
        if (res.success && res.data) {
          const items = (res.data.wishlist || []).map((item) => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
            image: item.primary_image || '/images/products/product_01.jpg',
          }));
          setWishlistItems(items);
        }
      } catch (err) {
        console.error('Failed to load wishlist from API:', err.message);
        setWishlistItems(loadLocal());
      }
    } else {
      setWishlistItems(loadLocal());
    }
  }, []);

  useEffect(() => {
    loadWishlist();

    const handleStorage = (e) => {
      if (e.key === 'customer_token') loadWishlist();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadWishlist]);

  // Persist guest wishlist to localStorage
  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem(WL_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  const isInWishlist = (id) => wishlistItems.some((i) => String(i.id) === String(id));

  const toggleWishlist = async (product) => {
    const id = product.id ?? product.product_id ?? product;
    const token = getToken();

    if (isInWishlist(id)) {
      // Remove
      if (token) {
        try {
          const res = await apiRemove(id);
          if (res.success) {
            await loadWishlist();
            toast.success('Removed from wishlist.');
          }
        } catch (err) {
          toast.error('Failed to remove from wishlist.');
        }
      } else {
        setWishlistItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
        toast.success('Removed from wishlist.');
      }
    } else {
      // Add
      if (token) {
        try {
          const res = await apiAdd(id);
          if (res.success) {
            await loadWishlist();
            toast.success('Added to wishlist!');
          }
        } catch (err) {
          const msg = err.response?.data?.message || 'Failed to add to wishlist.';
          toast.error(msg);
        }
      } else {
        const item = typeof product === 'object'
          ? { id: product.id || product.product_id, name: product.name || product.product_name, price: product.price, image: product.primary_image }
          : { id };
        setWishlistItems((prev) => [...prev, item]);
        toast.success('Added to wishlist!');
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlist, loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

