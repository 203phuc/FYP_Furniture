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
    mainImage: null,
    shopId: shopId, // Ensure shopId is included
  });

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData((prevData) => ({
        ...prevData,
        mainImage: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(productData).unwrap(); // Only send product data
      setProductData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        roomtype: "",
        mainImage: null,
        shopId: shopId,
      });
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
        />
        <input
          type="text"
          name="description"
          value={productData.description}
          onChange={handleProductChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleProductChange}
          placeholder="Price"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="stock_quantity"
          value={productData.stock_quantity}
          onChange={handleProductChange}
          placeholder="Stock Quantity"
          className="border p-2 rounded w-full"
        />

        {/* Image Upload */}
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />

        <select
          name="category"
          value={productData.category}
          onChange={handleProductChange}
          className="border p-2 rounded w-full"
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
