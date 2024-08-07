import express from "express";
import {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/").get(getProduct).post(createProduct);
router.route("/:id").delete(deleteProduct).put(updateProduct);

export default router;
