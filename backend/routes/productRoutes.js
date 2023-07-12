import express from "express";
const router = express.Router();
import products from "../data/products.js";

router.get("/", async (req, resp) => {
    resp.send(products);
});

router.get("/:id", (req, resp) => {
    const product = products.find((p) => p._id === req.params.id);
    resp.send(product);
});

export default router;