// server.js
// Node HTTP server startup file

import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🚀 FrameWala API Server running on port ${PORT}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`================================================`);
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
