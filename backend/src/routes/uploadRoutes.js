// uploadRoutes.js
// Express Router for handling multiple file uploads using Multer

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const router = express.Router();

// Define disk storage configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // limit 5MB per file
});

// Admin-only upload endpoint for multiple images
router.post('/multiple', authenticateToken, isAdmin, (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json(sendError(err.message));
    }
    
    const files = req.files || [];
    const urls = files.map((file) => {
      const PORT = process.env.PORT || 5000;
      return `http://localhost:${PORT}/uploads/${file.filename}`;
    });
    
    res.status(200).json(sendSuccess('Images uploaded successfully.', { urls }));
  });
});

// Customer customization image upload route
router.post('/customization', authenticateToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json(sendError(err.message));
    }
    
    if (!req.file) {
      return res.status(400).json(sendError('No image file provided.'));
    }
    
    const PORT = process.env.PORT || 5000;
    const url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    res.status(200).json(sendSuccess('Customization image uploaded successfully.', { url }));
  });
});

export default router;
