import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";

import connectCloudinary from "./config/cloudinary.js"; // Fixed import name
import userRouter from "./routes/userroutes.js";
import Productrouter from "./routes/ProductRoutes.js";
import orderRouter from "./routes/orderRoutes.js";



const app=express();
const port=process.env.PORT || 3000;
app.use(express.json());
// CORS configuration - allow both frontend and admin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Frontend and Admin URLs
  credentials: true
}));

// Initialize database and cloudinary connections
// Wrap in try-catch to handle connection errors gracefully
(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
    
    try {
        await connectCloudinary();
    } catch (error) {
        console.error("Cloudinary connection failed:", error);
    }
})();

app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.use('/api/user',userRouter)
app.use('/api/product',Productrouter)
app.use('/api/order',orderRouter)

// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler middleware - must be last
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(port,()=>{
    console.log('server is running on port:'+port);
})