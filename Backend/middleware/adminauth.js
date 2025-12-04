import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
const adminAuth = async (req, res, next) => {
    try{
        const {token}=req.headers;
        if(!token){
            return res.json({success:false,message:"Please login first"});
        }
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        
        if(decode!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"You are not admin"});


    }
        next();
}
    catch(error){
        console.log(error);
        res.json({success:false,message:"Something went wrong"});
    }
}

export default adminAuth