import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Create a new order
const createOrder = async (req, res) => {
    try {
        const {
            orderId,
            items,
            shippingDetails,
            paymentMethod,
            totalAmount,
            userId
        } = req.body;

        // Validate required fields
        if (!orderId || !items || !items.length || !shippingDetails || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Missing required order information"
            });
        }

        // Validate shipping details
        const requiredShippingFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
        const missingFields = requiredShippingFields.filter(field => !shippingDetails[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing shipping details: ${missingFields.join(', ')}`
            });
        }

        // Generate tracking number
        const trackingNumber = `TRK${orderId.toString().slice(-6)}`;

        // Create new order
        const newOrder = new orderModel({
            userId: userId || null,
            orderId,
            items,
            shippingDetails,
            paymentMethod: paymentMethod || 'cod',
            totalAmount,
            status: 'Processing',
            trackingNumber,
            orderDate: new Date()
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: savedOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('userId', 'name email')
            .sort({ orderDate: -1 }); // Most recent first

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

// Get orders by user (for frontend)
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const orders = await orderModel.find({ userId })
            .sort({ orderDate: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message
        });
    }
};

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel.findOne({ orderId })
            .populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
        
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { 
                status, 
                updatedAt: new Date() 
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};

// Delete order (for admin)
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await orderModel.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order deleted successfully",
            data: deletedOrder
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order",
            error: error.message
        });
    }
};

export {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
