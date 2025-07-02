import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To access route parameters
import { toast } from "react-toastify";
import Loader from "../../components/layout/Loader"; // Assuming you have a Loader component
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
        price: variant.price ?? 0,
        stockQuantity: variant.stockQuantity ?? 0,
        mainImage: variant.mainImage || "",
        attributes: variant.attributes || {},
        images: variant.images || [],
        threeDModel: variant.threeDModel || null, // Initialize as null instead of an empty string
        modelUrl: variant.threeDModel || "", // Make sure you have this field
      }));
      setEditableVariants(initializedVariants);
    }
  }, [variants]);

  const handleFileChange = (e, variantId) => {
    const file = e.target.files[0];
    if (file) {
      const modelUrl = URL.createObjectURL(file); // Generate URL for the uploaded file

      // Update the editableVariants state directly with the selected 3D model
      setEditableVariants((prev) =>
        prev.map((variant) =>
          variant._id === variantId
            ? { ...variant, threeDModel: file, url: modelUrl } // Set the file and its URL
            : variant
        )
      );
    }
  };

  const Model = ({ url }) => {
    console.log("url", url);
    const { scene, error, isLoading } = useGLTF(url);

    if (isLoading) {
      return <div>Loading model...</div>;
    }

    if (error) {
      return <div>Error loading GLTF model: {error.message}</div>;
    }

    return <primitive object={scene} />;
  };

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
    const formData = new FormData();
    const Id = variantDetails._id;
    console.log("three d model", variantDetails.threeDModel);

    // Append non-file data to FormData
    for (const key in variantDetails) {
      if (key === "threeDModel") continue; // Skip the 3D model as it's a file

      if (key === "attributes" && typeof variantDetails[key] === "object") {
        // Stringify attributes if it's an object
        formData.append(key, JSON.stringify(variantDetails[key]));
      } else {
        formData.append(key, variantDetails[key]);
      }
    }

    // Append the 3D model file if exists
    if (variantDetails.threeDModel) {
      formData.append("threeDModel", variantDetails.threeDModel); // File upload (not base64)
    }

    // Log formData entries for inspection
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    if (Id !== undefined) {
      try {
        console.log("variantDetails", variantDetails, Id);
        const response = await updateVariant(formData, Id).unwrap();
        console.log("data of variant after update: ", response);
        toast.success("Variant updated successfully!");
      } catch (error) {
        toast.error("Failed to update variant.");
      }
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

  // Handle 3D model upload and convert to base64 (if applicable) or direct file send

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

                  {/* Existing attributes and input fields for price and stock */}
                  <div className="mt-2">
                    <strong>Attributes:</strong>
                    <ul className="list-disc pl-6 mt-2">
                      {Object.entries(variant.attributes).length > 0 ? (
                        Object.entries(variant.attributes).map(
                          ([key, value]) => (
                            <li key={key} className="text-gray-700">
                              <label className="block font-bold">
                                {key}:
                                <input
                                  type="text"
                                  className="mt-1 w-full border  border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                  value={
                                    typeof value === "object"
                                      ? JSON.stringify(value)
                                      : value
                                  }
                                  readOnly
                                />
                              </label>
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

                  {/* Input fields for price and stock */}
                  <label className="block mt-2">
                    <strong>Price:</strong>
                    <input
                      type="number"
                      name="price"
                      value={variant.price}
                      onChange={(e) => handleChange(e, variant._id)}
                      className="ml-2 p-1 border border-gray-400 rounded"
                    />
                  </label>
                  <label className="block mt-2">
                    <strong>Stock Quantity:</strong>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={variant.stockQuantity}
                      onChange={(e) => handleChange(e, variant._id)}
                      className="ml-2 p-1 border border-gray-400 rounded"
                    />
                  </label>

                  {/* Main image upload */}
                  <div className="mt-2">
                    <strong>Main Image:</strong>
                    {variant.mainImage ? (
                      variant.mainImage.url ? (
                        <img
                          src={variant.mainImage.url}
                          alt={variant.name}
                          className="mt-2 w-24 h-auto border border-gray-300 rounded"
                        />
                      ) : (
                        <img
                          src={variant.mainImage}
                          alt={variant.name}
                          className="mt-2 w-24 h-auto border border-gray-300 rounded"
                        />
                      )
                    ) : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMainImageUpload(e, variant._id)}
                      className="mt-2 border border-gray-400 rounded p-1"
                    />
                  </div>

                  {/* Additional images upload */}
                  <div className="mt-4">
                    <strong>Additional Images:</strong>
                    <div className="mt-2">
                      {variant.images.length > 0 ? (
                        variant.images.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
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

                  {/* 3D model upload */}
                  <div className="mt-4">
                    <strong>3D Model (GLB/GLTF):</strong>
                    <div
                      style={{
                        width: "100%",
                        height: "300px",
                        border: "1px solid #ccc",
                      }}
                    >
                      {variant.threeDModel ? (
                        <Suspense fallback={<div>Loading model...</div>}>
                          <Canvas>
                            <ambientLight intensity={0.5} />
                            <Model
                              url={
                                variant.threeDModel instanceof File
                                  ? variant.url
                                  : variant.threeDModel.url
                              }
                            />
                            <pointLight position={[10, 10, 10]} />
                            <Environment preset="sunset" background />
                            <OrbitControls />
                          </Canvas>
                        </Suspense>
                      ) : (
                        <p>Upload a model to preview it.</p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => handleFileChange(e, variant._id)}
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
