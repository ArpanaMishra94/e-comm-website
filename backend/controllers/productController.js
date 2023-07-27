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
	} else {
		resp.status(404);
		throw new Error("Resource not found");
	}
});

// @desc Create a product
// @route POST/api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, resp) => {
	const product = new Product({
		name: "Sample name",
		price: 0,
		user: req.user._id,
		image: "/images/sample.jpg",
		brand: "Sample brand",
		category: "Sample category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample description",
	});

	const createdProduct = await product.save();
	resp.status(201).json(createdProduct);
});

// @desc Update a products
// @route  PUT/api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, resp) => {
	const { name, price, description, image, brand, category, countInStock } =
		req.body;
	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;

		const updatedProduct = await product.save();
		resp.json(updatedProduct);
	} else {
		resp.status(404);
		throw new Error("Resourde not found");
	}
});

export { getProducts, getProductById, createProduct, updateProduct };
