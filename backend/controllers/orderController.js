import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    buyerId,
    items,
    totalProduct,
    paymentStatus,
    shippingAddress,
    paidAt,
    deliveredAt,
    totalPrice,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !buyerId ||
    !items ||
    items.length === 0 ||
    !totalProduct ||
    !shippingAddress ||
    !totalPrice
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const cart = await Cart.findOne({ user_id: buyerId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const cartId = cart._id;

  try {
    // Create the new order
    const order = new Order({
      cartId,
      buyerId,
      items,
      totalProduct,
      paymentStatus,
      shippingAddress,
      paidAt,
      deliveredAt,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Delete the cart after the order is successfully saved
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err);
    res.status(500);
    throw new Error("An error occurred while creating the order");
  }
});

// @desc    Get orders by shop ID
// @route   GET /api/orders/shop/:shopId
// @access  Private
const getOrdersByShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  console.log("this is the shop all order");
  try {
    // Step 1: Get all orders
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      res.status(404);
      throw new Error("No orders found");
    }

    // Step 2: Extract all product IDs from the orders
    const productIds = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productIds.push(item.productId);
      });
    });

    // Step 3: Find all products by productId and filter by shopId
    const products = await Product.find({ _id: { $in: productIds }, shopId });

    if (!products || products.length === 0) {
      res.status(404);
      throw new Error("No products found for this shop");
    }

    // Step 4: Filter orders related to the shop
    const shopOrders = orders.filter((order) =>
      order.items.some((item) =>
        products.some(
          (product) => product._id.toString() === item.productId.toString()
        )
      )
    );

    if (shopOrders.length === 0) {
      res.status(404);
      throw new Error("No orders found for products in this shop");
    }
    console.log("shop order: ", shopOrders);
    // Step 5: Return the related orders
    res.json({ shopId, shopOrders });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch orders for this shop");
  }
});

// @desc    Get total products sold by shop ID
// @route   GET /api/orders/shop/:shopId
// @access  Private
const getProductsSoldByShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  console.log("this is the Sold by shop");
  try {
    // Step 1: Get all orders
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      res.status(404);
      throw new Error("No orders found");
    }

    // Step 2: Extract all product IDs from the orders
    const productIds = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productIds.push(item.productId);
      });
    });
    console.log(productIds);

    // Step 3: Find all products by productId and filter by shopId
    const products = await Product.find({ _id: { $in: productIds }, shopId });

    console.log("product in shop", products);

    if (!products || products.length === 0) {
      res.status(404);
      throw new Error("No products found for this shop");
    }

    // Step 4: Count total quantity sold for products belonging to the shop
    let totalProductsSold = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const isProductFromShop = products.some(
          (product) => product._id.toString() === item.productId.toString()
        );
        if (isProductFromShop) {
          totalProductsSold += item.quantity;
        }
      });
    });

    console.log(totalProductsSold);

    // Step 5: Return the result
    res.json({ shopId, totalProductsSold });
  } catch (error) {
    res.status(500);
    console.log("getProductsSoldByShop", error);
    throw new Error("Failed to fetch product count for this shop");
  }
});

// @desc    Get total products sold by shop ID
// @route   GET /api/orders/shop/earnings/:shopId
// @access  Private
const getEarningsByShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  console.log("this is the Earning");
  try {
    // Step 1: Get all orders
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      res.status(404);
      throw new Error("No orders found");
    }

    // Step 2: Extract all product IDs from the orders
    const productIds = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productIds.push(item.productId);
      });
    });

    // Step 3: Find all products by productId and filter by shopId
    const products = await Product.find({ _id: { $in: productIds }, shopId });

    if (!products || products.length === 0) {
      res.status(404);
      throw new Error("No products found for this shop");
    }

    // Step 4: Calculate total products sold and total earnings
    let totalProductsSold = 0;
    let totalEarnings = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find(
          (product) => product._id.toString() === item.productId.toString()
        );

        if (product) {
          totalProductsSold += item.quantity;
          totalEarnings += item.quantity * item.price; // Assuming `item.price` is the selling price per unit
        }
      });
    });

    console.log("total product sold", totalProductsSold);
    console.log(totalEarnings);

    // Step 5: Deduct 10% from total earnings
    const earningsAfterDeduction = totalEarnings * 0.9;

    // Step 6: Return the result
    res.json({
      shopId,
      totalProductsSold,
      totalEarnings,
      earningsAfterDeduction,
    });
  } catch (error) {
    res.status(500);
    console.log("getEarningsByShop", error);
    throw new Error("Failed to fetch product data for this shop");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin or authorized user)
const getAllOrders = asyncHandler(async (req, res) => {
  // Fetch all orders from the database
  const orders = await Order.find();

  if (orders && orders.length > 0) {
    res.json(orders); // Return all orders if they exist
  } else {
    res.status(404); // No orders found
    throw new Error("No orders found");
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyerId", "name email")
    .populate("items.product_id", "name price");

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
  console.log(req.params.buyerId);
  const orders = await Order.find({ buyerId: req.params.buyerId });
  console.log("User order", orders);
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
    });
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
  deleteOrder,
  getAllOrders,
  getEarningsByShop,
  getOrderById,
  getOrdersByBuyerId,
  getOrdersByShop,
  getProductsSoldByShop,
  updateOrderStatus,
};
