import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
const port = process.env.PORT || 4000;
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

import publicCompanyRoutes from "./routes/publicCompanyRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import shippingAddressRoutes from "./routes/shippingAddressRoutes.js";
import webhookRouter from "./routes/webhookRoutes.js";
import statsRouter from "./routes/stats.js";

import cors from "cors";

connectDB();

const app = express();
const corss = cors;
app.use(
  corss({
    origin: "https://book-store-side.onrender.com",
  })
);
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/publiccompanies", publicCompanyRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/shippingaddress", shippingAddressRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/webhook", webhookRouter);
app.use("/api/stats", statsRouter);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); //Set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
