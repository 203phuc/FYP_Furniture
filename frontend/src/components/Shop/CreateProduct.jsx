import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/slices/productApiSlice";

const CreateProductPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [createProduct, { isLoading, isError, isSuccess, error }] =
    useCreateProductMutation();
  const shopId = userInfo._id; // Assuming userInfo._id is the shop ID
  const shop = {
    _id: shopId,
    name: userInfo.shopName,
  };

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    department: "",
    collection: "",
    type: "",
    tags: [],
  });

  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [colorImage, setColorImage] = useState(null); // For color image
  const [materials, setMaterials] = useState([]);
  const [materialInput, setMaterialInput] = useState("");
  const [dimensions, setDimensions] = useState({});
  const [customOptions, setCustomOptions] = useState([]);
  const [newMeasure, setNewMeasure] = useState("");
  const [newValue, setNewValue] = useState("");
  const [optionName, setOptionName] = useState(""); // State for option name
  const [values, setValues] = useState([]); // State for option values
  const [showForm, setShowForm] = useState(false); // State to toggle the option form
  const [materialImage, setMaterialImage] = useState(null); // For material image

  const [isModalOpen, setIsModalOpen] = useState(false);
  const addMeasureValuePair = () => {
    if (!newMeasure || !newValue) return; // Prevent adding empty keys
    setDimensions((prevObject) => ({
      ...prevObject,
      [newMeasure]: newValue, // Add new key-value pair
    }));

    // Clear input fields after adding
    setNewMeasure("");
    setNewValue("");
  };
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleColorInputChange = (e) => {
    setColorInput(e.target.value);
  };

  const handleColorImageChange = (e) => {
    const file = e.target.files[0];
    setColorImage(file);
  };

  const handleAddColor = async () => {
    const color = colorInput.trim();
    if (color) {
      let imageBase64 = "";
      if (colorImage) {
        try {
          imageBase64 = await convertToBase64(colorImage); // Convert image to base64
        } catch (error) {
          toast.error("Failed to upload color image.");
          return;
        }
      }

      setColors((prevColors) => [
        ...prevColors,
        { value: color, image: imageBase64 },
      ]);
      toast.success(`Added color: ${color}`);
    } else {
      toast.error("Please enter a valid color.");
    }
  };

  const handleMaterialInputChange = (e) => {
    setMaterialInput(e.target.value);
  };

  const handleMaterialImageChange = (e) => {
    const file = e.target.files[0];
    setMaterialImage(file);
  };

  const handleAddMaterial = async () => {
    const material = materialInput.trim();
    if (material) {
      let imageBase64 = "";
      if (materialImage) {
        try {
          imageBase64 = await convertToBase64(materialImage); // Convert image to base64
        } catch (error) {
          toast.error("Failed to upload material image.");
          return;
        }
      }

      setMaterials((prevMaterials) => [
        ...prevMaterials,
        { value: material, image: imageBase64 },
      ]);
      toast.success(`Added material: ${material}`);
    } else {
      toast.error("Please enter a valid material.");
    }
  };
  const handleAddValue = () => {
    setValues([...values, { value: "", image: "" }]); // Add a new empty value
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...values];
    newValues[index][field] = value;
    setValues(newValues);
  };

  const handleRemoveValue = (index) => {
    const newValues = values.filter((_, i) => i !== index); // Remove value at specified index
    setValues(newValues);
  };

  const handleOpSubmit = () => {
    setCustomOptions((prevOptions) => [
      ...prevOptions,
      { name: optionName, values: values },
    ]);

    console.log("Submitted option:", customOptions);
    // Here you can handle the submission logic (e.g., sending to an API)
  };
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0]; // Get the uploaded file
    const reader = new FileReader(); // Create a FileReader to read the file

    reader.onloadend = () => {
      // Set the image state as the base64 string
      handleValueChange(index, "image", reader.result);
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      colors.length === 0 &&
      materials.length === 0 &&
      Object.keys(dimensions).length === 0 &&
      customOptions.length === 0
    ) {
      toast.error("Please add at least one attribute!");
      return;
    }

    // Combine attributes into options structure following the schema
    const options = [
      {
        name: "Color",
        values: colors,
      },
      {
        name: "Material",
        values: materials,
      },
      {
        name: "Dimensions", // Add dimensions as an option
        values: [
          {
            value: dimensions,
            image: "",
          },
        ],
      },
      ...customOptions, // Include any custom options added by the user
    ];

    try {
      // Send the product data with options to the server
      await createProduct({ ...productData, shopId, shop, options }).unwrap();

      // Reset form and state after successful product creation
      setProductData({
        name: "",
        description: "",
        department: "",
        collection: "",
        type: "",
        tags: [],
      });
      setColors([]);
      setColorInput("");
      setMaterials([]);
      setMaterialInput("");
      setDimensions({}); // Reset dimensions object
      setCustomOptions([]);
      setNewMeasure("");
      setNewValue("");
      setOptionName("");
      setValues([]);
      toast.success("Product created successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={openModal} className="space-y-4">
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
        <select
          name="department"
          value={productData.department}
          onChange={handleProductChange}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Department</option>
          <option value="Living">Living</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Dining">Dining</option>
          <option value="Office">Office</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Lighting">Lighting</option>
          <option value="Decor">Decor</option>
          <option value="Rug">Rug</option>
        </select>
        <input
          type="text"
          name="collection"
          value={productData.collection}
          onChange={handleProductChange}
          placeholder="Collection"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="type"
          value={productData.type}
          onChange={handleProductChange}
          placeholder="Type"
          className="border p-2 rounded w-full"
        />

        {/* Color Input */}
        <div>
          <input
            type="text"
            value={colorInput}
            onChange={handleColorInputChange}
            placeholder="Add Color"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleColorImageChange}
          />
          <button type="button" onClick={handleAddColor}>
            Add Color
          </button>
          <ul>
            {colors.map((color, index) => (
              <li key={index}>
                {color.value}
                {color.image && (
                  <img src={color.image} alt={color.value} width="50" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Material Input */}
        <div>
          <input
            type="text"
            value={materialInput}
            onChange={handleMaterialInputChange}
            placeholder="Add Material"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleMaterialImageChange}
          />
          <button type="button" onClick={handleAddMaterial}>
            Add Material
          </button>
          <ul>
            {materials.map((material, index) => (
              <li key={index}>
                {material.value}
                {material.image && (
                  <img src={material.image} alt={material.value} width="50" />
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Dimension Fields */}
        <div>
          <h3 className="font-bold">Dimensions:</h3>
          <h3>add Dimension</h3>
          <input
            type="text"
            placeholder="New Key"
            value={newMeasure}
            onChange={(e) => setNewMeasure(e.target.value)}
            className="border p-2 rounded w-1/3 mr-2"
          />
          <input
            type="text"
            placeholder="New Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button type="button" onClick={addMeasureValuePair}>
            Add Key-Value Pair
          </button>
          <h4>Current Object State:</h4>
          <pre>{JSON.stringify(dimensions, null, 2)}</pre>
        </div>

        <div>
          {showForm ? (
            <div>
              <h2>Add Option</h2>
              <input
                type="text"
                placeholder="Option Name"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                required
              />
              {values.map((item, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="Value"
                    value={item.value}
                    onChange={(e) =>
                      handleValueChange(index, "value", e.target.value)
                    }
                    required
                  />
                  <input
                    type="file"
                    accept="image/*" // Accept image files
                    onChange={(e) => handleImageUpload(index, e)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddValue}>
                Add Value
              </button>
              <button type="button" onClick={() => handleOpSubmit()}>
                Submit Option
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowForm(true)}>
              Add Option
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded mt-4"
          disabled={isLoading}
        >
          Create Product
        </button>
      </form>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Product Creation</h2>
            <p>Are you sure you want to create this product?</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white p-2 rounded"
              >
                Yes, Create
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProductPage;
