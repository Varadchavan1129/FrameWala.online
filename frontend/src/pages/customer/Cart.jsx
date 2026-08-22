// Cart.jsx
// Shopping Cart checklist page

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext.jsx';
import Button from '../../components/common/Button.jsx';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus, FiGift } from 'react-icons/fi';

const renderCartItemThumbnail = (item) => {
  const isMug = (item.product_name || '').toLowerCase().includes('mug') || 
                (item.category_name || '').toLowerCase().includes('mug');

  if (isMug && (item.custom_image_url || item.custom_text)) {
    let parsedText = null;
    let name = '';
    let message = '';
    let bold = true;
    let italic = false;
    let align = 'center';
    let textRotation = 0;
    let textX = 0;
    let textY = 80;

    if (item.custom_text) {
      try {
        parsedText = JSON.parse(item.custom_text);
        name = parsedText.name || '';
        message = parsedText.message || '';
        bold = parsedText.bold !== undefined ? parsedText.bold : true;
        italic = parsedText.italic || false;
        align = parsedText.align || 'center';
        textRotation = parsedText.textRotation || 0;
        textX = parsedText.textX || 0;
        textY = parsedText.textY || 80;
      } catch (e) {
        name = item.custom_text;
      }
    }

    const combinedText = [name.trim(), message.trim()].filter(Boolean).join('\n');
    const previewImageUrl = item.custom_image_url || 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=500';
    const scaleFactor = 0.25;

    return (
      <div className="relative w-20 h-20 bg-slate-950 flex items-center justify-center rounded-xl overflow-hidden shadow-inner select-none shrink-0 border border-slate-100">
        <img 
          src={item.primary_image || 'https://images.cloudinary.com/framewala/white_mug.jpg'} 
          alt={item.product_name}
          className="w-18 h-18 object-contain pointer-events-none z-10" 
        />
        <div 
          className="absolute border border-dashed border-indigo-500/50 overflow-hidden z-20"
          style={{
            width: `${124 * scaleFactor}px`,
            height: `${142 * scaleFactor}px`,
            top: `${95 * scaleFactor}px`,
            left: `${110 * scaleFactor}px`,
            borderRadius: '1.5px',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={previewImageUrl}
              alt="custom preview"
              className="max-w-none origin-center pointer-events-none"
              style={{
                transform: `translate(${item.custom_position_x * scaleFactor}px, ${item.custom_position_y * scaleFactor}px) scale(${item.custom_scale}) rotate(${item.custom_rotation}deg)`,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          {combinedText.trim() && (
            <div
              className="absolute z-10 select-none whitespace-pre-line pointer-events-none font-medium"
              style={{
                transform: `translate(${textX * scaleFactor}px, ${textY * scaleFactor}px) rotate(${textRotation}deg)`,
                fontFamily: item.custom_font || 'system-ui, sans-serif',
                fontSize: `${Math.max(4, item.custom_font_size * scaleFactor)}px`,
                color: item.custom_font_color || '#ffffff',
                fontWeight: bold ? 'bold' : 'normal',
                fontStyle: italic ? 'italic' : 'normal',
                textAlign: align,
                lineHeight: '1.25',
                width: '28px',
                wordBreak: 'break-word'
              }}
            >
              {combinedText}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 bg-slate-50 border rounded-xl overflow-hidden shrink-0">
      <img 
        src={item.primary_image || 'https://via.placeholder.com/150?text=No+Image'} 
        alt={item.product_name}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const renderCartItemTextDetails = (item) => {
  if (!item.custom_text) return null;

  let name = '';
  let message = '';
  let isJson = false;

  try {
    const parsed = JSON.parse(item.custom_text);
    name = parsed.name || '';
    message = parsed.message || '';
    isJson = true;
  } catch (e) {
    name = item.custom_text;
  }

  return (
    <div className="flex flex-col gap-1">
      {isJson ? (
        <>
          {name && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Name:</span>
              <span className="font-extrabold text-slate-800">"{name}"</span>
            </div>
          )}
          {message && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">Message:</span>
              <span className="font-extrabold text-slate-800">"{message}"</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">Custom Text:</span>
          <span className="font-extrabold text-slate-800">"{name}"</span>
        </div>
      )}

      <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
        {item.custom_font && (
          <span className="text-[9px] bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 font-bold">
            Font: {item.custom_font.split(',')[0]}
          </span>
        )}
        {item.custom_font_size && (
          <span className="text-[9px] bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 font-bold">
            Size: {item.custom_font_size}px
          </span>
        )}
        {item.custom_font_color && (
          <span className="text-[9px] bg-slate-200/60 px-1.5 py-0.5 rounded text-slate-600 font-bold flex items-center space-x-1">
            <span>Color:</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: item.custom_font_color }}></span>
          </span>
        )}
      </div>
    </div>
  );
};

const Cart = () => {
  const { cartItems, cartTotalAmount, cartTotalItems, updateQty, removeFromCart, loading } = useContext(CartContext);

  const handleQtyChange = (cartItemId, currentQty, stock, increment) => {
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    if (newQty <= 0) return;
    if (increment && newQty > stock) {
      alert(`Sorry, only ${stock} items available in stock.`);
      return;
    }
    updateQty(cartItemId, newQty);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <FiShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-800">Your Cart is Empty</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Looks like you haven't added any customized items to your cart yet. Explore our custom frames, mugs, and keychains to start gifting.
          </p>
        </div>
        <Link to="/products" className="block">
          <Button className="w-full text-xs font-bold py-3">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
        <p className="text-slate-400 text-sm mt-1">Review your customized selections and proceed to shipping details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.cart_item_id}
              className="flex items-center bg-white border border-slate-100 p-4 rounded-2xl gap-4 hover:shadow-xs transition-shadow"
            >
              {/* Product Thumbnail */}
              {renderCartItemThumbnail(item)}

              {/* Title & Customization check */}
              <div className="flex-grow space-y-1.5 min-w-0">
                <Link to={`/product/${item.product_id}`} className="font-extrabold text-slate-800 text-sm hover:text-indigo-600 transition-colors line-clamp-1">
                  {item.product_name}
                </Link>
                <div className="flex items-center space-x-2 text-[10px]">
                  <span className="text-slate-400 font-semibold">Unit Price: ₹{parseFloat(item.price).toFixed(2)}</span>
                  {item.is_customizable ? (
                    <span className="bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                      Customizable
                    </span>
                  ) : null}
                </div>

                {/* Customization Details Indicator */}
                {(item.custom_image_url || item.custom_text) && (
                  <div className="mt-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1.5 text-[10px] select-none">
                    <div className="flex items-center space-x-2 text-slate-500 font-bold uppercase tracking-wider">
                      <FiGift className="w-3.5 h-3.5 text-amber-600" />
                      <span>Applied Customization Details</span>
                    </div>
                    {item.custom_image_url && (
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Custom Image Preview:</span>
                        <a 
                          href={item.custom_image_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 font-bold hover:underline truncate max-w-[150px]"
                        >
                          View Uploaded Photo
                        </a>
                      </div>
                    )}
                    {item.custom_text && renderCartItemTextDetails(item)}
                  </div>
                )}
              </div>

              {/* Quantity selectors */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50/50">
                <button
                  onClick={() => handleQtyChange(item.cart_item_id, item.quantity, item.stock_quantity, false)}
                  className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-500 focus:outline-none transition-colors"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 py-1.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                <button
                  onClick={() => handleQtyChange(item.cart_item_id, item.quantity, item.stock_quantity, true)}
                  className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-500 focus:outline-none transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price Calculation & Delete action */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-extrabold text-slate-800 text-sm mb-1">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.cart_item_id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete item"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Price Invoice sidebar summary */}
        <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl h-fit space-y-6 shadow-xs">
          <h3 className="font-extrabold text-slate-800 text-base border-b border-slate-100 pb-3">Order Summary</h3>
          
          <div className="space-y-3.5 text-xs font-semibold">
            <div className="flex justify-between text-slate-400">
              <span>Total Items</span>
              <span className="text-slate-800 font-extrabold">{cartTotalItems} items</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-800 font-extrabold">₹{cartTotalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping Fee</span>
              <span className="text-emerald-600 font-extrabold uppercase">Free</span>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-sm">
              <span className="text-slate-800 font-extrabold">Estimated Total</span>
              <span className="text-indigo-600 font-black">₹{cartTotalAmount.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="block pt-2">
            <Button className="w-full py-3 text-sm font-bold shadow-lg shadow-indigo-100">
              <span>Checkout Orders</span>
              <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Cart;
