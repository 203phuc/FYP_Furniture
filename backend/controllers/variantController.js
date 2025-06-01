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
    console.log("Final combination before push:", current); // Log final combination
    combinations.push({ ...current }); // Push a copy of the current combination
    return;
  }

  const key = keys[index];
  const optionsForKey = optionValues[key];

  // Debug log to see current key and its values
  console.log("Current key:", key, "Option values:", optionsForKey);

  // Check if there are any values for this key
  if (optionsForKey.length === 0) {
    // If there are no values (like for Material), set a default value and continue
    console.log(`No values for key "${key}", adding default null values`);
    current[key] = { value: null, image: null };
    generateCombinations(keys, index + 1, current, combinations, optionValues);
  } else {
    // If there are values, iterate over them and recursively generate combinations
    optionsForKey.forEach((option) => {
      current[key] = { value: option.value, image: option.image };
      console.log(`Current combination at index ${index}:`, current); // Debug log for current combination/++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/////////
      generateCombinations(
        keys,
        index + 1,
        current,
        combinations,
        optionValues
      );
    });
  }
};
// Controller to add variants with option data directly
const addVariant = asyncHandler(async (req, res) => {
  const { productId } = req.body; // Only the productId is needed for now

  console.log("variants controllers", productId);
  // Find the product by ID
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Extract options from the product
  const optionValues = {};
  try {
    product.options.forEach((option) => {
      optionValues[option.name] = option.values.map((value) => ({
        value: value.value, // Get the value
        image: value.image, // Get the image (if present)
      }));
    });
  } catch (error) {
    console.log(error);
  }
  console.log("optionValues__________", optionValues);

  // Generate combinations of variants based on product options
  const keys = Object.keys(optionValues);
  const combinations = [];
  generateCombinations(keys, 0, {}, combinations, optionValues);
  console.log("combination:", combinations);
  const createdVariants = [];

  // Create and save each variant with option data directly
  for (const combination of combinations) {
    const variant = new Variant({
      product: productId, // Link the variant to the product
      attributes: { ...combination }, // Store the combination of options directly
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
// Function to upload an image or 3D model to Cloudinary
const uploadToCloudinary = async (image) => {
  const result = await cloudinary.uploader.upload(image, {
    folder: "variants", // Optional: specify a folder
  });
  return {
    public_id: result.public_id, // Store the public ID from Cloudinary
    url: result.secure_url, // Return the URL of the uploaded image
  };
};
const uploadToCloudinaryFor3D = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "raw", folder: folder },
      (error, result) => {
        if (error) {
          console.log("Cloudinary upload failed: " + error.message);
          reject(error);
        } else {
          // Return the secure URL along with the public_id
          resolve({
            public_id: result.public_id,
            url: result.secure_url, // Return the secure URL
          });
        }
      }
    );

    // Pipe the buffer to the stream
    uploadStream.end(fileBuffer);
  });
};

const updateVariantDetails = asyncHandler(async (req, res) => {
  console.log("into the updateVariantDetails");
  const {
    _id,
    price,
    stockQuantity,
    mainImage,
    images,
    attributes,
    threeDModel,
  } = req.body;

  console.log(
    "_id",
    _id,
    "price",
    price,
    "stockQuantity",
    stockQuantity,
    "mainImage",
    mainImage,
    "images",
    images,
    "attributes",
    attributes,
    "threeDModel",
    threeDModel
  );

  // Find the variant by ID
  const variant = await Variant.findById(_id);
  if (!variant) {
    return res.status(404).json({ error: "Variant not found" });
  }

  try {
    // Handle main image (base64 or Cloudinary public ID)
    if (mainImage) {
      if (mainImage) {
        // If the variant already has a main image (public ID), check if it's a base64 string
        if (
          typeof mainImage === "string" &&
          mainImage.startsWith("data:image")
        ) {
          // Upload base64 image to Cloudinary
          variant.mainImage = await uploadToCloudinary(mainImage);
        } else {
          // If it's already a Cloudinary public ID, leave it unchanged
          console.log("Main image already exists, skipping base64 upload.");
        }
      } else {
        // If the variant does not have a main image, upload the new one
        variant.mainImage = await uploadToCloudinary(mainImage);
      }
    }

    // Handle additional images (base64 or Cloudinary public IDs)
    if (images && Array.isArray(images)) {
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          if (image.startsWith("data:image")) {
            // If it's a base64 string, upload it to Cloudinary
            return await uploadToCloudinary(image);
          } else {
            // If it's a Cloudinary public ID (already uploaded), keep it as-is
            return image; // No upload needed
          }
        })
      );
      variant.images = uploadedImages;
    }

    // Handle 3D model (USDZ) (base64 or file)
    // Handle 3D model (USDZ) (base64 or file)
    if (req.file) {
      console.log("File received:", req.file); // Log the file details to inspect

      const file = req.file;

      // Check if the file has a path (indicating it's a file and not a base64 string)
      if (file && file.buffer) {
        console.log("Valid file buffer received"); // Confirm the buffer is available

        // Pass the buffer to your upload logic
        variant.threeDModel = await uploadToCloudinaryFor3D(
          file.buffer, // Use 'buffer' directly instead of 'path'
          "variants"
        );
        console.log("3D model uploaded:", variant.threeDModel);
      } else {
        console.log("Invalid 3D model file or no buffer available.");
      }
    } else {
      console.log("No file uploaded.");
    }

    // Update attributes directly
    if (attributes) {
      // If attributes is a string (after being sent as JSON from frontend), parse it
      if (typeof attributes === "string") {
        try {
          variant.attributes = JSON.parse(attributes); // Parse it to an object
        } catch (error) {
          return res.status(400).json({ error: "Invalid attributes format" });
        }
      } else {
        variant.attributes = attributes; // Directly store if it's already an object
      }
    }

    // Update price and stock quantity
    variant.price = price;
    variant.stockQuantity = stockQuantity;

    // Save the updated variant
    const updatedVariant = await variant.save();

    res
      .status(200)
      .json({ message: "Variant updated successfully", updatedVariant });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Update failed", details: error.message });
  }
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

  // Find the variant by ID
  const variant = await Variant.findById(variantId);
  if (!variant) {
    return res.status(404).json({ error: "Variant not found" });
  }

  // Function to delete image or 3D model from Cloudinary
  const deleteFromCloudinary = async (publicId) => {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId); // Deletes from Cloudinary
      console.log(`Deleted file with public ID: ${publicId}`);
    }
  };

  // Delete the main image (if it exists)
  if (variant.mainImage && variant.mainImage.public_id) {
    await deleteFromCloudinary(variant.mainImage.public_id);
  }

  // Delete additional images (if they exist)
  if (variant.images && Array.isArray(variant.images)) {
    for (const image of variant.images) {
      if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }
  }

  // Delete the 3D model (if it exists)
  if (variant.threeDModel && variant.threeDModel.public_id) {
    await deleteFromCloudinary(variant.threeDModel.public_id);
  }

  // Remove the variant from the Variant model
  await variant.remove();

  res
    .status(200)
    .json({ message: "Variant and related media deleted successfully" });
});

// Export all controllers as a single object
export {
  addVariant,
  checkIfProductHasVariants,
  deleteVariant,
  getVariantsByProduct,
  updateVariantDetails,
};
