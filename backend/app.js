import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js"; //this shopRouter is a variable for the shop routes because it export default

// app.use(
//   cors({
//     origin: ["https://localhost:3000", "http://localhost:3000"],
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
