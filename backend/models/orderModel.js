import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the cart ID"],
      ref: "Cart", // Assuming there is a Cart model
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the buyer ID"],
      ref: "User", // Assuming there is a User model
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide the product ID"],
          ref: "Product", // Assuming there is a Product model
        },
        name: {
          type: String,
          required: [true, "Please provide the product name"],
        },
        price: {
          type: Number,
          required: [true, "Please provide the product price"],
          min: [0, "Price cannot be negative"],
        },
        quantity: {
          type: Number,
          required: [true, "Please provide the quantity"],
          min: [1, "Quantity must be at least 1"],
        },
        totalCost: {
          type: Number,
          required: [true, "Please provide the total cost"],
          min: [0, "Total cost cannot be negative"],
        },
        shopId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide the shop ID"],
          ref: "Shop", // Assuming there is a Shop model
        },
      },
    ],
    totalProduct: {
      type: Number,
      required: [true, "Please provide the total number of products"],
      min: [1, "Total number of products must be at least 1"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], // Example statuses
      default: "Pending",
    },
    shippingAddress: {
      address1: {
        type: String,
        required: [true, "Please provide the first address line"],
      },
      address2: {
        type: String,
        required: [false], // Optional field
      },
      city: {
        type: String,
        required: [true, "Please provide the city"],
      },
      zipcode: {
        type: Number,
        required: [true, "Please provide the zipcode"],
      },
      country: {
        type: String,
        required: [true, "Please provide the country"],
      },
    },
    paidAt: {
      type: Date,
      required: [false], // Optional field
    },
    deliveredAt: {
      type: Date,
      required: [false], // Optional field
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds updatedAt field
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
