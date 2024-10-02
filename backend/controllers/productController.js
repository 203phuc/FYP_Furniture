import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";
import cloudinary from "cloudinary";

// @desc    Create a new product (without variants)
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const { shopId, ...productData } = req.body;

  // Validate Shop ID
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(400).json({ message: "Invalid Shop ID" });
  }

  // Check for uploaded file
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image!" });
  }

  try {
    // Upload the image to Cloudinary without resizing or cropping
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "products",
      quality: "auto", // Automatically optimize quality while keeping original resolution
    });

    // Assign the uploaded image to the product data
    productData.mainImage = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    // Create the product
    const product = await Product.create({
      ...productData,
      shop: shop._id, // Linking the product to the shop
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image upload failed!", error: error.message });
  }
});

// Other functions remain unchanged
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
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Optionally delete associated images from Cloudinary
  await cloudinary.v2.uploader.destroy(product.mainImage.public_id);

  await product.remove();
  res.status(200).json({ message: "Product removed" });
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    roomtype,
    dimensions,
    weight,
    stock_quantity,
    color,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Update product details
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.roomtype = roomtype ?? product.roomtype;
  product.dimensions = dimensions ?? product.dimensions;
  product.weight = weight ?? product.weight;
  product.stock_quantity = stock_quantity ?? product.stock_quantity;
  product.color = color ?? product.color;

  // Save product updates
  await product.save();

  res.status(200).json({ success: true, product });
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
  const products = await Product.find({ shop: shopId });

  if (products.length === 0) {
    return res.status(404).json({ message: "No products found for this shop" });
  }

  res.status(200).json(products);
});

export {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductsByShop,
};
