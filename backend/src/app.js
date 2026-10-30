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

import db from './config/db.js';
// Middleware imports
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/responseHelper.js';

const app = express();

// Standard middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

// Dynamic CORS configuration allowing localhost, Vercel deployments, and production domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin === 'https://framewala.online' ||
      origin === 'https://www.framewala.online' ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Health check API with database connectivity check
app.get('/api/health', async (req, res) => {
  let dbConnected = false;
  try {
    const [rows] = await db.query('SELECT 1 AS healthy');
    dbConnected = Boolean(rows && rows[0]?.healthy === 1);
  } catch (err) {
    dbConnected = false;
  }

  const isHealthy = dbConnected;
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'OK' : 'DEGRADED',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
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
