import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the cart ID"],
      ref: "Cart", // Assuming there is a Cart model
    },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the buyer ID"],
      ref: "User", // Assuming there is a User model
    },
    items: [
      {
        product_id: {
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
        total_cost: {
          type: Number,
          required: [true, "Please provide the total cost"],
          min: [0, "Total cost cannot be negative"],
        },
        shop_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide the shop ID"],
          ref: "Shop", // Assuming there is a Shop model
        },
      },
    ],
    total_product: {
      type: Number,
      required: [true, "Please provide the total number of products"],
      min: [1, "Total number of products must be at least 1"],
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], // Example statuses
      default: "Pending",
    },
    shipping_address: {
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
    paid_at: {
      type: Date,
      required: [false], // Optional field
    },
    delivered_at: {
      type: Date,
      required: [false], // Optional field
    },
    created_at: {
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
