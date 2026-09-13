// CartContext.jsx
// Hybrid cart: backend API for logged-in customers, localStorage fallback for guests.

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from '../services/cartService.js';
import toast from 'react-hot-toast';

export const CartContext = createContext();

const CART_KEY = 'framewala_cart';
const loadLocal = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Detect logged-in customer
  const getToken = () => localStorage.getItem('customer_token');

  // --- Load cart from backend or localStorage ---
  const loadCart = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        setLoading(true);
        // Sync any guest cart items from localStorage first
        const local = loadLocal();
        if (local && local.length > 0) {
          for (const item of local) {
            try {
              await apiAddToCart(item.id, item.quantity, {
                custom_image_url: item.custom_image || undefined,
                custom_text: item.custom_text || undefined,
                design_json: item.design_json || undefined,
                preview_image: item.preview_image || undefined,
                template_name: item.template_name || undefined,
              });
            } catch (e) {
              console.error('Error syncing local item to API:', e);
            }
          }
          localStorage.removeItem(CART_KEY);
        }

        const res = await getCart();
        if (res.success && res.data) {
          const items = (res.data.items || []).map((item) => ({
            lineId: `${item.cart_item_id}`,
            cart_item_id: item.cart_item_id,
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
            image: item.primary_image || '/images/products/product_01.jpg',
            size: item.size || null,
            finish: item.finish || null,
            is_customizable: item.is_customizable,
            custom_image: item.custom_image_url || null,
            quantity: item.quantity,
          }));
          setCartItems(items);
        }
      } catch (err) {
        console.error('Failed to load cart from API:', err.message);
        // Fallback to localStorage if API fails
        setCartItems(loadLocal());
      } finally {
        setLoading(false);
      }
    } else {
      setCartItems(loadLocal());
      setLoading(false);
    }
  }, []);

  // Load cart on mount and when token changes
  useEffect(() => {
    loadCart();

    // Listen for storage events (login/logout in another tab, or token changes)
    const handleStorage = (e) => {
      if (e.key === 'customer_token') loadCart();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadCart]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // --- Computed values ---
  const cartTotalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // --- Add to cart ---
  const addToCart = async (product, quantity = 1, options = {}) => {
    const token = getToken();
    if (token) {
      try {
        const res = await apiAddToCart(product.id || product.product_id, quantity, {
          custom_image_url: options.custom_image || undefined,
          custom_text: options.custom_text || undefined,
          design_json: options.design_json || undefined,
          preview_image: options.preview_image || undefined,
          template_name: options.template_name || undefined,
        });
        if (res.success) {
          await loadCart();
          toast.success('Added to cart!');
          return true;
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to add to cart.';
        toast.error(msg);
        return false;
      }
    } else {
      // Guest: localStorage
      const lineId = `${product.id || product.product_id}-${options.size || ''}-${options.finish || ''}`;
      setCartItems((prev) => {
        const existing = prev.find((i) => i.lineId === lineId);
        if (existing) {
          return prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i));
        }
        return [
          ...prev,
          {
            lineId,
            id: product.id || product.product_id,
            name: product.name || product.product_name,
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
    }
  };

  // --- Update quantity ---
  const updateQty = async (lineId, quantity) => {
    if (quantity <= 0) return removeFromCart(lineId);

    const token = getToken();
    if (token) {
      const item = cartItems.find((i) => i.lineId === lineId);
      if (!item?.cart_item_id) return;
      try {
        const res = await updateCartItem(item.cart_item_id, quantity);
        if (res.success) await loadCart();
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to update quantity.';
        toast.error(msg);
      }
    } else {
      setCartItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)));
    }
  };

  // --- Remove item ---
  const removeFromCart = async (lineId) => {
    const token = getToken();
    if (token) {
      const item = cartItems.find((i) => i.lineId === lineId);
      if (!item?.cart_item_id) return;
      try {
        const res = await removeCartItem(item.cart_item_id);
        if (res.success) {
          await loadCart();
          toast.success('Removed from cart.');
        }
      } catch (err) {
        toast.error('Failed to remove item.');
      }
    } else {
      setCartItems((prev) => prev.filter((i) => i.lineId !== lineId));
      toast.success('Removed from cart.');
    }
  };

  // --- Clear cart ---
  const clearCart = () => {
    setCartItems([]);
    if (!getToken()) localStorage.setItem(CART_KEY, JSON.stringify([]));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartTotalItems, cartTotalAmount, addToCart, updateQty, removeFromCart, clearCart, loadCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

