import mongoose from "mongoose";

// Define the Variant Schema
const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    dimensions: {
      width: {
        type: Number,
        min: [0, "Width cannot be negative"],
        required: true,
      },
      height: {
        type: Number,
        min: [0, "Height cannot be negative"],
        required: true,
      },
      depth: {
        type: Number,
        min: [0, "Depth cannot be negative"],
        required: true,
      },
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Please enter your product price!"],
      min: [0, "Price cannot be negative"],
    },
    stock_quantity: {
      type: Number,
      required: [true, "Please enter your product stock!"],
      min: [0, "Stock quantity cannot be negative"],
    },
    color: {
      type: String,
      required: true,
    },
    // Main image field for faster access
    main_image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    // Array of additional images
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    material: {
      type: String,
      default: "Not specified",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: If you frequently query by product and color
variantSchema.index({ product: 1, color: 1 });

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
