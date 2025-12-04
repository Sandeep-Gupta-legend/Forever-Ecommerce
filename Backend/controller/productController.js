import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

const addProduct=async(req,res)=>{
    try{
        // Log the incoming data for debugging
        console.log("=== REQUEST BODY ===");
        console.log(req.body);
        console.log("=== REQUEST FILES ===");
        console.log(req.files);
        
        // Destructure with the exact field names from your form data
        const{name,description,price,sizes,category,subCategory,bestseller}=req.body;
        
        // Check if files exist
        const image1=req.files.image1 && req.files.image1[0];
        const image2=req.files.image2 && req.files.image2[0];  
        const image3=req.files.image3 && req.files.image3[0];
        const image4=req.files.image4 && req.files.image4[0];
        
        const images=[image1,image2,image3,image4].filter((item)=> item !== undefined);
        
        // Upload images to Cloudinary
        const imagesUrl= await Promise.all(images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path,{resource_type:"image"});
            return result.secure_url;
        }));
        
        // FIXED: Handle sizes parsing properly
        let parsedSizes = [];
        
        if (sizes) {
            console.log("Original sizes string:", sizes);
            
            // Try to parse JSON if it looks like JSON
            if (typeof sizes === 'string' && sizes.startsWith('[')) {
                try {
                    parsedSizes = JSON.parse(sizes);
                    console.log("Parsed as JSON:", parsedSizes);
                } catch (parseError) {
                    console.log("JSON parse failed, trying comma-separated");
                    // If JSON parsing fails, try comma-separated
                    parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s);
                }
            } 
            // Handle comma-separated string
            else if (typeof sizes === 'string' && sizes.includes(',')) {
                parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s);
                console.log("Parsed as comma-separated:", parsedSizes);
            }
            // Handle single size string
            else if (typeof sizes === 'string' && sizes.trim() !== '') {
                parsedSizes = [sizes.trim()];
                console.log("Parsed as single size:", parsedSizes);
            }
            // If it's already an array
            else if (Array.isArray(sizes)) {
                parsedSizes = sizes;
                console.log("Already an array:", parsedSizes);
            }
        }
        
        console.log("Final parsed sizes:", parsedSizes);
        
        const productData={
            name,
            description,
            category,
            subCategory,
            price:Number(price),
            bestseller:bestseller==="true"?true:false,
            sizes: parsedSizes, // Use the parsed sizes
            images:imagesUrl, // Changed from 'image' to 'images'
            date:Date.now()
        };
        
        console.log("Product data to save:", productData);

        const product=new productModel(productData);
        await product.save();
        
        res.json({success: true, message: "Product added successfully", product: product});

    }catch(error){
        console.log("Error in addProduct:", error);
        res.json({success:false,message:error.message});
    }
}

// Rest of your functions remain the same...
const listProduct=async(req,res)=>{
    try{
        const products = await productModel.find({}).lean();
        return res.json({ success: true, products });

    }catch(error){
        console.error(error);
        return res.status(500).json({ success:false, message:error.message });
    }
}

const removeProduct= async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

const singleProduct=async(req,res)=>{
    try{
        const {productId}=req.body;
        const product=await productModel.findById(productId);
        res.json({success:true,product});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export {addProduct,listProduct,singleProduct,removeProduct}