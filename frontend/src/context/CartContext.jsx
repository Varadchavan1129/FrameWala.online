// CartContext.jsx
// Context API for managing customer shopping cart operations

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeCartItem } from '../services/cartService.js';
import { AuthContext } from './AuthContext.jsx';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart items when user logs in, reset cart when user logs out
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotalAmount(0);
      setCartTotalItems(0);
    }
  }, [user]);

  // Retrieve current cart contents
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      if (res.success) {
        setCartItems(res.data.items);
        setCartTotalAmount(res.data.total_amount);
        setCartTotalItems(res.data.total_items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a product to the cart
  const addToCart = async (productId, quantity = 1, customization = {}) => {
    if (!user) {
      toast.error('Please login to add items to your cart.');
      return false;
    }
    try {
      setLoading(true);
      const res = await addToCartAPI(productId, quantity, customization);
      if (res.success) {
        setCartItems(res.data.items);
        // Calculate totals locally or reload
        const newTotalAmount = res.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newTotalItems = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartTotalAmount(parseFloat(newTotalAmount.toFixed(2)));
        setCartTotalItems(newTotalItems);
        toast.success('Added to cart!');
        return true;
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to add item to cart.';
      toast.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity of cart item
  const updateQty = async (cartItemId, quantity) => {
    try {
      const res = await updateCartItem(cartItemId, quantity);
      if (res.success) {
        setCartItems(res.data.items);
        const newTotalAmount = res.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newTotalItems = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartTotalAmount(parseFloat(newTotalAmount.toFixed(2)));
        setCartTotalItems(newTotalItems);
        toast.success('Cart updated.');
        return true;
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update item quantity.';
      toast.error(errMsg);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const res = await removeCartItem(cartItemId);
      if (res.success) {
        setCartItems(res.data.items);
        const newTotalAmount = res.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newTotalItems = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartTotalAmount(parseFloat(newTotalAmount.toFixed(2)));
        setCartTotalItems(newTotalItems);
        toast.success('Removed from cart.');
        return true;
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to remove item.';
      toast.error(errMsg);
      return false;
    }
  };

  // Clear cart states locally (used after checkout)
  const clearCart = () => {
    setCartItems([]);
    setCartTotalAmount(0);
    setCartTotalItems(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotalAmount,
        cartTotalItems,
        loading,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
