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
    price: {
      type: Number,
      required: [true, "Please enter your product price!"],
      min: [0, "Price cannot be negative"],
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
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to Review collection
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
  },
  {
    timestamps: true,
  }
);

// Adding indexes to improve query performance
productSchema.index({ category: 1 });
productSchema.index({ roomtype: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
