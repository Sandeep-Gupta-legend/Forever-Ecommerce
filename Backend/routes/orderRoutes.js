import express from 'express';
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from '../controller/orderController.js';
import adminauth from '../middleware/adminauth.js';

const orderRouter = express.Router();

// Public routes
orderRouter.post('/create', createOrder);
orderRouter.get('/user/:userId', getUserOrders);
orderRouter.get('/all', getAllOrders); // Public route for frontend to fetch all orders
orderRouter.get('/:orderId', getOrderById);

// Admin routes (protected)
orderRouter.get('/', adminauth, getAllOrders); // Admin route with auth
orderRouter.put('/:orderId/status', adminauth, updateOrderStatus);
orderRouter.delete('/:orderId', adminauth, deleteOrder);

export default orderRouter;
