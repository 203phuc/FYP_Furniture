import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "../../redux/slices/productApiSlice";

export default function CreateProductPage() {
  const { userInfo } = useSelector((state) => state.auth);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const shopId = userInfo._id;
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
  const [colorImage, setColorImage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [dimensionData, setDimensionData] = useState([]);
  const [materialInput, setMaterialInput] = useState("");
  const [dimensions, setDimensions] = useState({});
  const [customOptions, setCustomOptions] = useState([]);
  const [newMeasure, setNewMeasure] = useState("");
  const [newValue, setNewValue] = useState("");
  const [optionName, setOptionName] = useState("");
  const [values, setValues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [materialImage, setMaterialImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          imageBase64 = await convertToBase64(colorImage);
        } catch (error) {
          toast.error("Failed to upload color image.");
          return;
        }
      }
      setColors((prevColors) => [
        ...prevColors,
        { value: color, image: imageBase64 },
      ]);
      setColorInput("");
      setColorImage(null);
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
          imageBase64 = await convertToBase64(materialImage);
        } catch (error) {
          toast.error("Failed to upload material image.");
          return;
        }
      }
      setMaterials((prevMaterials) => [
        ...prevMaterials,
        { value: material, image: imageBase64 },
      ]);
      setMaterialInput("");
      setMaterialImage(null);
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
    const newDimensionData = [...dimensionData];
    delete newDimensionData[index].value[key];
    if (Object.keys(newDimensionData[index].value).length === 0) {
      newDimensionData.splice(index, 1);
    }
    setDimensionData(newDimensionData);
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

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      handleValueChange(index, "image", reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const options = [];

    if (colors.length > 0) {
      options.push({ name: "Color", values: colors });
    }

    if (materials.length > 0) {
      options.push({ name: "Material", values: materials });
    }

    if (dimensionData.length > 0) {
      options.push({ name: "Dimensions", values: dimensionData });
    }

    options.push(...customOptions);

    if (options.length === 0) {
      toast.error("Please add at least one attribute!");
      return;
    }

    try {
      await createProduct({ ...productData, shopId, shop, options }).unwrap();
      setProductData({
        name: "",
        description: "",
        department: "",
        collection: "",
        type: "",
        tags: [],
      });
      setColors([]);
      setMaterials([]);
      setDimensionData([]);
      setCustomOptions([]);
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Typography variant="h4" className="font-bold text-gray-800">
        Create Product
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
              label="Collection"
              name="collection"
              value={productData.collection}
              onChange={handleProductChange}
              required
            />
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
              <input
                type="file"
                accept="image/*"
                onChange={handleColorImageChange}
                className="hidden"
                id="color-image-upload"
              />
              <label htmlFor="color-image-upload">
                <Button component="span" variant="outlined">
                  Upload Image
                </Button>
              </label>
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
                    {color.image && (
                      <img
                        src={color.image}
                        alt={color.value}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleMaterialImageChange}
                className="hidden"
                id="material-image-upload"
              />
              <label htmlFor="material-image-upload">
                <Button component="span" variant="outlined">
                  Upload Image
                </Button>
              </label>
              <Button onClick={handleAddMaterial} startIcon={<AddIcon />}>
                Add
              </Button>
            </div>
            <Grid container spacing={2}>
              {materials.map((material, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{material.value}</span>
                    {material.image && (
                      <img
                        src={material.image}
                        alt={material.value}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
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
                type="number"
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
        {/* Custom Options */}
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
                      onClick={() => handleRemoveValue(index)}
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
          disabled={isLoading}
        >
          Create Product
        </Button>
      </form>

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Confirm Product Creation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to create this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Yes, Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
