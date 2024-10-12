import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

// Controller to add a new variant to an existing product
export const addVariant = async (req, res) => {
  const {
    productId,
    dimensions,
    weight,
    price,
    stock_quantity,
    color,
    mainImage, // Added mainImage
    images, // Added images array
    material,
  } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Create the variant with the provided data, including mainImage and images
    const variant = new Variant({
      product: productId, // Link the variant to the product
      dimensions,
      weight,
      price,
      stock_quantity,
      color,
      mainImage, // Include the main image
      images, // Include the array of images
      material,
    });

    // Save the variant
    const savedVariant = await variant.save();

    // Add the variant to the product's `variants` array
    product.variants.push(savedVariant._id);

    // Save the updated product with the new variant
    await product.save();

    res.status(201).json(savedVariant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding variant to product" });
  }
};

// Controller to get all variants of a specific product
export const getVariantsByProduct = async (req, res) => {
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
export const deleteVariant = async (req, res) => {
  const { variantId, productId } = req.params;

  try {
    // Remove the variant from the Variant model
    const variant = await Variant.findByIdAndDelete(variantId);

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }

    // Find the product and remove the variant from its `variants` array
    await Product.findByIdAndUpdate(productId, {
      $pull: { variants: variantId },
    });

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting variant" });
  }
};
