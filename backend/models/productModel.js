import mongoose from "mongoose";

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"], // Assuming a rating scale of 0-5
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the current date/time
    },
  },
  {
    _id: false, // Prevent creating a separate _id for each review
  }
);

// Define the product schema
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
    stock_quantity: {
      type: Number,
      required: [true, "Please enter your product stock!"],
      min: [0, "Stock quantity cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please enter your product category!"],
      enum: ["Furniture", "Electronics", "Appliances"], // Example categories
    },
    roomtype: {
      type: String,
      required: [true, "Please enter your product room type!"],
      enum: ["Living Room", "Bedroom", "Office", "Outdoor"], // Example room types
    },
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
    specifications: {
      dimensions: {
        width: {
          type: Number,
          min: [0, "Width cannot be negative"],
        },
        height: {
          type: Number,
          min: [0, "Height cannot be negative"],
        },
        depth: {
          type: Number,
          min: [0, "Depth cannot be negative"],
        },
      },
      material: {
        type: String,
        default: "Not specified",
      },
      color: {
        type: String,
        default: "Not specified",
      },
      weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
      },
    },
    approved: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema], // Embed reviewSchema as a subdocument
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
