import express from "express";
import { addProduct, listProduct, singleProduct, removeProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminauth.js";
const Productrouter = express.Router();

// FIX: Remove extra parentheses around each field
Productrouter.post("/add",adminAuth,upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), addProduct);

Productrouter.get("/list", listProduct);
Productrouter.post("/single", singleProduct);
Productrouter.post("/remove",adminAuth, removeProduct);

export default Productrouter;