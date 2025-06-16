import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";

// @desc    Sync cart by adding new items or updating existing ones
// @route   POST /api/carts
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const user_id = req.user._id;

  try {
    // Step 1: Find existing cart
    const existingCart = await Cart.findOne({ user_id });

    // Step 2: Get latest updatedAt from items[]
    const latestFrontendUpdatedAt = new Date(
      items.reduce((latest, item) => {
        const itemDate = new Date(item.updatedAt);
        return itemDate > new Date(latest) ? item.updatedAt : latest;
      }, items[0]?.updatedAt || new Date(0))
    );
    console.log(latestFrontendUpdatedAt);
    // Step 3: No cart? → Create new
    if (!existingCart) {
      const newCart = await Cart.create({
        user_id,
        items,
        updatedAt: latestFrontendUpdatedAt,
      });
      return res.status(201).json(newCart);
    }

    // Step 4: Compare timestamps and data
    const dbUpdatedAt = new Date(existingCart.updatedAt);
    const isFrontendNewer = latestFrontendUpdatedAt > dbUpdatedAt;
    const isDataDifferent =
      JSON.stringify(existingCart.items) !== JSON.stringify(items);
    console.log(dbUpdatedAt, latestFrontendUpdatedAt);
    if (isFrontendNewer && isDataDifferent) {
      existingCart.items = items;
      existingCart.updatedAt = latestFrontendUpdatedAt;
      await existingCart.save();
      return res.status(200).json(existingCart);
    }

    // Step 5: No update needed
    return res.status(200).json(existingCart);
  } catch (error) {
    console.error("Error syncing cart:", error);
    res.status(500).json({ error: "Failed to sync cart" });
  }
});

// @desc    Get cart by user ID
// @route   GET /api/carts/:user_id
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  console.log("Fetching cart for user:", req.params.user_id);

  // Try to find the cart based on user ID
  const cart = await Cart.findOne({ user_id: req.params.user_id }).populate(
    "items.productId",
    "name price"
  );
  console.log("into the backend and api");
  // Check if a cart exists
  if (cart) {
    // If cart exists, return the cart and total price
    res.json({
      cart,
      totalPrice: cart.totalPrice || 0, // Assuming a virtual field or calculate if needed
    });
  } else {
    // If no cart exists, return an empty cart with totalPrice of 0
    res.json({
      cart: { items: [] },
      totalPrice: 0,
    });
  }
});

// @desc    Delete the entire cart for the user
// @route   DELETE /api/carts/:user_id
// @access  Private
const deleteCart = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  console.log("Deleting cart for user:", user_id);
  try {
    // Find and delete the cart for the user
    const cart = await Cart.findOneAndDelete({ user_id });
    console.log("Cart deleted successfully:", cart);

    if (cart) {
      // Send the deleted cart data in the response for the frontend to use in creating the order
      res.json({ message: "Cart deleted successfully", deletedCart: cart });
    } else {
      res.status(404);
      throw new Error("Cart not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fix the export statement to include the correct function name
export { deleteCart, getCart, syncCart };
