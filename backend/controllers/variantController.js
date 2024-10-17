import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

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
const addVariant = async (req, res) => {
  const { productId } = req.body; // Only the productId is needed for now

  try {
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

    const createdVariants = [];

    // Create and save each variant with option data directly
    for (const combination of combinations) {
      const variant = new Variant({
        product: productId, // Link the variant to the product
        ...combination, // Store the combination of options directly
      });

      const savedVariant = await variant.save();
      createdVariants.push(savedVariant._id);
    }

    res
      .status(201)
      .json({ message: "Variants added successfully", createdVariants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding variants to product" });
  }
};

// Controller to check if a product has variants
const checkIfProductHasVariants = async (req, res) => {
  const { productId } = req.params; // Extract productId from request params

  try {
    // Find the product and populate the variants field
    const product = await Product.findById(productId).populate("variants");

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has any variants
    const hasVariants = product.variants && product.variants.length > 0;

    // Return a boolean value indicating if variants exist
    return res.status(200).json({ hasVariants });
  } catch (error) {
    console.error(error);
    // Return a 500 error if something goes wrong
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to update additional details of a variant
const updateVariantDetails = async (req, res) => {
  const { variantId, price, stock_quantity, mainImage, images } = req.body;

  try {
    // Find the variant by ID
    const variant = await Variant.findById(variantId);

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Update the variant with additional details
    variant.price = price; // Add price
    variant.stock_quantity = stock_quantity; // Add stock quantity
    variant.mainImage = mainImage; // Add main image
    variant.images = images; // Add images array

    // Save the updated variant
    const updatedVariant = await variant.save();

    res
      .status(200)
      .json({ message: "Variant updated successfully", updatedVariant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating variant details" });
  }
};

// Controller to get all variants of a specific product
const getVariantsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product and populate its variants
    const productWithVariants = await Product.findById(productId).populate(
      "variants"
    );

    if (!productWithVariants) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(productWithVariants.variants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching variants" });
  }
};

// Controller to delete a variant from a product
const deleteVariant = async (req, res) => {
  const { variantId } = req.params;

  try {
    // Remove the variant from the Variant model
    const variant = await Variant.findByIdAndDelete(variantId);

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting variant" });
  }
};

// Export all controllers as a single object
export default {
  addVariant,
  checkIfProductHasVariants,
  updateVariantDetails,
  getVariantsByProduct,
  deleteVariant,
};
