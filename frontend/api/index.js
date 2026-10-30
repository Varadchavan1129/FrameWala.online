// frontend/api/index.js
// FrameWala.online — Vercel Serverless Express API with Supabase PostgreSQL & Storage

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { supabase, isSupabaseConfigured, getSupabaseMeta } from './supabase.js';

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response helpers
const sendSuccess = (message = 'Success', data = {}) => ({ success: true, message, data });
const sendError = (message = 'Error occurred', error = {}) => ({
  success: false,
  message,
  error: error instanceof Error ? { message: error.message } : error,
});

// Authentication middleware
const JWT_SECRET = process.env.JWT_SECRET || 'framewala_jwt_super_secret_key_123!';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(sendError('Access Token required.', { details: 'No token provided' }));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json(sendError('Invalid or expired token.', { details: err.message }));
    }
    req.user = decoded;
    next();
  });
};

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Multer memory storage for serverless file uploads
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// ==============================================================================
// 1. Health & Root
// ==============================================================================
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let diagnostics = {};
  if (isSupabaseConfigured()) {
    try {
      const meta = getSupabaseMeta();
      const isAnon = meta.keyRole === 'anon-publishable-key' || (meta.serviceKeyPrefix && meta.serviceKeyPrefix.startsWith('sb_publish'));
      
      const { data: catData, error: catErr, count: catCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact' });
      const { data: prodData, error: prodErr, count: prodCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' });
      const { data: imgData, error: imgErr, count: imgCount } = await supabase
        .from('product_images')
        .select('*', { count: 'exact' });
      const { data: testData, error: testErr } = await supabase
        .from('connection_test')
        .select('*')
        .limit(1);

      diagnostics = {
        supabase_meta: {
          ...meta,
          isUsingAnonKey: isAnon,
          serviceRoleKeyValid: !isAnon && meta.hasServiceRoleKey,
        },
        rls_status_hint: isAnon
          ? 'SUPABASE_SERVICE_ROLE_KEY in Vercel is set to publishable key (sb_publishable_...). If tables have RLS enabled, anon queries return empty arrays unless public SELECT policies or GRANTs are executed in Supabase SQL editor.'
          : 'Service role key detected.',
        categories_count: catCount !== null ? catCount : (catData ? catData.length : 0),
        categories_data: catData || [],
        categories_error: catErr ? catErr.message : null,
        products_count: prodCount !== null ? prodCount : (prodData ? prodData.length : 0),
        products_data: prodData || [],
        products_error: prodErr ? prodErr.message : null,
        images_count: imgCount !== null ? imgCount : (imgData ? imgData.length : 0),
        images_error: imgErr ? imgErr.message : null,
        connection_test: testErr ? testErr.message : 'ok'
      };

      if (!testErr && !prodErr) dbStatus = 'connected';
      else dbStatus = `supabase error: ${(testErr || prodErr).message}`;
    } catch (e) {
      dbStatus = `query failed: ${e.message}`;
    }
  }

  const isHealthy = dbStatus === 'connected';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'OK' : 'DEGRADED',
    runtime: 'Vercel Serverless Function',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    diagnostics
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'FrameWala Vercel Serverless API Running' });
});

// ==============================================================================
// 2. Categories & Products
// ==============================================================================
app.get('/api/categories', async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { data, error } = await supabase.from('categories').select('*').order('category_id');
    if (error) throw error;
    res.status(200).json(sendSuccess('Categories retrieved', { categories: data || [] }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.get('/api/products', async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { categoryId, minPrice, maxPrice, search, isCustomizable } = req.query;

    let query = supabase
      .from('products')
      .select('*, categories(category_name), product_images(image_url, is_primary, display_order)')
      .or('is_active.eq.true,is_active.is.null');

    if (categoryId) query = query.eq('category_id', categoryId);
    if (minPrice) query = query.gte('price', minPrice);
    if (maxPrice) query = query.lte('price', maxPrice);
    if (isCustomizable !== undefined && isCustomizable !== '') {
      query = query.eq('is_customizable', isCustomizable === 'true' || isCustomizable === true);
    }
    if (search) {
      query = query.ilike('product_name', `%${search}%`);
    }

    let data, error;
    try {
      const resQuery = await query.order('product_id');
      data = resQuery.data;
      error = resQuery.error;
    } catch (qErr) {
      error = qErr;
    }

    // Fallback: If joined query errored due to relationship schema cache, try direct query
    if (error) {
      console.warn('[Vercel Serverless] Joined query failed, falling back to direct products query:', error.message);
      let fallbackQuery = supabase
        .from('products')
        .select('*')
        .or('is_active.eq.true,is_active.is.null');
      if (categoryId) fallbackQuery = fallbackQuery.eq('category_id', categoryId);
      const fallbackRes = await fallbackQuery.order('product_id');
      if (fallbackRes.error) throw fallbackRes.error;
      data = fallbackRes.data;
    }

    const mapped = (data || []).map((p) => {
      const primaryImg =
        p.product_images?.find((img) => img.is_primary)?.image_url ||
        p.product_images?.[0]?.image_url ||
        '/images/products/product_01.jpg';
      return {
        ...p,
        product_code: p.product_code || `FW-FRM-${String(p.product_id).padStart(4, '0')}`,
        category_name: p.categories?.category_name || '',
        primary_image: primaryImg,
      };
    });

    res.status(200).json(sendSuccess('Products retrieved successfully', { products: mapped }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.get('/api/products/:id', async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(category_name), product_images(*)')
      .eq('product_id', id)
      .single();

    if (error || !data) return res.status(404).json(sendError('Product not found'));

    const primaryImg =
      data.product_images?.find((img) => img.is_primary)?.image_url ||
      data.product_images?.[0]?.image_url ||
      '/images/products/product_01.jpg';

    const product = {
      ...data,
      product_code: data.product_code || `FW-FRM-${String(data.product_id).padStart(4, '0')}`,
      category_name: data.categories?.category_name || '',
      primary_image: primaryImg,
      images: data.product_images || [],
    };

    res.status(200).json(sendSuccess('Product retrieved', { product }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

// ==============================================================================
// 3. Customer Authentication & Profile
// ==============================================================================
app.post('/api/auth/register', async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { first_name, last_name, email, phone, password } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json(sendError('Please fill in all required fields'));
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return res.status(400).json(sendError('Email address is already registered.'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          first_name,
          last_name,
          email: email.toLowerCase().trim(),
          phone: phone || null,
          password: hashedPassword,
          role: 'customer',
        },
      ])
      .select('user_id, first_name, last_name, email, phone, role')
      .single();

    if (error) throw error;

    const token = generateToken(newUser);
    res.status(201).json(sendSuccess('User registered successfully.', { user: newUser, token }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(sendError('Email and password are required'));
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return res.status(401).json(sendError('Invalid email or password.'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(sendError('Invalid email or password.'));
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPass } = user;
    res.status(200).json(sendSuccess('Login successful.', { user: userWithoutPass, token }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, first_name, last_name, email, phone, role, created_at')
      .eq('user_id', req.user.user_id)
      .single();

    if (error || !user) return res.status(404).json(sendError('User not found'));
    res.status(200).json(sendSuccess('Profile retrieved', { user }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { first_name, last_name, phone } = req.body;
    const { data: updated, error } = await supabase
      .from('users')
      .update({ first_name, last_name, phone })
      .eq('user_id', req.user.user_id)
      .select('user_id, first_name, last_name, email, phone, role')
      .single();

    if (error) throw error;
    res.status(200).json(sendSuccess('Profile updated', { user: updated }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { current_password, new_password } = req.body;
    const { data: user } = await supabase.from('users').select('password').eq('user_id', req.user.user_id).single();

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) return res.status(400).json(sendError('Current password incorrect'));

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await supabase.from('users').update({ password: hashedPassword }).eq('user_id', req.user.user_id);
    res.status(200).json(sendSuccess('Password updated successfully'));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  res.status(200).json(sendSuccess('If that email is registered, we have sent instructions to reset the password.'));
});

// Addresses
app.get('/api/auth/addresses', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.user_id)
      .order('address_id', { ascending: false });

    if (error) throw error;
    res.status(200).json(sendSuccess('Addresses retrieved', { addresses: data }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.post('/api/auth/addresses', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { full_name, phone, address_line, city, state, pincode } = req.body;
    const { data, error } = await supabase
      .from('addresses')
      .insert([{ user_id: req.user.user_id, full_name, phone, address_line, city, state, pincode }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(sendSuccess('Address added', { address: data }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.put('/api/auth/addresses/:id', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { full_name, phone, address_line, city, state, pincode } = req.body;
    const { data, error } = await supabase
      .from('addresses')
      .update({ full_name, phone, address_line, city, state, pincode })
      .eq('address_id', id)
      .eq('user_id', req.user.user_id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(sendSuccess('Address updated', { address: data }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.delete('/api/auth/addresses/:id', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { error } = await supabase.from('addresses').delete().eq('address_id', id).eq('user_id', req.user.user_id);
    if (error) throw error;
    res.status(200).json(sendSuccess('Address deleted'));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

// ==============================================================================
// 4. Cart & Wishlist
// ==============================================================================
const getOrCreateCart = async (userId) => {
  let { data: cart } = await supabase.from('cart').select('cart_id').eq('user_id', userId).single();
  if (!cart) {
    const { data: newCart } = await supabase.from('cart').insert([{ user_id: userId }]).select('cart_id').single();
    cart = newCart;
  }
  return cart.cart_id;
};

app.get('/api/cart', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const cartId = await getOrCreateCart(req.user.user_id);
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*, products(product_name, price, stock_quantity, product_images(image_url, is_primary))')
      .eq('cart_id', cartId)
      .order('cart_item_id');

    if (error) throw error;

    let subtotal = 0;
    const mappedItems = (items || []).map((item) => {
      const price = parseFloat(item.products?.price || 0);
      const primaryImg =
        item.products?.product_images?.find((img) => img.is_primary)?.image_url ||
        item.products?.product_images?.[0]?.image_url ||
        '/images/products/product_01.jpg';

      subtotal += price * item.quantity;

      return {
        cart_item_id: item.cart_item_id,
        product_id: item.product_id,
        product_name: item.products?.product_name || '',
        price,
        quantity: item.quantity,
        primary_image: primaryImg,
        custom_image_url: item.custom_image_url,
        custom_text: item.custom_text,
      };
    });

    res.status(200).json(sendSuccess('Cart loaded', { items: mappedItems, subtotal }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.post('/api/cart/items', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { product_id, quantity = 1, custom_image_url, custom_text } = req.body;
    const cartId = await getOrCreateCart(req.user.user_id);

    const { data: existing } = await supabase
      .from('cart_items')
      .select('cart_item_id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', product_id)
      .single();

    if (existing && !custom_image_url && !custom_text) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('cart_item_id', existing.cart_item_id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(sendSuccess('Item quantity updated in cart', data));
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ cart_id: cartId, product_id, quantity, custom_image_url, custom_text }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(sendSuccess('Item added to cart', data));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.put('/api/cart/items/:id', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('cart_item_id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(sendSuccess('Cart item updated', data));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.delete('/api/cart/items/:id', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { error } = await supabase.from('cart_items').delete().eq('cart_item_id', id);
    if (error) throw error;
    res.status(200).json(sendSuccess('Item removed from cart'));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

// Wishlist
app.get('/api/wishlist', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { data, error } = await supabase
      .from('wishlist')
      .select('wishlist_id, product_id, products(product_id, product_name, price, product_images(image_url, is_primary))')
      .eq('user_id', req.user.user_id);

    if (error) throw error;

    const wishlist = (data || []).map((w) => {
      const primaryImg =
        w.products?.product_images?.find((img) => img.is_primary)?.image_url ||
        w.products?.product_images?.[0]?.image_url ||
        '/images/products/product_01.jpg';
      return {
        wishlist_id: w.wishlist_id,
        product_id: w.product_id,
        product_name: w.products?.product_name || '',
        price: w.products?.price || 0,
        primary_image: primaryImg,
      };
    });

    res.status(200).json(sendSuccess('Wishlist retrieved', { wishlist }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.post('/api/wishlist', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { product_id } = req.body;
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: req.user.user_id, product_id }])
      .select()
      .single();

    if (error && error.code === '23505') {
      return res.status(200).json(sendSuccess('Item already in wishlist'));
    }
    if (error) throw error;
    res.status(201).json(sendSuccess('Item added to wishlist', data));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.delete('/api/wishlist/:id', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { error } = await supabase.from('wishlist').delete().eq('user_id', req.user.user_id).eq('product_id', id);
    if (error) throw error;
    res.status(200).json(sendSuccess('Item removed from wishlist'));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

// ==============================================================================
// 5. Orders & Checkout
// ==============================================================================
app.post('/api/orders', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { address_id, payment_method } = req.body;
    if (!address_id) return res.status(400).json(sendError('Address ID is required'));
    if (payment_method === 'COD') {
      return res.status(400).json(sendError('Cash on Delivery is not supported. Please use a prepaid method.'));
    }

    const { data: address } = await supabase
      .from('addresses')
      .select('*')
      .eq('address_id', address_id)
      .eq('user_id', req.user.user_id)
      .single();

    if (!address) return res.status(400).json(sendError('Invalid address selection'));

    const cartId = await getOrCreateCart(req.user.user_id);
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('*, products(product_name, price, stock_quantity)')
      .eq('cart_id', cartId);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json(sendError('Your shopping cart is empty'));
    }

    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += parseFloat(item.products?.price || 0) * item.quantity;
    });
    const delivery = subtotal >= 999 ? 0 : 60;
    const total_amount = subtotal + delivery;

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([
        {
          user_id: req.user.user_id,
          address_id,
          total_amount,
          order_status: 'pending',
          payment_status: 'pending',
        },
      ])
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Insert order items
    const orderItemsToInsert = cartItems.map((item) => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products?.price,
      custom_image_url: item.custom_image_url,
      custom_text: item.custom_text,
    }));
    await supabase.from('order_items').insert(orderItemsToInsert);

    // Insert payment record
    await supabase.from('payments').insert([
      {
        order_id: order.order_id,
        payment_method: payment_method || 'Prepaid',
        payment_status: 'pending',
      },
    ]);

    // Clear cart items
    await supabase.from('cart_items').delete().eq('cart_id', cartId);

    const fullOrder = {
      ...order,
      shipping_name: address.full_name,
      shipping_phone: address.phone,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      payment_method: payment_method || 'Prepaid',
      items: cartItems.map((i) => ({
        product_name: i.products?.product_name,
        price: i.products?.price,
        quantity: i.quantity,
      })),
    };

    res.status(201).json(
      sendSuccess('Order placed successfully.', {
        order: fullOrder,
        admin_whatsapp: process.env.ADMIN_WHATSAPP_NUMBER || '918767047800',
      })
    );
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(product_name, product_images(image_url, is_primary))), addresses(*), payments(*)')
      .eq('user_id', req.user.user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(sendSuccess('Orders retrieved', { orders }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(product_name, product_images(image_url, is_primary))), addresses(*), payments(*)')
      .eq('order_id', id)
      .eq('user_id', req.user.user_id)
      .single();

    if (error || !order) return res.status(404).json(sendError('Order not found'));
    res.status(200).json(sendSuccess('Order retrieved', { order }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

// ==============================================================================
// 6. Reviews
// ==============================================================================
app.get('/api/reviews/product/:id', async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(first_name, last_name)')
      .eq('product_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(sendSuccess('Reviews retrieved', { reviews: data }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
  if (!isSupabaseConfigured()) return res.status(503).json(sendError('Database not configured'));
  try {
    const { product_id, rating, review } = req.body;
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ user_id: req.user.user_id, product_id, rating, review }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(sendSuccess('Review submitted', data));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

// ==============================================================================
// 7. File Uploads (Supabase Storage / Serverless Memory)
// ==============================================================================
app.post('/api/upload/customization', authenticateToken, uploadMemory.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(sendError('No image file provided.'));
    }

    // If Supabase Storage is configured, upload to 'customizations' bucket
    if (isSupabaseConfigured()) {
      const ext = path.extname(req.file.originalname) || '.png';
      const filename = `custom_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;

      const { data, error } = await supabase.storage
        .from('customizations')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from('customizations').getPublicUrl(filename);
        return res.status(200).json(sendSuccess('Customization image uploaded successfully.', { url: urlData.publicUrl }));
      }
    }

    // Fallback: Inline Base64 Data URL (guarantees preview works even if bucket is pending)
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
    res.status(200).json(sendSuccess('Customization image processed successfully.', { url: dataUrl }));
  } catch (err) {
    res.status(500).json(sendError(err.message));
  }
});

export default app;

