// /routes/stripeRoutes.js
import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js"; // Import the controller
import { protect } from "../middleware/authMiddleware.js"; // Import protect middleware

const router = express.Router();

// Route to create Stripe Checkout session, protected by authentication
router.post("/create-checkout-session", protect, createCheckoutSession);

export default router;
