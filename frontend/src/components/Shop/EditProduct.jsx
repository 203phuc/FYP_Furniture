import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../redux/slices/productApiSlice";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: product, 
    isLoading,
    isError,
    error,
  } = useGetProductDetailsQuery(id);
  console.log(product);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    department: "",
    collection: "",
    type: "",
    tags: [],
  });

  const [colors, setColors] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [dimensionData, setDimensionData] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);

  const [colorInput, setColorInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [newMeasure, setNewMeasure] = useState("");
  const [newValue, setNewValue] = useState("");
  const [dimensions, setDimensions] = useState({});
  const [optionName, setOptionName] = useState("");
  const [values, setValues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description,
        department: product.department,
        type: product.type,
        tags: product.tags,
      });

      const productOptions = product.options || [];
      setColors(
        productOptions.find((opt) => opt.name === "Color")?.values || []
      );
      setMaterials(
        productOptions.find((opt) => opt.name === "Material")?.values || []
      );
      setDimensionData(
        productOptions.find((opt) => opt.name === "Dimensions")?.values || []
      );
      setCustomOptions(
        productOptions.filter(
          (opt) => !["Color", "Material", "Dimensions"].includes(opt.name)
        )
      );
    }
  }, [product]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const removeDimensionSet = (setIndex) => {
    setDimensionData((prevData) =>
      prevData.filter((_, index) => index !== setIndex)
    );
  };

  const handleColorInputChange = (e) => {
    setColorInput(e.target.value);
  };

  const handleAddColor = () => {
    const color = colorInput.trim();
    if (color) {
      setColors((prevColors) => [...prevColors, { value: color, image: "" }]);
      setColorInput("");
      toast.success(`Added color: ${color}`);
    } else {
      toast.error("Please enter a valid color.");
    }
  };

  const handleMaterialInputChange = (e) => {
    setMaterialInput(e.target.value);
  };

  const handleAddMaterial = () => {
    const material = materialInput.trim();
    if (material) {
      setMaterials((prevMaterials) => [
        ...prevMaterials,
        { value: material, image: "" },
      ]);
      setMaterialInput("");
      toast.success(`Added material: ${material}`);
    } else {
      toast.error("Please enter a valid material.");
    }
  };

  const addMeasureValuePair = () => {
    if (!newMeasure || !newValue) return;
    setDimensions((prevObject) => ({
      ...prevObject,
      [newMeasure]: newValue,
    }));
    setNewMeasure("");
    setNewValue("");
  };

  const handleAddDimensionData = () => {
    if (Object.keys(dimensions).length === 0) {
      toast.error("Please add at least one dimension before saving.");
      return;
    }
    setDimensionData((prevData) => [
      ...prevData,
      { value: dimensions, image: "" },
    ]);
    setDimensions({});
    toast.success("Dimension set added successfully.");
  };

  const removeDimension = (index, key) => {
    try {
      // Create a new copy of the dimensionData
      const newDimensionData = [...dimensionData];

      // Create a new value object excluding the key to be removed
      const { [key]: removed, ...newValue } = newDimensionData[index].value;

      // Update the dimension data with the new value object
      newDimensionData[index] = {
        ...newDimensionData[index],
        value: newValue,
      };

      // Check if the value object is empty and remove the dimension set if it is
      if (Object.keys(newValue).length === 0) {
        newDimensionData.splice(index, 1);
      }

      // Update the state with the new dimension data
      setDimensionData(newDimensionData);
    } catch (err) {
      console.log(err);
    }
  };

  const removeCurrentDimension = (key) => {
    const newDimensions = { ...dimensions };
    delete newDimensions[key];
    setDimensions(newDimensions);
  };

  const handleAddValue = () => {
    setValues([...values, { value: "", image: "" }]);
  };

  const handleValueChange = (index, field, value) => {
    const newValues = [...values];
    newValues[index][field] = value;
    setValues(newValues);
  };

  const handleRemoveValue = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    setValues(newValues);
  };

  //option related functions
  const handleRemoveValueFromOption = (optionIndex, valueIndex) => {
    // Create a copy of the customOptions state
    const newCustomOptions = customOptions.map((option, index) => {
      // Create a copy of the values array for the specific option
      if (index === optionIndex) {
        return {
          ...option,
          values: option.values.filter((_, vIndex) => vIndex !== valueIndex), // Remove the value at the specified index
        };
      }
      return option; // Return the unchanged option
    });

    // Update the state with the new custom options
    setCustomOptions(newCustomOptions);
  };

  const handleRemoveOption = (optionIndex) => {
    const newCustomOptions = [...customOptions];
    newCustomOptions.splice(optionIndex, 1);
    setCustomOptions(newCustomOptions);
  };

  const handleOpSubmit = () => {
    if (!optionName || values.length === 0) {
      toast.error("Please provide an option name and at least one value.");
      return;
    }
    setCustomOptions((prevOptions) => [
      ...prevOptions,
      { name: optionName, values: values },
    ]);
    setOptionName("");
    setValues([]);
    setShowForm(false);
    toast.success("Custom option added successfully.");
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      colors.length === 0 &&
      materials.length === 0 &&
      dimensionData.length === 0 &&
      customOptions.length === 0
    ) {
      toast.error("Please add at least one attribute!");
      return;
    }
    const options = [
      { name: "Color", values: colors },
      { name: "Material", values: materials },
      { name: "Dimensions", values: dimensionData },
      ...customOptions,
    ];
    try {
      await updateProduct({
        id,
        ...productData,
        shopId: userInfo._id,
        shop: { _id: userInfo._id, name: userInfo.shopName },
        options,
      }).unwrap();
      toast.success("Product updated successfully!");
      navigate("/all-products");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Typography color="error">
        Error: {error?.data?.message || error.error}
      </Typography>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Typography variant="h4" className="font-bold text-gray-800">
        Edit Product
      </Typography>
      <form onSubmit={openModal} className="space-y-6">
        <Card>
          <CardHeader title="Product Details" />
          <CardContent className="space-y-4">
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={productData.name}
              onChange={handleProductChange}
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={productData.description}
              onChange={handleProductChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={productData.department}
                onChange={handleProductChange}
                label="Department"
              >
                {[
                  "Living",
                  "Bedroom",
                  "Dining",
                  "Office",
                  "Outdoor",
                  "Lighting",
                  "Decor",
                  "Rug",
                ].map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Type"
              name="type"
              value={productData.type}
              onChange={handleProductChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Colors" />
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <TextField
                fullWidth
                label="Add Color"
                value={colorInput}
                onChange={handleColorInputChange}
              />
              <Button onClick={handleAddColor} startIcon={<AddIcon />}>
                Add
              </Button>
            </div>
            <Grid container spacing={2}>
              {colors.map((color, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <span>{color.value}</span>
                    </div>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setColors(colors.filter((_, i) => i !== index))
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Materials" />
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <TextField
                fullWidth
                label="Add Material"
                value={materialInput}
                onChange={handleMaterialInputChange}
              />
              <Button onClick={handleAddMaterial} startIcon={<AddIcon />}>
                Add
              </Button>
            </div>
            <Grid container spacing={2}>
              {materials.map((material, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{material.value}</span>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setMaterials(materials.filter((_, i) => i !== index))
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
        {/** Dimensions */}
        <Card>
          <CardHeader title="Dimensions" />
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <TextField
                label="Measure (e.g., Length)"
                value={newMeasure}
                onChange={(e) => setNewMeasure(e.target.value)}
                className="flex-grow"
              />
              <TextField
                label="Value (e.g., 10 cm)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={addMeasureValuePair} startIcon={<AddIcon />}>
                Add
              </Button>
            </div>
            <Card className="bg-gray-50">
              <CardHeader
                title="Current Dimensions"
                titleTypographyProps={{ variant: "h6" }}
              />
              <CardContent className="p-4 space-y-2">
                {Object.entries(dimensions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Typography variant="body2">
                      <span className="font-medium">{key}:</span> {value}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeCurrentDimension(key)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
                {Object.keys(dimensions).length === 0 && (
                  <Typography variant="body2" className="text-gray-500 italic">
                    No dimensions added yet
                  </Typography>
                )}
              </CardContent>
            </Card>
            <Button
              fullWidth
              onClick={handleAddDimensionData}
              variant="contained"
            >
              Save Dimension Set
            </Button>
            <Grid container spacing={2}>
              {dimensionData.map((dimSet, setIndex) => (
                <Grid item xs={12} sm={6} md={4} key={setIndex}>
                  <Card className="bg-gray-50">
                    <CardHeader
                      title={`Dimension Set ${setIndex + 1}`}
                      titleTypographyProps={{ variant: "h6" }}
                      action={
                        <IconButton
                          size="small"
                          onClick={() => removeDimensionSet(setIndex)}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    />
                    <CardContent className="p-4 space-y-2">
                      {Object.entries(dimSet.value).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <Typography variant="body2">
                            <span className="font-medium">{key}:</span> {value}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeDimension(setIndex, key)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
        {/** Custom Options */}
        <Card>
          <CardHeader title="Custom Options" />
          <CardContent className="space-y-4">
            {showForm ? (
              <div className="space-y-4">
                <TextField
                  fullWidth
                  label="Option Name"
                  value={optionName}
                  onChange={(e) => setOptionName(e.target.value)}
                  required
                />
                {values.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <TextField
                      fullWidth
                      label="Value"
                      value={item.value}
                      onChange={(e) =>
                        handleValueChange(index, "value", e.target.value)
                      }
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                      id={`custom-option-image-${index}`}
                    />
                    <label htmlFor={`custom-option-image-${index}`}>
                      <Button component="span" variant="outlined">
                        Upload Image
                      </Button>
                    </label>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveValue(index)} // This removes a value
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Button onClick={handleAddValue} startIcon={<AddIcon />}>
                    Add Value
                  </Button>
                  <Button onClick={handleOpSubmit} variant="contained">
                    Submit Option
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowForm(true)} variant="outlined">
                Add Custom Option
              </Button>
            )}
            <Grid container spacing={2}>
              {customOptions.map((option, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card className="bg-gray-50">
                    <CardHeader
                      title={option.name}
                      titleTypographyProps={{ variant: "h6" }}
                      action={
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveOption(index)}
                        >
                          {" "}
                          // This removes the entire option
                          <CloseIcon />
                        </IconButton>
                      }
                    />
                    <CardContent className="p-4 space-y-2">
                      {option.values.map((value, vIndex) => (
                        <div
                          key={vIndex}
                          className="flex items-center justify-between"
                        >
                          <span>{value.value}</span>
                          {value.image && (
                            <img
                              src={value.image}
                              alt={value.value}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleRemoveValueFromOption(index, vIndex)
                            } // Remove value from specific option
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isUpdating}
        >
          Update Product
        </Button>
      </form>

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Confirm Product Update</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to update this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Yes, Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
