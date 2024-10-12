import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    roomtype,
    shopId,
    variants,
    approved,
    reviews,
  } = req.body;

  // Validate Shop ID
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(400).json({ message: "Invalid Shop ID" });
  }

  // Check for uploaded file (main image)
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image!" });
  }

  try {
    // Upload the image to Cloudinary
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "products", quality: "auto" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Image upload failed!", error: error.message });
        }

        // Create the product with the uploaded image details
        try {
          const product = await Product.create({
            name,
            description,
            category,
            roomtype,
            shopId,
            shop,
            variants, // Optional: Add if variants are provided
            approved: approved || false, // Default to false if not provided
            reviews, // Optional
            mainImage: {
              public_id: result.public_id,
              url: result.secure_url,
            },
          });

          res.status(201).json({ success: true, product });
        } catch (err) {
          res
            .status(500)
            .json({ message: "Product creation failed!", error: err.message });
        }
      }
    );

    // End the upload stream with the image buffer from the request
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error during image upload:", error);
    res
      .status(500)
      .json({ message: "Image upload failed!", error: error.message });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
});

// @desc    Fetch all approved products
// @route   GET /api/products/approved
// @access  Public
const getApprovedProducts = asyncHandler(async (req, res) => {
  const approvedProducts = await Product.find({ approved: true });

  if (!approvedProducts || approvedProducts.length === 0) {
    return res.status(404).json({ message: "No approved products found" });
  }

  res.status(200).json(approvedProducts);
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  console.log(`Received request to delete product with ID: ${req.params.id}`);

  const product = await Product.findById(req.params.id);
  console.log("Product found:", product);
  console.log(product.mainImage);
  if (!product) {
    console.log("Product not found");
    return res.status(404).json({ message: "Product not found" });
  }

  // Log the public ID before attempting to destroy the image on Cloudinary
  console.log(
    "Attempting to delete image from Cloudinary with public ID:",
    product.mainImage.public_id
  );

  try {
    await cloudinary.v2.uploader.destroy(product.mainImage.public_id);
    console.log("Image deleted from Cloudinary successfully");
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return res
      .status(500)
      .json({ message: "Error deleting image from Cloudinary" });
  }

  // Optionally delete associated images from Cloudinary
  try {
    console.log("Removing product from database...");
    await product.deleteOne();
    console.log("Product removed successfully");

    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    console.error("Error removing product from database:", error);
  }
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    roomtype,
    variants,
    approved,
    shopId,
    shop,
  } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Update product fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.category = category || product.category;
  product.roomtype = roomtype || product.roomtype;
  product.variants = variants || product.variants;
  product.approved = approved !== undefined ? approved : product.approved;

  // Optionally update shopId and shop object
  if (shopId) {
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return res.status(400).json({ message: "Invalid Shop ID" });
    }
    product.shopId = shopId;
    product.shop = shop || product.shop;
  }

  // Handle optional image upload
  if (req.file) {
    // Remove the old image from Cloudinary if a new one is uploaded
    await cloudinary.v2.uploader.destroy(product.mainImage.public_id);

    // Upload the new image to Cloudinary
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "products", quality: "auto" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Image upload failed!", error: error.message });
        }

        // Update the main image field
        product.mainImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        // Save product updates
        await product.save();
        res.status(200).json({ success: true, product });
      }
    );

    // End the upload stream with the new image buffer from the request
    uploadStream.end(req.file.buffer);
  } else {
    // Save product updates without changing the image
    await product.save();
    res.status(200).json({ success: true, product });
  }
});

// @desc    Get all products from a specific shop
// @route   GET /api/products/shop/:shopId
// @access  Public
const getProductsByShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;

  // Validate Shop ID
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(400).json({ message: "Invalid Shop ID" });
  }

  // Find all products associated with the shop
  const products = await Product.find({ shopId });

  if (products.length === 0) {
    return res.status(404).json({ message: "No products found for this shop" });
  }

  res.status(200).json(products);
});

export {
  createProduct,
  deleteProduct,
  getApprovedProducts,
  getProductDetails,
  getProducts,
  getProductsByShop,
  updateProduct,
};
