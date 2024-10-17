import mongoose from "mongoose";

// Option Schema
const optionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Option name (e.g., Color)
  values: [
    {
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      }, // Option value (e.g., "NOMAD SNOW")
      image: { type: String }, // Optional image URL for this value
    },
  ],
});

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
    department: {
      type: String,
      required: [true, "Please enter your product category!"],
      enum: [
        "Living",
        "Bedroom",
        "Dining",
        "Office",
        "Outdoor",
        "Lighting",
        "Decor",
        "Rug",
      ],
    },
    type: {
      type: String,
    },
    tags: {
      type: [String],
    },
    options: [optionSchema], // Array of options
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "variants" }], // Reference to Variant collection
    approved: {
      type: Boolean,
      default: false,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to Review collection
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

const Product = mongoose.model("Product", productSchema);

export default Product;
