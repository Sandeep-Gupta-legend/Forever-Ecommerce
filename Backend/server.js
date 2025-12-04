import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";

import connectCloudinary from "./config/cloudinary.js"; // Fixed import name
import userRouter from "./routes/userroutes.js";
import Productrouter from "./routes/ProductRoutes.js";



const app=express();
const port=process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
connectDB();
connectCloudinary();
app.use('/api/user',userRouter)
app.use('/api/product',Productrouter)

app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>{
    console.log('server is running on port:'+port);
})