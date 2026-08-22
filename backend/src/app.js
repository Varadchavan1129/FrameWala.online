// app.js
// Express App core configuration

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Route imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Middleware imports
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/responseHelper.js';

const app = express();

// Standard middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow cross-origin images loading from localhost
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'FrameWala Backend Running' });
});

// Health check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Modular routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Error handler router
app.use(notFoundHandler);

// Global exception catcher handler
app.use(globalErrorHandler);

export default app;
