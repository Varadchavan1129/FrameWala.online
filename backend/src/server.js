// server.js
// Node HTTP server startup file

import app from './app.js';
import dotenv from 'dotenv';
import { runMigrations } from './config/migrate.js';
import { seedDefaultUsers } from './config/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

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
