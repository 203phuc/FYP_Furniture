import {
  getShop,
  getShops,
  createShop,
  updateShop,
  deleteShop,
} from "../controllers/shopController.js";
import express from "express";
const router = express.Router();
import { protect, isAdmin, isSeller } from "../middleware/authMiddleware.js";

router.route("/").get(getShops).post(protect, isSeller, createShop);
router
  .route("/:id")
  .put(protect, isSeller, updateShop)
  .delete(protect, isAdmin, deleteShop);
router.route("/:id").get(protect, isSeller, getShop);
export default router;
