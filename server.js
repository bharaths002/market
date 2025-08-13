require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(logger);

app.use("/products", productsRouter);
app.use("/auth", authRouter);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error(err));
