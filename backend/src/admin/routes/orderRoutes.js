// orderRoutes.js
// Express Router for Order placement, historical searches, and cancellations

import express from 'express';
import { placeOrder, getOrders, getOrderById, cancelOrder, updateOrderStatus } from '../controllers/orderController.js';


const router = express.Router();



// Customer & Admin accessible order queries
router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin only order status update route
router.put('/:id/status', updateOrderStatus);

export default router;
