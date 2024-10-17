import mongoose from "mongoose";

// Define the Variant Schema
const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    stock_quantity: {
      type: Number,
      min: [0, "Stock quantity cannot be negative"],
    },
    mainImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    // Array of additional images
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index: If you frequently query by product and color
variantSchema.index({ product: 1, color: 1 });

const Variant = mongoose.model("variants", variantSchema); // Changed to "variants"

export default Variant;
