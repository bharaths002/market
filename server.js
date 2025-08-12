const express = require("express");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Custom middleware to log method and URL
app.use(logger);

// Middleware to add requestTime to req object
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

// Routes
app.use("/products", productsRouter);
app.use("/users", usersRouter);

// Error-test route to check global error handling
app.get("/error-test", (req, res, next) => {
  const error = new Error("This is a test error");
  error.statusCode = 400; // Bad Request
  next(error); // Forward to global error handler
});

// Global error handling middleware — must be last
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect("mongodb+srv://admin:admin@cluster0.coghh0f.mongodb.net/")
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
