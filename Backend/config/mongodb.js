import mongoose from "mongoose";

const connectDB = async()=>{
  try {
    mongoose.connection.on('connected',()=>{
      console.log("DB connected");
    })
    
    mongoose.connection.on('error',(err)=>{
      console.error("DB connection error:", err);
    })
    
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)
    console.log("MongoDB connection established");
  } catch(error) {
    console.error("Failed to connect to MongoDB:", error.message);
    // Don't throw - let the app continue, but log the error
  }
}

export default connectDB;