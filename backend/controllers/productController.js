import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc  Fetch all products
// @route  GET/api/products
// @access Public
const getProducts = asyncHandler(async (req, resp) => {
	const pageSize = process.env.PAGINATION_LIMIT;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? { name: { $regex: req.query.keyword, $options: "i" } }
		: {};

	const count = await Product.countDocuments({ ...keyword });

	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	resp.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @desc Delete a products
// @route  DELETE/api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, resp) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		await Product.deleteOne({ _id: product._id });
		resp.status(200).json({ message: "Product deleted" });
	} else {
		resp.status(404);
		throw new Error("Resourde not found");
	}
});

// @desc Create a new review
// @route  POST/api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, resp) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			(review) => review.user.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			resp.status(400);
			throw new Error("Product already reviewed");
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};

		product.reviews.push(review);

		product.numReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, review) => acc + review.rating, 0) /
			product.reviews.length;

		await product.save();
		resp.status(201).json({ message: "Review added" });
	} else {
		resp.status(404);
		throw new Error("Resource not found");
	}
});

// @desc  Get top rated products
// @route  GET/api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, resp) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);
	resp.status(200).json(products);
});

export {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	createProductReview,
	getTopProducts,
};
