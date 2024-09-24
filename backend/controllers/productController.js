import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Variant from "../models/variantModel.js";
import Shop from "../models/shopModel.js";
import cloudinary from "cloudinary";

// Function to handle image uploads
const uploadImages = async (images) => {
  return Promise.all(
    images.map(async (image) => {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });
      return { public_id: result.public_id, url: result.secure_url };
    })
  );
};

// Function to process color images
const processColorImages = async (colors) => {
  return Promise.all(
    colors.map(async (color) => {
      if (color.images && color.images.length > 0) {
        color.images = await uploadImages(color.images.map((img) => img.url));
      }
      return color;
    })
  );
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({}).populate({
      path: "variants", // Populating variants
      populate: {
        path: "colors.images", // Optionally populate images inside colors
      },
    });
    res.json(products);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// @desc    Create a new product (without variants initially)
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const { shopId, ...productData } = req.body;

    // Validate Shop ID
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(400).json({ message: "Invalid Shop ID" });
    }
    const myCloud = await cloudinary.v2.uploader.upload(productData.mainImage, {
      folder: "products",
    });

    productData.mainImage = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    productData.shop = shop._id;

    // Create the product without variants
    const product = await Product.create(productData);

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
    const variants = await Variant.find({ product: product._id });
    await Variant.deleteMany({ product: product._id });

    // Optionally delete associated images from Cloudinary
    await Promise.all(
      variants.flatMap((variant) =>
        variant.colors.flatMap((color) =>
          color.images.map((image) =>
            cloudinary.v2.uploader.destroy(image.public_id)
          )
        )
      )
    );

    await product.remove();
    res.json({ message: "Product and its variants removed" });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// @desc    Update a product and its variants
// @route   PATCH /api/products/:id
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
      variants,
    } = req.body;

    const product = await Product.findById(req.params.id).populate("variants");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock_quantity = stock_quantity ?? product.stock_quantity;
    product.category = category ?? product.category;
    product.roomtype = roomtype ?? product.roomtype;

    // Save product updates
    await product.save();

    if (variants && variants.length > 0) {
      // Get existing variant IDs
      const existingVariants = product.variants.map((v) => v._id.toString());

      // Process updates and new variants
      const updatedVariants = await Promise.all(
        variants.map(async (variant) => {
          if (variant._id) {
            // Update existing variant
            const existingVariant = await Variant.findById(variant._id);
            if (existingVariant) {
              if (variant.colors && variant.colors.length > 0) {
                variant.colors = await processColorImages(variant.colors);
              }
              existingVariant.set(variant);
              return await existingVariant.save();
            }
          } else {
            // Create new variant
            if (variant.colors && variant.colors.length > 0) {
              variant.colors = await processColorImages(variant.colors);
            }
            variant.product = product._id; // Link variant to product
            return await Variant.create(variant);
          }
        })
      );

      // Get updated variant IDs
      const updatedVariantIds = updatedVariants.map((v) => v._id.toString());

      // Delete variants that are no longer present
      const variantIdsToRemove = existingVariants.filter(
        (id) => !updatedVariantIds.includes(id)
      );
      if (variantIdsToRemove.length > 0) {
        await Variant.deleteMany({ _id: { $in: variantIdsToRemove } });
      }

      // Update product's variant references
      product.variants = updatedVariants.map((variant) => variant._id);
      await product.save();
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// @desc    Get all products from a specific shop
// @route   GET /api/products/shop/:shopId
// @access  Public
const getProductsByShop = asyncHandler(async (req, res, next) => {
  try {
    const { shopId } = req.params;

    // Validate Shop ID
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(400).json({ message: "Invalid Shop ID" });
    }

    // Find all products associated with the shop
    const products = await Product.find({ shop: shopId }).populate({
      path: "variants", // Populating variants
      populate: {
        path: "colors.images", // Optionally populate images inside colors
      },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this shop" });
    }

    res.json(products);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

export {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductsByShop,
};
