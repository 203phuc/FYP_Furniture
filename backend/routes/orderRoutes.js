import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getEarningsByShop,
  getOrderById,
  getOrdersByBuyerId,
  getOrdersByShop,
  getProductsSoldByShop,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new order
router.route("/").post(protect, createOrder);

// Route to get order by ID
router.route("/:id").get(protect, getOrderById);

// Route to get all orders by a specific buyer ID
router.route("/user/:buyerId").get(protect, getOrdersByBuyerId);

// Route to get orders by shop ID (new route)
router.route("/shop/sold/:shopId").get(protect, getProductsSoldByShop);
router.route("/shop/earnings/:shopId").get(protect, getEarningsByShop);

// Route to get orders by shop ID
router.route("/shop/:shopId").get(protect, getOrdersByShop);
// Route to update the status of an order
router.route("/:id").put(protect, updateOrderStatus);

// Route to delete an order
router.route("/:id").delete(protect, isAdmin, deleteOrder);

// Route to get all orders
router.route("/").get(protect, isAdmin, getAllOrders);

export default router;
