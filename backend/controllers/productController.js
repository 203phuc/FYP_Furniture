import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";

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
    // Upload the image to Cloudinary
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "products", quality: "auto" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Image upload failed!", error: error.message });
        }

        // Assign the uploaded image to the product data
        productData.mainImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };

        try {
          // Create the product
          const product = await Product.create({
            ...productData,
            shopId, // Include shopId directly here
            shop: shop, // Save the shop object directly
          });

          res.status(201).json({ success: true, product });
        } catch (err) {
          res
            .status(500)
            .json({ message: "Product creation failed!", error: err.message });
        }
      }
    );

    uploadStream.end(req.file.buffer); // End the upload stream with the image buffer
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
  // Find products where approved is true
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
    shopId,
    shop,
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

  // Optionally update shopId and shop object
  if (shopId) {
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return res.status(400).json({ message: "Invalid Shop ID" });
    }
    product.shopId = shopId; // Update shopId if provided
    product.shop = shop; // Update shop object if provided
  }

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
