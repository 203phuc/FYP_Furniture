import Stripe from "stripe"; // Importing the Stripe package correctly
// Initialize Stripe with your secret key

import asyncHandler from "express-async-handler";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  try {
    console.log("into the createCheckoutSession");
    const { cartItems } = req.body;
    console.log(cartItems);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Convert cart items to Stripe line items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
          images: [item.mainImage.url], // Optional: Add product image
          // Modify the description formatting to handle nested objects
          // Format the description to exclude null values and display only meaningful information
          description: Object.entries(item.attributes)
            .filter(([, value]) => value && (value.value || value.image)) // Exclude attributes with null values
            .map(([key, value]) => {
              // If the value is an object, check for nested properties
              if (typeof value === "object") {
                const { value: val, image } = value;

                // Build a description string based on available data
                let desc = `${key}: `;
                if (val) {
                  // If value is itself an object (e.g., dimensions), format it
                  desc +=
                    typeof val === "object"
                      ? Object.entries(val)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : val;
                }
                if (image) {
                  desc += ` (Image: ${image})`;
                }
                return desc;
              }
              // If it's a primitive, just return the value directly
              return `${key}: ${value}`;
            })
            .join(", "),
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});
