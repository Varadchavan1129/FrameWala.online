// CartContext.jsx
// Guest-friendly cart backed by localStorage (no backend).

import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

const CART_KEY = 'framewala_cart';
const load = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(load);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const cartTotalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const addToCart = (product, quantity = 1, options = {}) => {
    const lineId = `${product.id}-${options.size || ''}-${options.finish || ''}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          lineId,
          id: product.id,
          name: product.name,
          price: options.price ?? product.price,
          image: options.image || product.primary_image,
          size: options.size || null,
          finish: options.finish || null,
          is_customizable: product.is_customizable,
          custom_image: options.custom_image || null,
          quantity,
        },
      ];
    });
    toast.success('Added to cart!');
    return true;
  };

  const updateQty = (lineId, quantity) => {
    if (quantity <= 0) return removeFromCart(lineId);
    setCartItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)));
  };

  const removeFromCart = (lineId) => {
    setCartItems((prev) => prev.filter((i) => i.lineId !== lineId));
    toast.success('Removed from cart.');
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, cartTotalItems, cartTotalAmount, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
