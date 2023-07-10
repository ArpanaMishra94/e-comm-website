import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import products from "./data/products.js";
const port = process.env.PORT || 5000;

connectDB(); 

const app = express();

app.get("/", (req, resp) => {
	resp.send("API is running...");
});

app.get("/api/products", (req, resp) => {
	resp.send(products);
});

app.get("/api/products/:id", (req, resp) => {
	const product = products.find((p) => p._id === req.params.id);
	resp.send(product);
});

app.listen(port, () => console.log("listening on port " + port));
