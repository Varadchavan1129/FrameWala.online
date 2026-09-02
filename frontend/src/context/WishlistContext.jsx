// WishlistContext.jsx
// Guest-friendly wishlist backed by localStorage (no backend).

import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

const WL_KEY = 'framewala_wishlist';
const load = () => {
  try {
    const raw = localStorage.getItem(WL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(load);

  useEffect(() => {
    localStorage.setItem(WL_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (id) => wishlistItems.some((i) => String(i.id) === String(id));

  const toggleWishlist = (product) => {
    const id = product.id ?? product;
    if (isInWishlist(id)) {
      setWishlistItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
      toast.success('Removed from wishlist.');
    } else {
      const item = typeof product === 'object'
        ? { id: product.id, name: product.name, price: product.price, image: product.primary_image }
        : { id };
      setWishlistItems((prev) => [...prev, item]);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
