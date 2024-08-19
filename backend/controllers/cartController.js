import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";

// @desc    Create or update a cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { user_id, items } = req.body;

  // Find the cart by user ID
  let cart = await Cart.findOne({ user_id });

  if (cart) {
    // If the cart exists, update it
    items.forEach((newItem) => {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === newItem.product_id
      );

      if (existingItemIndex >= 0) {
        // If item exists, update the quantity and price
        cart.items[existingItemIndex].quantity += newItem.quantity;
        cart.items[existingItemIndex].price = newItem.price;
      } else {
        // Otherwise, add the new item
        cart.items.push(newItem);
      }
    });
  } else {
    // If the cart doesn't exist, create a new cart
    cart = new Cart({
      user_id,
      items,
    });
  }

  const savedCart = await cart.save();
  res.status(201).json(savedCart);
});

// @desc    Get cart by user ID
// @route   GET /api/cart/:user_id
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user_id: req.params.user_id }).populate(
    "items.product_id",
    "name price"
  );

  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:user_id/:product_id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user_id });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id
    );

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
      const updatedCart = await cart.save();
      res.json(updatedCart);
    } else {
      res.status(404);
      throw new Error("Item not found in cart");
    }
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:user_id/:product_id
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const { user_id, product_id } = req.params;

  const cart = await Cart.findOne({ user_id });

  if (cart) {
    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== product_id
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

export { addToCart, getCart, updateCartItem, removeCartItem };
