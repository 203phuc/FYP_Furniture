import express from "express";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Middleware to parse raw body for webhooks
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Required for Stripe's signature verification
  async (req, res) => {
    const sig = req.headers["stripe-signature"]; // Stripe's signature header
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook secret

    let event;

    try {
      // Verify that the request came from Stripe
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Call a helper function to handle successful checkout
        await handleCheckoutSessionCompleted(session);
        break;

      // Handle other events if needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Helper function to process the successful checkout
const handleCheckoutSessionCompleted = async (session) => {
  try {
    console.log("Checkout session completed:", session);

    // Extract line items and other relevant information
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    // Save order details to your database
    const order = {
      customerEmail: session.customer_details.email,
      paymentStatus: session.payment_status,
      totalAmount: session.amount_total / 100, // Convert cents to dollars
      currency: session.currency,
      items: lineItems.data.map((item) => ({
        productName: item.description,
        quantity: item.quantity,
        price: item.amount_total / 100, // Convert cents to dollars
      })),
    };

    console.log("Order details:", order);

    // Save `order` to your database here
    // Example: using a fictional Order model
    // await Order.create(order);

    console.log("Order saved successfully!");
  } catch (error) {
    console.error("Error processing checkout session:", error);
  }
};

export default router;
