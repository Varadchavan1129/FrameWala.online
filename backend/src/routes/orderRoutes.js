// orderRoutes.js
// Express Router for Order placement, historical searches, and cancellations

import express from 'express';
import { placeOrder, getOrders, getOrderById, cancelOrder, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Customer & Admin accessible order queries
router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin only order status update route
router.put('/:id/status', isAdmin, updateOrderStatus);

export default router;
