import React, { useState } from "react";
import { useCreateProductMutation } from "../../Redux/slices/productSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CreateProductPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [createProduct, { isLoading, isError, isSuccess, error }] =
    useCreateProductMutation();
  const shopId = userInfo._id;

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    roomtype: "",
    color: "",
    dimensions: {
      width: "",
      height: "",
      depth: "",
    },
    weight: "",
  });

  const [mainImage, setMainImage] = useState(null);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      dimensions: {
        ...prevData.dimensions,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) {
      toast.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    // Append product fields to formData
    formData.append("shopId", shopId);

    // Logging each key-value pair being added to formData for debugging
    Object.keys(productData).forEach((key) => {
      if (key === "dimensions") {
        Object.keys(productData.dimensions).forEach((dimKey) => {
          formData.append(
            `dimensions[${dimKey}]`,
            productData.dimensions[dimKey]
          );
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    // Append main image to formData
    formData.append("mainImage", mainImage);

    // Log the individual entries of the FormData object
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      await createProduct(formData).unwrap();
      // Resetting form data
      setProductData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        roomtype: "",
        color: "",
        dimensions: {
          width: "",
          height: "",
          depth: "",
        },
        weight: "",
      });
      setMainImage(null); // Reset image after submission
      toast.success("Product created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Fields */}
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleProductChange}
          placeholder="Product Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="description"
          value={productData.description}
          onChange={handleProductChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleProductChange}
          placeholder="Price"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="stock_quantity"
          value={productData.stock_quantity}
          onChange={handleProductChange}
          placeholder="Stock Quantity"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="color"
          value={productData.color}
          onChange={handleProductChange}
          placeholder="Color"
          className="border p-2 rounded w-full"
          required
        />
        <div className="flex space-x-2">
          <input
            type="number"
            name="width"
            value={productData.dimensions.width}
            onChange={handleDimensionChange}
            placeholder="Width"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="height"
            value={productData.dimensions.height}
            onChange={handleDimensionChange}
            placeholder="Height"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="depth"
            value={productData.dimensions.depth}
            onChange={handleDimensionChange}
            placeholder="Depth"
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <input
          type="number"
          name="weight"
          value={productData.weight}
          onChange={handleProductChange}
          placeholder="Weight"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
          required
        />
        <select
          name="category"
          value={productData.category}
          onChange={handleProductChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Category</option>
          <option value="Furniture">Furniture</option>
          <option value="Electronics">Electronics</option>
          <option value="Appliances">Appliances</option>
        </select>
        <select
          name="roomtype"
          value={productData.roomtype}
          onChange={handleProductChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Room Type</option>
          <option value="Living Room">Living Room</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Office">Office</option>
          <option value="Outdoor">Outdoor</option>
        </select>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 text-white p-2 rounded"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
        {isSuccess && (
          <p className="text-green-500">Product created successfully!</p>
        )}
        {isError && (
          <p className="text-red-500">
            Error creating product: {error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateProductPage;
