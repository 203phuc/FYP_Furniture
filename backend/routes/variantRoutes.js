import express from "express";
import multer from "multer";
import {
  addVariant,
  checkIfProductHasVariants,
  deleteVariant,
  getVariantsByProduct,
  updateVariantDetails,
} from "../controllers/variantController.js";
import { isSeller } from "../middleware/authMiddleware.js";

// Multer setup for handling GLB and GLTF files

const router = express.Router();

router.get("/product/:productId/check", checkIfProductHasVariants);

// POST route to add variants for a product
router.post("/", isSeller, addVariant);

// PUT route to update variant details
router.put(
  "/:variantId",
  isSeller,
  multer().single("threeDModel"), // Multer middleware only for GLB/GLTF file
  updateVariantDetails
);

// GET route to get all variants of a specific product
router.get("/product/:productId", isSeller, getVariantsByProduct);

// DELETE route to delete a variant
router.delete("/:variantId", isSeller, deleteVariant);

export default router;
