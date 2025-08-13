const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add product (Protected)
router.post(
  "/",
  auth,
  [
    body("name").isString().withMessage("Name must be a string"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be positive")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  }
);

// Update product (Protected)
router.put("/:id", auth, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete product (Protected)
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
