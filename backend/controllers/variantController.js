import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler"; // Import asyncHandler
import Product from "../models/productModel.js";
import Variant from "../models/variantModel.js";

// Utility function to generate combinations
const generateCombinations = (
  keys,
  index,
  current,
  combinations,
  optionValues
) => {
  if (index === keys.length) {
    combinations.push({ ...current }); // Push a copy of the current combination
    return;
  }

  const key = keys[index];
  optionValues[key].forEach((value) => {
    current[key] = value;
    generateCombinations(keys, index + 1, current, combinations, optionValues);
  });
};

// Controller to add variants with option data directly
const addVariant = asyncHandler(async (req, res) => {
  const { productId } = req.body; // Only the productId is needed for now

  // Find the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Extract options from the product
  const optionValues = {};
  product.options.forEach((option) => {
    optionValues[option.name] = option.values.map((value) => value.value);
  });

  // Generate combinations of variants based on product options
  const keys = Object.keys(optionValues);
  const combinations = [];
  generateCombinations(keys, 0, {}, combinations, optionValues);
  console.log(combinations);
  const createdVariants = [];

  // Create and save each variant with option data directly
  for (const combination of combinations) {
    const variant = new Variant({
      product: productId, // Link the variant to the product
      atributes: { ...combination }, // Store the combination of options directly
    });

    const savedVariant = await variant.save();
    createdVariants.push(savedVariant._id);
  }

  res
    .status(201)
    .json({ message: "Variants added successfully", createdVariants });
});

// Controller to check if a product has variants
const checkIfProductHasVariants = asyncHandler(async (req, res) => {
  const { productId } = req.params; // Extract productId from request params
  console.log(productId);
  // Find the product and populate the variants field
  const product = await Product.findById(productId).populate("variants");
  console.log(product);
  // If the product is not found, return a 404 error
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if the product has any variants
  const hasVariants = product.variants && product.variants.length > 0;
  console.log(hasVariants);
  // Return a boolean value indicating if variants exist
  return res.status(200).json({ hasVariants });
});

// Controller to update additional details of a variant
const updateVariantDetails = asyncHandler(async (req, res) => {
  const { _id, price, stock_quantity, mainImage, images, atributes } = req.body;
  console.log("pre", mainImage);
  // Find the variant by ID
  const variant = await Variant.findById(_id);
  if (!variant) {
    return res.status(404).json({ error: "Variant not found" });
  }

  // Function to upload an image to Cloudinary
  const uploadImageToCloudinary = async (image) => {
    const result = await cloudinary.uploader.upload(image, {
      folder: "variants", // Optional: specify a folder
    });
    return {
      public_id: result.public_id, // Store the public ID from Cloudinary
      url: result.secure_url, // Return the URL of the uploaded image
    };
  };

  // Upload main image and additional images
  try {
    if (mainImage) {
      variant.mainImage = await uploadImageToCloudinary(mainImage);
    }

    if (images && Array.isArray(images)) {
      const uploadedImages = await Promise.all(
        images.map(async (image) => await uploadImageToCloudinary(image))
      );
      variant.images = uploadedImages;
    }

    if (atributes) {
      variant.atributes = atributes; // Update attributes directly
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Image upload failed", details: error.message });
  }

  // Update the variant with additional details
  variant.price = price; // Add price
  variant.stock_quantity = stock_quantity; // Add stock quantity

  // Save the updated variant
  const updatedVariant = await variant.save();

  res
    .status(200)
    .json({ message: "Variant updated successfully", updatedVariant });
});

// Controller to get all variants of a specific product
const getVariantsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Find the product and populate its variants
  const productWithVariants = await Product.findById(productId).populate(
    "variants"
  );
  if (!productWithVariants) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.status(200).json(productWithVariants.variants);
});

// Controller to delete a variant from a product
const deleteVariant = asyncHandler(async (req, res) => {
  const { variantId } = req.params;

  // Remove the variant from the Variant model
  const variant = await Variant.findByIdAndDelete(variantId);
  if (!variant) {
    return res.status(404).json({ error: "Variant not found" });
  }

  res.status(200).json({ message: "Variant deleted successfully" });
});

// Export all controllers as a single object
export {
  addVariant,
  checkIfProductHasVariants,
  deleteVariant,
  getVariantsByProduct,
  updateVariantDetails,
};
