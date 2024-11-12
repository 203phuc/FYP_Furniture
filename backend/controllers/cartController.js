import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Variant from "../models/variantModel.js";

// @desc    Sync cart by adding new items or updating existing ones
// @route   POST /api/carts
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const user_id = req.user._id;

  try {
    // Find or create the user's cart
    let cart = await Cart.findOne({ user_id });
    if (!cart) {
      cart = new Cart({ user_id, items: [] });

      // Process each item in the request
      for (const newItem of items) {
        const {
          productId,
          variantId,
          quantity,
          price,
          productName,
          attributes,
          mainImage,
        } = newItem;

        // Find the product and variant
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found");
        }

        const variant = await Variant.findById(variantId);
        if (!variant) {
          throw new Error("Variant not found");
        }
        if (quantity > variant.stockQuantity) {
          throw new Error("User can not add more than stock quantity");
        }

        // Find or update item in the cart
        const existingItemIndex = cart.items.findIndex(
          (item) => item.productId === productId && item.variantId === variantId
        );

        if (existingItemIndex >= 0) {
          // Update quantity and price of existing item
          cart.items[existingItemIndex].quantity += quantity;
          cart.items[existingItemIndex].price = price || variant.price;
        } else {
          // Add new item to the cart
          cart.items.push({
            productId: productId,
            variantId: variantId,
            productName: productName,
            attributes: attributes,
            quantity: quantity,
            stockQuantity: variant.stockQuantity,
            price: price || variant.price,
            mainImage: mainImage || variant.mainImage,
          });
        }
      }
    } else {
      cart.items = items;
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
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

// @desc    Remove item from cart
// @route   DELETE /api/carts/:user_id/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { user_id, productId } = req.params;

  const cart = await Cart.findOne({ user_id });

  if (cart) {
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.items.length === 0) {
      await cart.remove();
      res.json({ message: "Cart deleted" });
    } else {
      const updatedCart = await cart.save();
      res.json(updatedCart);
    }
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

export { getCart, removeCartItem, syncCart };
