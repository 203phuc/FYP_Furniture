import express from "express";
import {
  authUser,
  deleteUser,
  getAllUsers,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
  verifyEmail,
} from "../controllers/userController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Verify user email
router.post("/verify-email", verifyEmail);

// Register, Authenticate, and Logout routes
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);

// User profile management
router
  .route("/profile")
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

// Admin routes for fetching all users and deleting a user
router.get("/admin-all-users", protect, isAdmin, getAllUsers);
router.delete("/delete-user/:id", protect, isAdmin, deleteUser);

export default router;
