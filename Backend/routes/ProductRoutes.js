
import express from "express";
import { addProduct, listProduct, singleProduct, removeProduct, updateProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminauth.js";
const Productrouter = express.Router();

Productrouter.post("/add", adminAuth, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), addProduct);

Productrouter.get("/list", listProduct);
Productrouter.get("/", listProduct); // Add root route for /api/product
Productrouter.post("/single", singleProduct);

// Remove product (both methods)
Productrouter.post("/remove", adminAuth, removeProduct);
Productrouter.delete("/remove/:id", adminAuth, removeProduct);

// Update product with image support
Productrouter.post("/update", adminAuth, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), updateProduct);

export default Productrouter;
