import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/userRoutes.js";

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
app.use("/api/users", router);

app.use(notFound);
app.use(errorHandler);

export default app;
