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
    stockQuantity: {
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
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
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
    // Add 3D Model field
    threeDModel: {
      public_id: {
        type: String, // Store Cloudinary public_id
      },
      url: {
        type: String, // Store the URL of the 3D model file
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: If you frequently query by product and color
variantSchema.index({ product: 1, color: 1 });

const Variant = mongoose.model("Variant", variantSchema); // Changed to "variants"

export default Variant;
