import express from "express";
import multer from "multer"; // Import multer
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductsByShop,
} from "../controllers/productController.js";
import { isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure multer for file storage
const storage = multer.memoryStorage(); // This stores the file in memory
const upload = multer({ storage: storage });

// Use the upload middleware in your route
router
  .route("/")
  .get(getProducts)
  .post(isSeller, upload.single("mainImage"), createProduct);
router
  .route("/:id")
  .delete(isSeller, deleteProduct) // delete product
  .patch(isSeller, updateProduct); // update product

router.route("/shop/:shopId").get(getProductsByShop);

export default router;
