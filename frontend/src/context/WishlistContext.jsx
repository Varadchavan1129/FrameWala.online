// WishlistContext.jsx
// Context API for managing customer wishlist

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService.js';
import { AuthContext } from './AuthContext.jsx';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync wishlist upon authentication
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getWishlist();
      if (res.success) {
        setWishlistItems(res.data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle adding or removing items from wishlist
  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to use your wishlist.');
      return false;
    }

    const itemExists = wishlistItems.some((item) => item.product_id == productId);
    try {
      if (itemExists) {
        // Remove it
        const res = await removeFromWishlist(productId);
        if (res.success) {
          setWishlistItems(res.data.wishlist);
          toast.success('Removed from wishlist.');
          return true;
        }
      } else {
        // Add it
        const res = await addToWishlist(productId);
        if (res.success) {
          setWishlistItems(res.data.wishlist);
          toast.success('Added to wishlist!');
          return true;
        }
      }
    } catch (error) {
      toast.error('Failed to update wishlist.');
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.product_id == productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
export const useWishlist = () => useContext(WishlistContext);
