import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";


// @desc  Fetch all products
// @route  GET/api/products
const getProducts = asyncHandler(async (req, resp) => {
    const products = await Product.find({});
    resp.json(products);
});

// @desc  Fetch a product
// @route  GET/api/products/:id
const getProductById = asyncHandler(async (req, resp) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return resp.json(product);
    }
    else {
        resp.status(404);
        throw new Error('Resource not found');
    }
});

export { getProducts, getProductById };