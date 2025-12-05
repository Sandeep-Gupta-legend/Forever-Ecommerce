import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async()=>{ // Fixed spelling
    try {
        cloudinary.config({
            cloud_name:process.env.CLOUDINARY_NAME, // Fixed spelling
            api_key:process.env.CLOUDINARY_API_KEY, // Fixed spelling
            api_secret:process.env.CLOUDINARY_SECRET_KEY // Fixed spelling
        })
        console.log("Cloudinary connected successfully");
    } catch(error) {
        console.error("Failed to configure Cloudinary:", error.message);
        // Don't throw - let the app continue, but log the error
    }
}

export default connectCloudinary; // Fixed spelling