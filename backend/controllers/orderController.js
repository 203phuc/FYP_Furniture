import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    cart_id,
    buyer_id,
    items,
    total_product,
    payment_status,
    shipping_address,
    paid_at,
    delivered_at,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !cart_id ||
    !buyer_id ||
    !items ||
    items.length === 0 ||
    !total_product ||
    !shipping_address
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const order = new Order({
    cart_id,
    buyer_id,
    items,
    total_product,
    payment_status,
    shipping_address,
    paid_at,
    delivered_at,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer_id", "name email")
    .populate("items.product_id", "name price")
    .populate("items.shop_id", "name");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get orders by buyer ID
// @route   GET /api/orders/user/:buyer_id
// @access  Private
const getOrdersByBuyerId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer_id: req.params.buyer_id })
    .populate("items.product_id", "name price")
    .populate("items.shop_id", "name");

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("Orders not found for this user");
  }
});

// @desc    Update order status (payment, delivery)
// @route   PUT /api/orders/:id
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.payment_status = req.body.payment_status || order.payment_status;
    order.paid_at = req.body.paid_at || order.paid_at;
    order.delivered_at = req.body.delivered_at || order.delivered_at;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  createOrder,
  getOrderById,
  getOrdersByBuyerId,
  updateOrderStatus,
  deleteOrder,
};
