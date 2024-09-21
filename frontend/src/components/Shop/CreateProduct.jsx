import React, { useState } from "react";
import { useCreateProductMutation } from "../../Redux/slices/productSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../Redux/slices/authSlice";

const CreateProductPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [createProduct, { isLoading, isError, isSuccess, error }] =
    useCreateProductMutation();
  const shopId = userInfo._id;
  console.log(shopId);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    roomtype: "",
    image: { public_id: "", url: "" },
    variants: [],
    shopId: shopId,
  });

  const [currentVariant, setCurrentVariant] = useState({
    dimensions: { width: "", height: "", depth: "" },
    weight: "",
    price: "",
    stock_quantity: "",
    colors: [{ color: "", images: [{ public_id: "", url: "" }] }],
    material: "",
  });

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split(".");
    if (subfield) {
      setCurrentVariant({
        ...currentVariant,
        [field]: { ...currentVariant[field], [subfield]: value },
      });
    } else {
      setCurrentVariant({ ...currentVariant, [name]: value });
    }
  };

  const handleColorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedColors = [...currentVariant.colors];
    updatedColors[index] = { ...updatedColors[index], [name]: value };
    setCurrentVariant({ ...currentVariant, colors: updatedColors });
  };

  const handleImageChange = (colorIndex, e) => {
    const { name, value } = e.target;
    const updatedColors = [...currentVariant.colors];
    updatedColors[colorIndex].images = [
      { ...updatedColors[colorIndex].images[0], [name]: value },
    ];
    setCurrentVariant({ ...currentVariant, colors: updatedColors });
  };

  const addVariant = () => {
    setProductData({
      ...productData,
      variants: [...productData.variants, currentVariant],
    });
    setCurrentVariant({
      dimensions: { width: "", height: "", depth: "" },
      weight: "",
      price: "",
      stock_quantity: "",
      colors: [{ color: "", images: [{ public_id: "", url: "" }] }],
      material: "",
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData((prevData) => ({
        ...prevData,
        image: { public_id: "", url: reader.result },
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(productData, shopId).unwrap();
      setProductData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        category: "",
        roomtype: "",
        image: { public_id: "", url: "" },
        variants: [],
      });
    } catch (err) {
      // Handle error
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
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

      {/* Variant Section */}
      <h3 className="font-semibold">Variant</h3>
      <input
        type="number"
        name="dimensions.width"
        value={currentVariant.dimensions.width}
        onChange={handleVariantChange}
        placeholder="Width"
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        name="dimensions.height"
        value={currentVariant.dimensions.height}
        onChange={handleVariantChange}
        placeholder="Height"
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        name="dimensions.depth"
        value={currentVariant.dimensions.depth}
        onChange={handleVariantChange}
        placeholder="Depth"
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        name="weight"
        value={currentVariant.weight}
        onChange={handleVariantChange}
        placeholder="Weight"
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        name="price"
        value={currentVariant.price}
        onChange={handleVariantChange}
        placeholder="Variant Price"
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        name="stock_quantity"
        value={currentVariant.stock_quantity}
        onChange={handleVariantChange}
        placeholder="Stock Quantity"
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        name="material"
        value={currentVariant.material}
        onChange={handleVariantChange}
        placeholder="Material"
        className="border p-2 rounded w-full"
      />

      {/* Color Section */}
      <h4 className="font-semibold">Colors</h4>
      {currentVariant.colors.map((color, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            name="color"
            value={color.color}
            onChange={(e) => handleColorChange(index, e)}
            placeholder="Color"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="public_id"
            value={color.images[0].public_id}
            onChange={(e) => handleImageChange(index, e)}
            placeholder="Image Public ID"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="url"
            value={color.images[0].url}
            onChange={(e) => handleImageChange(index, e)}
            placeholder="Image URL"
            className="border p-2 rounded w-full"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addVariant}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Variant
      </button>
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
        <p className="text-red-500">Error creating product: {error.message}</p>
      )}
    </form>
  );
};

export default CreateProductPage;
