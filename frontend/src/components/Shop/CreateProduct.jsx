import React, { useState } from "react";
import { useCreateProductMutation } from "../../Redux/slices/productSlice";

const CreateProductPage = () => {
  const [createProduct, { isLoading, isError, isSuccess, error }] =
    useCreateProductMutation();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    roomtype: "",
    variants: [],
  });

  const [currentVariant, setCurrentVariant] = useState({
    dimensions: { width: "", height: "", depth: "" },
    weight: "",
    colors: [{ color: "", images: [] }],
    material: "",
  });

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant({ ...currentVariant, [name]: value });
  };

  const handleColorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedColors = [...currentVariant.colors];
    updatedColors[index] = { ...updatedColors[index], [name]: value };
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
      colors: [{ color: "", images: [] }],
      material: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(productData).unwrap();
      // Handle success (e.g., show a success message or redirect)
    } catch (err) {
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={productData.name}
        onChange={handleProductChange}
        placeholder="Product Name"
      />
      <input
        type="text"
        name="description"
        value={productData.description}
        onChange={handleProductChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleProductChange}
        placeholder="Price"
      />
      <input
        type="number"
        name="stock_quantity"
        value={productData.stock_quantity}
        onChange={handleProductChange}
        placeholder="Stock Quantity"
      />
      <select
        name="category"
        value={productData.category}
        onChange={handleProductChange}
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
      >
        <option value="">Select Room Type</option>
        <option value="Living Room">Living Room</option>
        <option value="Bedroom">Bedroom</option>
        <option value="Office">Office</option>
        <option value="Outdoor">Outdoor</option>
      </select>

      {/* Variant Section */}
      <h3>Variant</h3>
      <input
        type="number"
        name="dimensions.width"
        value={currentVariant.dimensions.width}
        onChange={handleVariantChange}
        placeholder="Width"
      />
      <input
        type="number"
        name="dimensions.height"
        value={currentVariant.dimensions.height}
        onChange={handleVariantChange}
        placeholder="Height"
      />
      <input
        type="number"
        name="dimensions.depth"
        value={currentVariant.dimensions.depth}
        onChange={handleVariantChange}
        placeholder="Depth"
      />
      <input
        type="number"
        name="weight"
        value={currentVariant.weight}
        onChange={handleVariantChange}
        placeholder="Weight"
      />
      <input
        type="text"
        name="material"
        value={currentVariant.material}
        onChange={handleVariantChange}
        placeholder="Material"
      />

      {/* Color Section */}
      <h4>Colors</h4>
      {currentVariant.colors.map((color, index) => (
        <div key={index}>
          <input
            type="text"
            name="color"
            value={color.color}
            onChange={(e) => handleColorChange(index, e)}
            placeholder="Color"
          />
          {/* Add functionality for images here */}
        </div>
      ))}
      <button type="button" onClick={addVariant}>
        Add Variant
      </button>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Product"}
      </button>
      {isSuccess && <p>Product created successfully!</p>}
      {isError && <p>Error creating product: {error.message}</p>}
    </form>
  );
};

export default CreateProductPage;
