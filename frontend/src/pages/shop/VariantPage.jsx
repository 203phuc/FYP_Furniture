import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To access route parameters
import { toast } from "react-toastify";
import Loader from "../../components/Layout/Loader"; // Assuming you have a Loader component
import {
  useGetVariantsByProductQuery,
  useUpdateVariantDetailsMutation,
} from "../../redux/slices/variantApiSlice"; // Assuming you have the update mutation defined

const VariantPage = () => {
  const { id: productId } = useParams(); // Get productId from route params
  const {
    data: variants = [],
    isLoading,
    isError,
  } = useGetVariantsByProductQuery(productId);
  const [updateVariant] = useUpdateVariantDetailsMutation(); // Mutation hook for updating variant details

  // State to hold editable variant details
  const [editableVariants, setEditableVariants] = useState([]);

  // Handle error state
  if (isError) {
    toast.error("Failed to load variants.");
    return <div>Error loading variants.</div>;
  }

  // Set default values for editable fields when variants are fetched
  useEffect(() => {
    if (variants.length > 0) {
      const initializedVariants = variants.map((variant) => ({
        _id: variant._id,
        price: variant.price ?? 0, // Set default to 0 if undefined
        stock_quantity: variant.stock_quantity ?? 0, // Set default to 0 if undefined
        mainImage: variant.mainImage || "", // Default object if missing
        atributes: variant.atributes || {}, // Default empty object if missing
        images: variant.images || [], // Default empty array if missing
      }));

      setEditableVariants(initializedVariants);
    }
  }, [variants]);

  // Handle change in input fields for a specific variant
  const handleChange = (e, variantId) => {
    const { name, value } = e.target;
    setEditableVariants((prev) =>
      prev.map((variant) =>
        variant._id === variantId ? { ...variant, [name]: value } : variant
      )
    );
  };

  // Handle update submission for a specific variant
  const handleUpdate = async (variantId) => {
    const variantDetails = editableVariants.find((v) => v._id === variantId);
    const Id = variantDetails._id;
    try {
      await updateVariant(variantDetails, Id).unwrap();
      toast.success("Variant updated successfully!");
    } catch (error) {
      toast.error("Failed to update variant.");
    }
  };

  // Handle main image upload and convert to base64
  const handleMainImageUpload = (e, variantId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result; // Base64 encoded image
        setEditableVariants((prev) =>
          prev.map((variant) =>
            variant._id === variantId
              ? {
                  ...variant,
                  mainImage: base64Image, // Update mainImage with base64
                }
              : variant
          )
        );
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  // Handle additional image uploads and convert to base64
  const handleAdditionalImageUpload = (e, variantId) => {
    const files = Array.from(e.target.files); // Get all selected files
    const newImages = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Resolve with base64
        };
        reader.readAsDataURL(file); // Convert to base64
      });
    });

    Promise.all(newImages).then((base64Images) => {
      setEditableVariants((prev) =>
        prev.map((variant) =>
          variant._id === variantId
            ? {
                ...variant,
                images: [...variant.images, ...base64Images], // Append new images to existing
              }
            : variant
        )
      );
    });
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg">
      {isLoading ? (
        <Loader /> // Show loader while data is being fetched
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Variants for Product ID: {productId}
          </h1>
          {editableVariants.length > 0 ? (
            <ul className="space-y-4">
              {editableVariants.map((variant) => (
                <li
                  key={variant._id}
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-md"
                >
                  <h3 className="text-lg font-semibold">
                    Variant ID: {variant._id}
                  </h3>

                  <div className="mt-2">
                    <strong>Attributes:</strong>
                    <ul className="list-disc pl-6 mt-2">
                      {Object.entries(variant.atributes).length > 0 ? (
                        Object.entries(variant.atributes).map(
                          ([key, value]) => (
                            <li key={key} className="text-gray-700">
                              <strong>{key}:</strong>{" "}
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : value}
                            </li>
                          )
                        )
                      ) : (
                        <li className="text-gray-500">
                          No attributes available.
                        </li>
                      )}
                    </ul>
                  </div>

                  <label className="block mt-2">
                    <strong>Price:</strong>
                    <input
                      type="number"
                      name="price"
                      value={variant.price} // Directly access variant price
                      onChange={(e) => handleChange(e, variant._id)}
                      className="ml-2 p-1 border border-gray-400 rounded"
                    />
                  </label>
                  <label className="block mt-2">
                    <strong>Stock Quantity:</strong>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={variant.stock_quantity} // Directly access variant stock_quantity
                      onChange={(e) => handleChange(e, variant._id)}
                      className="ml-2 p-1 border border-gray-400 rounded"
                    />
                  </label>
                  <div className="mt-2">
                    <strong>Main Image:</strong>
                    {variant.mainImage && (
                      <img
                        src={variant.mainImage}
                        alt={variant.name}
                        className="mt-2 w-24 h-auto border border-gray-300 rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMainImageUpload(e, variant._id)}
                      className="mt-2 border border-gray-400 rounded p-1"
                    />
                  </div>

                  <div className="mt-4">
                    <strong>Additional Images:</strong>
                    <div className="mt-2">
                      {variant.images.length > 0 ? (
                        variant.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Additional ${index}`}
                            className="mt-2 w-24 h-auto border border-gray-300 rounded"
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No additional images uploaded.
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        handleAdditionalImageUpload(e, variant._id)
                      }
                      className="mt-2 border border-gray-400 rounded p-1"
                    />
                  </div>

                  <button
                    onClick={() => handleUpdate(variant._id)}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Update Variant
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No variants available for this product.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantPage;
