import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    cartId,
    buyerId,
    items,
    totalProduct,
    paymentStatus,
    shippingAddress,
    paidAt,
    deliveredAt,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !cartId ||
    !buyerId ||
    !items ||
    items.length === 0 ||
    !totalProduct ||
    !shippingAddress
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const order = new Order({
    cartId,
    buyerId,
    items,
    totalProduct,
    paymentStatus,
    shippingAddress,
    paidAt,
    deliveredAt,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyerId", "name email")
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
// @route   GET /api/orders/user/:buyerId
// @access  Private
const getOrdersByBuyerId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.params.buyerId })
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
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    order.paidAt = req.body.paidAt || order.paidAt;
    order.deliveredAt = req.body.deliveredAt || order.deliveredAt;

    const updatedOrder = await order.save();
    const updateVariants = order.items.map(async (item) => {
      const variant = await item.product_id.variants.find(
        (variant) => variant._id.toString() === item.variant_id.toString()
      );
      variant.quantity -= item.quantity;
      await variant.save();
    });
    await Promise.all(updateVariants);
    res.json({
      message: "Order status updated successfully",
    })
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
