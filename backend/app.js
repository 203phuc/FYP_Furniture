import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import shopRoutes from "./routes/shopRoutes.js"; //this shopRouter is a variable for the shop routes because it export default
import bodyParser from "body-parser";

const app = express();

// Optional: Enable CORS with specific origins if needed
// app.use(
//   cors({
//     origin: ["https://localhost:3000", "http://localhost:3000"],
//     credentials: true,
//   })
// );

// Built-in middleware to parse incoming JSON requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
