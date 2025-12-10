
import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try{
        console.log("=== ADMIN AUTH MIDDLEWARE ===");
        console.log("Headers:", req.headers);
        console.log("Token from headers:", req.headers.token);
        
        const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
        
        if(!token){
            console.log("No token provided");
            return res.status(401).json({success:false,message:"Please login first"});
        }
        
        // Decode the token without verification first to see what's in it
        const decoded = jwt.decode(token);
        console.log("Decoded token:", decoded);
        
        // Now verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified token:", verified);
        
        // In your adminLogin, you're signing: jwt.sign(email+password,process.env.JWT_SECRET)
        // So verified should be the string: email+password
        
        // Check if it matches admin credentials
        const adminString = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        console.log("Admin string to compare:", adminString);
        
        if(verified !== adminString){
            console.log("Not admin - verified:", verified, "adminString:", adminString);
            return res.status(403).json({success:false,message:"You are not admin"});
        }
        
        console.log("Admin authenticated successfully");
        next();
    }
    catch(error){
        console.log("Admin auth error:", error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({success:false,message:"Invalid token"});
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({success:false,message:"Token expired"});
        }
        res.status(500).json({success:false,message:"Authentication error"});
    }
}

export default adminAuth
