// index.js
// Central router for all admin APIs

import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';

import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import authRoutes from './authRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// Apply admin authentication globally to all /api/admin routes except login
// Actually, admin login should not be protected by adminAuth, so it should be handled in authRoutes.
// But authRoutes might export the router. So we do:

router.use('/auth', authRoutes); // Auth handles its own token check (e.g., login is public)
router.use('/products', adminAuth, productRoutes);
router.use('/orders', adminAuth, orderRoutes);
router.use('/categories', adminAuth, categoryRoutes);
router.use('/reviews', adminAuth, reviewRoutes);

export default router;
