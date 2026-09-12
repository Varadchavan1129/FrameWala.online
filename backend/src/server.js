// server.js
// Node HTTP server startup file

import app from './app.js';
import dotenv from 'dotenv';
import { runMigrations } from './config/migrate.js';
import { seedDefaultUsers } from './config/seed.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './admin/routes/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Setup routing
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

const server = app.listen(PORT, async () => {
  console.log(`================================================`);
  console.log(`🚀 FrameWala API Server running on port ${PORT}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`================================================`);
  
  // Execute automatic database tables migrations
  await runMigrations();

  // Initialize default customer and admin rows
  await seedDefaultUsers();
});

// Handle server crash or unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down server gracefully...');
  server.close(() => {
    console.log('💥 Process terminated.');
  });
});
