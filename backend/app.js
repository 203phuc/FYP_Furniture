import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import timeMiddleware from "./middleware/timeMiddleware.js"; // Corrected import name
import cartRoutes from "./routes/cartRoutes.js";
import checkOutRoute from "./routes/checkOutRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";

const app = express();

// Optional: Enable CORS with specific origins if needed
app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost:3000"], // Adjusted order of origins
    credentials: true,
  })
);

// Built-in middleware to parse incoming JSON requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

// Use the timing middleware to measure request processing time
app.use(timeMiddleware); // above all route handlers

// Define route handlers
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/checkout", checkOutRoute);

// Define error handling middleware after all routes
app.use(notFound);
app.use(errorHandler);

export default app;
