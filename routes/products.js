const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");

const router = express.Router();

// GET all products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ requestTime: req.requestTime, data: products });
  } catch (err) {
    next(err);
  }
});

// GET product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST new product with validation
router.post(
  "/",
  [
    body("name")
      .exists().withMessage("Name is required")
      .isString().withMessage("Name must be a string"),
    body("price")
      .exists().withMessage("Price is required")
      .isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

// PUT update product with validation (optional fields)
router.put(
  "/:id",
  [
    body("name").optional().isString().withMessage("Name must be a string"),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE product
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
