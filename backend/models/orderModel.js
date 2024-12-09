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
        type: Object, // Using Object type instead of Mixed for generic object data
        required: [true, "Please provide the product details"], // Optional validation if needed
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
      zipCode: {
        type: Number,
        required: [true, "Please provide the zipcode"],
      },
      country: {
        type: String,
        required: [true, "Please provide the country"],
      },
      addressType: {
        type: String,
        required: [false], // Optional field
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
    totalPrice: {
      type: Number,
      required: [true, "Please provide the total price"],
    },
  },
  {
    timestamps: true, // Automatically adds updatedAt field
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
