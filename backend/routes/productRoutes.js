import express from "express";
import {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProduct).post(isSeller, createProduct);
router
  .route("/:id")
  .delete(isSeller, deleteProduct)
  .put(isSeller, updateProduct);

export default router;
