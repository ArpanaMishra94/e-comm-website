import express from "express";
const router = express.Router();
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

router.get("/", asyncHandler(async (req, resp) => {
    const products = await Product.find({});
    resp.json(products);
}));

router.get("/:id", asyncHandler(async (req, resp) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return resp.json(product);
    }
    resp.status(404).json({ message: 'Product not found' });
}));

export default router; 