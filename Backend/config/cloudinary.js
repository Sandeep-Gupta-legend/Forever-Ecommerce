import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async()=>{ // Fixed spelling
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME, // Fixed spelling
        api_key:process.env.CLOUDINARY_API_KEY, // Fixed spelling
        api_secret:process.env.CLOUDINARY_SECRET_KEY // Fixed spelling
    })
    console.log("Cloudinary connected successfully");
}

export default connectCloudinary; // Fixed spelling