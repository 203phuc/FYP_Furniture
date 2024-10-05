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
        price: {
          type: Number,
          required: [true, "Please provide the product price"],
          min: [0, "Price cannot be negative"],
        },
        quantity: {
          type: Number,
          required: [true, "Please provide the quantity"],
          min: [1, "Quantity must be at least 1"],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
          },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to calculate total price of items in the cart
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

// Optional: Pre-save middleware to ensure price consistency if needed
cartSchema.pre("save", async function (next) {
  // Optionally fetch product prices from the Product model to ensure the cart
  // always has the current prices. This can be skipped if prices in the cart are handled manually.
  for (let i = 0; i < this.items.length; i++) {
    const product = await mongoose
      .model("Product")
      .findById(this.items[i].product_id);
    if (product) {
      this.items[i].price = product.price; // Sync price from Product model
    }
  }
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
