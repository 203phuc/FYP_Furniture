import express from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductsByShop,
} from "../controllers/productController.js";
import { isSeller } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(isSeller, createProduct);
router
  .route("/:id")
  .delete(isSeller, deleteProduct) // delete product
  .patch(isSeller, updateProduct); // update product

router.route("/shop/:shopId").get(getProductsByShop);

export default router;
