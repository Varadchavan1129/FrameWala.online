// app.js
// Express App core configuration

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Customer/public route imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Admin-specific routes (isolated under /api/admin)
import adminRoutes from './admin/routes/index.js';

// Middleware imports
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/responseHelper.js';

const app = express();

// Standard middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors()); // Allow all origins (Vite proxy is used in dev; restrict in production via env)

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve database images
app.use('/api/images', express.static(path.join(process.cwd(), '../database/images')));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'FrameWala Backend Running' });
});

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ─── Public / Customer Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Admin Routes (protected under /api/admin) ───────────────────────────────
app.use('/api/admin', adminRoutes);

// ─── Error Handlers (must come LAST) ─────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
