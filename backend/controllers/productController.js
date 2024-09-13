import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Variant from "../models/variantModel.js"; // Import the Variant model
import Shop from "../models/shopModel.js";
import cloudinary from "cloudinary";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({}).populate({
      path: "variants", // Populating variants along with product
      model: "Variant",
    });
    res.json(products);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// @desc    Create a new product with variants
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const { shopId, images, variants, ...productData } = req.body;

    // Validate Shop ID
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(400).json({ message: "Invalid Shop ID" });
    }

    let imagesArray = [];

    // Handle image uploads
    if (typeof images === "string") {
      imagesArray.push(images);
    } else {
      imagesArray = images;
    }

    const imagesLinks = await Promise.all(
      imagesArray.map(async (image) => {
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "products",
        });
        return { public_id: result.public_id, url: result.secure_url };
      })
    );

    productData.images = imagesLinks;
    productData.shop = shop._id;

    // Create the product
    const product = await Product.create(productData);

    // Handle variant creation
    if (variants && variants.length > 0) {
      const variantDocs = await Promise.all(
        variants.map(async (variant) => {
          variant.product = product._id; // Link variant to product
          return await Variant.create(variant); // Create each variant
        })
      );

      // Add the created variants to the product's `variants` field
      product.variants = variantDocs.map((variant) => variant._id);
      await product.save(); // Save the updated product with variants
    }

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// @desc    Delete a product and its variants
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated variants
    await Variant.deleteMany({ product: product._id });

    await product.remove();
    res.json({ message: "Product and its variants removed" });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// @desc    Update a product and its variants
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      category,
      roomtype,
      images,
      variants,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock_quantity = stock_quantity || product.stock_quantity;
    product.category = category || product.category;
    product.roomtype = roomtype || product.roomtype;

    // Handle image updates
    if (images) {
      let imagesArray = [];
      if (typeof images === "string") {
        imagesArray.push(images);
      } else {
        imagesArray = images;
      }

      const imagesLinks = await Promise.all(
        imagesArray.map(async (image) => {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "products",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );
      product.images = imagesLinks;
    }

    // Handle variant updates
    if (variants && variants.length > 0) {
      await Variant.deleteMany({ product: product._id }); // Delete old variants

      const variantDocs = await Promise.all(
        variants.map(async (variant) => {
          variant.product = product._id; // Link variant to product
          return await Variant.create(variant); // Create new variants
        })
      );

      product.variants = variantDocs.map((variant) => variant._id); // Link new variants
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

export { getProducts, createProduct, deleteProduct, updateProduct };
