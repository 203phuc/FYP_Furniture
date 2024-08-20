import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => console.log(`Server started on port ${port}`));
