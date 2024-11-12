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
        productId: {
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
        productName: {
          type: String,
          required: [true, "Please provide the product name"],
        },
        attributes: {
          type: mongoose.Schema.Types.Mixed,
          required: [true, "Please provide the product attributes"],
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please provide the variant ID"],
          ref: "Variant",
        },
        stockQuantity: {
          type: Number,
          required: [true, "Please provide the stock quantity"],
          min: [1, "Stock quantity must be at least 1"],
          validate: {
            validator: Number.isInteger,
            message: "Stock quantity must be an integer",
          },
        },
        mainImage: {
          public_id: {
            type: String,
            required: [true, "Please provide the main image public ID"],
          },
          url: {
            type: String,
            required: [true, "Please provide the main image URL"],
          },
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
    const variant = await mongoose
      .model("Variant")
      .findById(this.items[i].variant_id);
    if (variant) {
      this.items[i].price = variant.price; // Sync price from Product model
    }
  }
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
