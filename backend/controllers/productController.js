import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Shop from "../models/shopModel.js";
import Variant from "../models/variantModel.js";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    department,
    type,
    tags,
    shopId,
    options, // Dynamic options with mixed-type values
  } = req.body;
  console.log(req.body);
  // Validate Shop ID
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(400).json({ message: "Invalid Shop ID" });
  }

  try {
    // Process options and handle image uploads
    const processedOptions = await processOptions(options);

    // Create and save the product
    const product = new Product({
      name,
      description,
      department,
      type,
      tags,
      shopId,
      shop: {
        _id: shop._id,
        name: shop.name,
        location: shop.location,
      },
      options: processedOptions,
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Product creation failed!", error: error.message });
  }
});

// Helper function to process options with mixed-type values and image uploads
const processOptions = async (options) => {
  return await Promise.all(
    options.map(async (option) => {
      const processedValues = await Promise.all(
        option.values.map(async (value) => {
          // Check if there's an image to upload
          if (value.image) {
            try {
              const uploadResponse = await cloudinary.v2.uploader.upload(
                value.image,
                { folder: `options/${option.name}`, quality: "auto" }
              );
              return { ...value, image: uploadResponse.secure_url };
            } catch (err) {
              throw new Error("Image upload failed");
            }
          }
          // Return the value as it is, whether a string or an object (e.g., dimensions)
          return value;
        })
      );
      return { name: option.name, values: processedValues };
    })
  );
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductDetails = asyncHandler(async (req, res) => {
  try {
    // Attempt to find the product by ID
    const product = await Product.findById(req.params.id);

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has variants and populate if it does
    if (product.variants && product.variants.length > 0) {
      await product.populate("variants"); // Populate only if there are variants
    }

    // Return the found product
    res.status(200).json(product);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching product details:", error);
    res.status(500).json({
      message: "An error occurred while fetching product details",
      error: error.message,
    });
  }
});

// @desc    Fetch all approved products
// @route   GET /api/products/approved
// @access  Public
const getApprovedProducts = asyncHandler(async (req, res) => {
  const approvedProducts = await Product.find({ approved: true }).populate(
    "variants"
  );
  if (!approvedProducts.length) {
    return res.status(404).json({ message: "No approved products found" });
  }
  res.status(200).json(approvedProducts);
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("variants");
  res.status(200).json(products);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optionally, you can delete all related variants if you need to
    await Variant.deleteMany({ product: id });

    // Delete the product
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
  }
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    department,
    type,
    tags,
    shopId,
    options, // Updated options with potential mixed-type values and images
  } = req.body;

  // Find the product by ID
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Update product fields only if new values are provided
  product.name = name !== undefined ? name : product.name;
  product.description =
    description !== undefined ? description : product.description;
  product.department =
    department !== undefined ? department : product.department;
  product.type = type !== undefined ? type : product.type;
  product.tags = tags !== undefined ? tags : product.tags;

  // Optionally update shop info if a new shopId is provided
  if (shopId) {
    const shopExists = await Shop.findById(shopId);
    if (!shopExists) {
      return res.status(400).json({ message: "Invalid Shop ID" });
    }

    // Update shop information in the product object
    product.shopId = shopId; // Update shopId only if valid
    product.shop = {
      _id: shopExists._id,
      name: shopExists.name,
      location: shopExists.location,
    };
  }

  // Handle options update with possible image uploads
  if (options) {
    try {
      await Variant.deleteMany({ product: id });
      product.options = await processOptions(options);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error processing options", error: error.message });
    }
  }

  // Save the updated product
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

  const products = await Product.find({ shopId }).populate("variants");
  if (!products.length) {
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
