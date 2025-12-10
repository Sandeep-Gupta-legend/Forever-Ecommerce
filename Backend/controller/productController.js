
import {v2 as cloudinary} from 'cloudinary';
import mongoose from 'mongoose';
import productModel from '../models/productModel.js';

const addProduct=async(req,res)=>{
    try{
        // Log the incoming data for debugging
        console.log("=== REQUEST BODY ===");
        console.log(req.body);
        console.log("=== REQUEST FILES ===");
        console.log(req.files);

        // Basic validation: multer must provide files
        if (!req.files) {
            return res.status(400).json({ success:false, message:"No files uploaded. Ensure the request is multipart/form-data with image1/image2/image3/image4 fields." });
        }
        
        // Destructure with the exact field names from your form data
        const{name,description,price,sizes,category,subCategory,bestseller}=req.body;
        
        // Check if files exist - handle both image1/image2/image3/image4 and images array
        let image1 = req.files.image1 && req.files.image1[0];
        let image2 = req.files.image2 && req.files.image2[0];  
        let image3 = req.files.image3 && req.files.image3[0];
        let image4 = req.files.image4 && req.files.image4[0];
        
        // Also check for images array (fallback)
        if (!image1 && req.files.images && req.files.images.length > 0) {
            image1 = req.files.images[0];
            image2 = req.files.images[1];
            image3 = req.files.images[2];
            image4 = req.files.images[3];
        }
        
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
        console.log("=== LIST PRODUCT REQUEST ===");
        console.log("Fetching products from database...");
        
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            console.error("Database not connected. ReadyState:", mongoose.connection.readyState);
            return res.status(503).json({ 
                success: false, 
                message: 'Database connection not available. Please check your MongoDB connection.' 
            });
        }
        
        const products = await productModel.find({}).lean();
        console.log(`Found ${products.length} products`);
        
        // Return in format expected by frontend: { success: true, data: [...] }
        return res.json({ success: true, data: products, products: products });

    }catch(error){
        console.error("Error in listProduct:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to fetch products',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// FIXED: removeProduct function
const removeProduct = async(req,res)=>{
    try{
        console.log("=== REMOVE PRODUCT REQUEST ===");
        console.log("Request body:", req.body);
        console.log("Request params:", req.params);
        console.log("Request query:", req.query);
        
        let productId;
        
        // Try to get productId from different sources
        if (req.body.id) {
            productId = req.body.id;
            console.log("Using req.body.id:", productId);
        } else if (req.body.productId) {
            productId = req.body.productId;
            console.log("Using req.body.productId:", productId);
        } else if (req.params.id) {
            productId = req.params.id;
            console.log("Using req.params.id:", productId);
        } else {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        
        console.log("Deleting product with ID:", productId);
        
        const result = await productModel.findByIdAndDelete(productId);
        
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        console.log("Product deleted successfully:", result);
        res.json({
            success: true,
            message: "Product removed successfully",
            deletedProduct: result
        });
    }
    catch(error){
        console.log("Error in removeProduct:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
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

// NEW: Update product function
// Update the updateProduct function in productController.js
const updateProduct = async(req,res)=>{
    try{
        console.log("=== UPDATE PRODUCT REQUEST ===");
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        
        const { productId, name, description, price, sizes, category, subCategory, bestseller } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        
        // Find existing product
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Start with existing data
        const updateData = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price ? Number(price) : existingProduct.price,
            category: category || existingProduct.category,
            subCategory: subCategory || existingProduct.subCategory,
            bestseller: bestseller !== undefined ? (bestseller === "true" || bestseller === true) : existingProduct.bestseller,
            sizes: existingProduct.sizes // Keep existing by default
        };
        
        // Handle sizes update
        if (sizes !== undefined) {
            let parsedSizes = [];
            
            if (sizes) {
                if (typeof sizes === 'string' && sizes.includes(',')) {
                    parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s);
                } else if (typeof sizes === 'string' && sizes.trim() !== '') {
                    parsedSizes = [sizes.trim()];
                } else if (Array.isArray(sizes)) {
                    parsedSizes = sizes;
                }
                updateData.sizes = parsedSizes;
            } else {
                updateData.sizes = [];
            }
        }
        
        // Handle image updates if new images are provided
        let imagesToUpdate = [...existingProduct.images];
        
        // Check for new images
        if (req.files) {
            for (let i = 1; i <= 4; i++) {
                const imageKey = `image${i}`;
                if (req.files[imageKey] && req.files[imageKey][0]) {
                    console.log(`Uploading new ${imageKey} to Cloudinary`);
                    
                    // Upload new image to Cloudinary
                    const result = await cloudinary.uploader.upload(
                        req.files[imageKey][0].path, 
                        { resource_type: "image" }
                    );
                    
                    // Replace or add image at position
                    if (imagesToUpdate.length >= i) {
                        imagesToUpdate[i-1] = result.secure_url;
                    } else {
                        imagesToUpdate.push(result.secure_url);
                    }
                }
            }
        }
        
        updateData.images = imagesToUpdate;
        
        console.log("Final update data:", updateData);
        
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
        
    } catch(error) {
        console.log("Error in updateProduct:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}
export {addProduct, listProduct, singleProduct, removeProduct, updateProduct}
