import mongoose from "mongoose";

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name for your product"],
    },
    description: {
      type: String,
      required: [true, "Please enter your product description!"],
    },

    category: {
      type: String,
      required: [true, "Please enter your product category!"],
      enum: ["Furniture", "Electronics", "Appliances"],
    },
    roomtype: {
      type: String,
      required: [true, "Please enter your product room type!"],
      enum: ["Living Room", "Bedroom", "Office", "Outdoor"],
    },
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }], // Reference to Variant collection
    approved: {
      type: Boolean,
      default: false,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to Review collection// Main image field for faster access
    mainImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    // New fields added
    shopId: {
      type: String,
      required: true, // Make this field required
    },
    shop: {
      type: Object,
      required: true, // Make this field required
    },
  },
  {
    timestamps: true,
  }
);

// Adding indexes to improve query performance
productSchema.index({ category: 1 });
productSchema.index({ roomtype: 1 });
productSchema.index({ shopId: 1 }); // Optional: Add an index for shopId

const Product = mongoose.model("Product", productSchema);

export default Product;
