// app.js
// Express App core configuration

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Route imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Middleware imports
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/responseHelper.js';

const app = express();

// Standard middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 404 Error handler router
app.use(notFoundHandler);

// Global exception catcher handler
app.use(globalErrorHandler);

export default app;
