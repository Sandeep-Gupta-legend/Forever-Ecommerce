import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    sizes: [{  // Make sure this is an array of strings
        type: String
    }],
    images: [{  // Changed from 'image' to 'images' (array)
        type: String,
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);