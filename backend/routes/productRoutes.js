import express from "express";
import {
  createProduct, // Import the product details controller
  deleteProduct,
  getApprovedProducts,
  getProductDetails,
  getProducts,
  getProductsByShop,
  toggleProductApproval,
  updateProduct,
} from "../controllers/productController.js";
import { isAdmin, isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

// Use the upload middleware in your route
router.route("/").get(getProducts).post(isSeller, createProduct);
router.route("/approved").get(getApprovedProducts);

// Route for fetching product details
router.route("/:id").get(getProductDetails); // Add this line to handle product detail requests
router.route("/:id/toggle-approval").patch(isAdmin, toggleProductApproval);
router
  .route("/:id")
  .delete(isSeller, deleteProduct) // delete product
  .patch(isSeller, updateProduct); // update product

router.route("/shop/:shopId").get(getProductsByShop);

export default router;
