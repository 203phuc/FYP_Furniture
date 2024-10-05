import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to add or update items in the cart
router.post("/", protect, addToCart);

// Route to get the cart by user ID
router.get("/:user_id", protect, getCart);

// Route to update item quantity in the cart
router.put("/:user_id/:product_id", protect, updateCartItem);

// Route to remove an item from the cart
router.delete("/:user_id/:product_id", protect, removeCartItem);

export default router;
