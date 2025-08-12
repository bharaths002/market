const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST new user with validation
router.post(
  "/",
  [
    body("name")
      .exists().withMessage("Name is required")
      .isString().withMessage("Name must be a string"),
    body("email")
      .exists().withMessage("Email is required")
      .isEmail().withMessage("Email must be valid"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
