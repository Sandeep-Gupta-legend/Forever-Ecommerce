import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: false // Allow guest orders
    },
    orderId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'product',
            required: true 
        },
        productName: { 
            type: String, 
            required: true 
        },
        productImage: { 
            type: String 
        },
        price: { 
            type: Number, 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        size: { 
            type: String, 
            default: 'M' 
        },
        total: { 
            type: Number, 
            required: true 
        }
    }],
    shippingDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: { 
        type: String, 
        enum: ['cod', 'stripe', 'razorpay'], 
        default: 'cod' 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'], 
        default: 'Processing' 
    },
    trackingNumber: { 
        type: String 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
