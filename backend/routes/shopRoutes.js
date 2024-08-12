import {
  getShop,
  getShops,
  registerShop,
  updateShop,
  deleteShop,
  authShop,
  logoutShop,
} from "../controllers/shopController.js";
import express from "express";
const router = express.Router();
import { protect, isAdmin, isSeller } from "../middleware/authMiddleware.js";

router.route("/").get(getShops).post(registerShop);
router.route("/logout").post(logoutShop);
router.route("/auth").post(authShop);
router.route("/:id").put(isSeller, updateShop).delete(isAdmin, deleteShop);
router.route("/:id").get(protect, isSeller, getShop);
export default router;
