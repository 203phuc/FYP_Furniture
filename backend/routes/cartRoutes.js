import express from "express";
import {
  deleteCart,
  getCart,
  syncCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to sync (add or update) items in the cartSchema
router.post("/", protect, syncCart);

// Route to get the cart by user ID
router.get("/:user_id", protect, getCart);

// Route to remove an item from the cart
router.delete("/:user_id", protect, deleteCart);

export default router;
