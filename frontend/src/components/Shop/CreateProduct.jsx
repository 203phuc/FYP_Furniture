import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const CreateProduct = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [roomtype, setRoomtype] = useState("");
  const [price, setPrice] = useState();
  const [stock_quantity, setStockQuantity] = useState();
  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
    depth: "",
  });
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {}, [dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [
            ...old,
            { public_id: file.name, url: reader.result },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.set("images", JSON.stringify(image));
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("roomtype", roomtype);
    newForm.append("price", price);
    newForm.append("stock_quantity", stock_quantity);
    newForm.append("dimensions", JSON.stringify(dimensions));
    newForm.append("material", material);
    newForm.append("color", color);
    newForm.append("weight", weight);
    newForm.append("shopId", userInfo._id);
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        {/* Name */}
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            className="mt-2 block w-full h-[35px] border rounded-[3px]"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
            required
          />
        </div>
        <br />
        {/* Description */}
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="8"
            value={description}
            className="mt-2 block w-full border rounded-[3px]"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
            required
          />
        </div>
        <br />
        {/* Category */}
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            required
          >
            <option value="">Choose a category</option>
            <option value="Furniture">Furniture</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
          </select>
        </div>
        <br />
        {/* Room Type */}
        <div>
          <label className="pb-2">
            Room Type <span className="text-red-500">*</span>
          </label>
          <select
            value={roomtype}
            onChange={(e) => setRoomtype(e.target.value)}
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            required
          >
            <option value="">Choose a room type</option>
            <option value="Living Room">Living Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Office">Office</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>
        <br />
        {/* Price */}
        <div>
          <label className="pb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={price}
            className="mt-2 block w-full h-[35px] border rounded-[3px]"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            required
          />
        </div>
        <br />
        {/* Stock Quantity */}
        <div>
          <label className="pb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={stock_quantity}
            className="mt-2 block w-full h-[35px] border rounded-[3px]"
            onChange={(e) => setStockQuantity(e.target.value)}
            placeholder="Enter stock quantity"
            required
          />
        </div>
        <br />
        {/* Dimensions */}
        <div>
          <label className="pb-2">Dimensions (Width x Height x Depth)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              className="mt-2 block w-full h-[35px] border rounded-[3px]"
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              className="mt-2 block w-full h-[35px] border rounded-[3px]"
              onChange={(e) =>
                setDimensions({ ...dimensions, height: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Depth"
              value={dimensions.depth}
              className="mt-2 block w-full h-[35px] border rounded-[3px]"
              onChange={(e) =>
                setDimensions({ ...dimensions, depth: e.target.value })
              }
            />
          </div>
        </div>
        <br />
        {/* Material */}
        <div>
          <label className="pb-2">Material</label>
          <input
            type="text"
            value={material}
            className="mt-2 block w-full h-[35px] border rounded-[3px]"
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Enter material type"
          />
        </div>
        <br />
        {/* Color */}
        <div>
          <label className="pb-2">Color</label>
          <input
            type="text"
            value={color}
            className="mt-2 block w-full h-[35px] border rounded-[3px]"
            onChange={(e) => setColor(e.target.value)}
            placeholder="Enter product color"
          />
        </div>
        <br />
        {/* Weight */}
        <div>
          <label className="pb-2">Weight</label>
          <input
            type="number"
            value={weight}
            className="mt-2 block w-full h-[35px] border rounded-[3px]"
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter product weight in kg"
          />
        </div>
        <br />
        {/* Images */}
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mt-2 block w-full border rounded-[3px] bg-white"
          />
        </div>
        <br />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-[3px] flex items-center justify-center gap-2 hover:bg-blue-600"
        >
          <AiOutlinePlusCircle /> Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
