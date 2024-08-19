import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide the user ID"],
      ref: "User",
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide the product ID"],
          ref: "Product",
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
        added_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to calculate total price of items in the cart
cartSchema.methods.calculateTotalPrice = function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
