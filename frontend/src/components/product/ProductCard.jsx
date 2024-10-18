import React, { useState } from "react";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import ProductDetailCard from "./ProductDetailCard.jsx";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle dropdown
  const [selectedColor, setSelectedColor] = useState(""); // State to track the selected color

  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart.cart); // Cart from Redux state

  const [syncCart] = useSyncCartMutation(); // Mutation for syncing cart with the backend

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Safely get the color option if it exists
  const colorOption = data?.options?.find((option) => option.name === "Color");

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Safely find the variant based on selected color
  const selectedVariant =
    data?.variants?.find((variant) =>
      variant?.options?.find(
        (opt) => opt.name === "Color" && opt.value === selectedColor
      )
    ) || data?.variants?.[0]; // Fallback to the first variant if no color is selected

  const addToCartHandler = () => {
    if (!userInfo) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    const isItemExists = cart.items.find(
      (item) => item.product_id === data._id
    );
    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }

    if (data.stock_quantity < 1) {
      toast.error("Product stock limited!");
      return;
    }

    dispatch(
      addToCart({
        product_id: data._id,
        price: data.discountPrice || data.price,
        quantity: 1,
      })
    );
    toast.success("Item added to cart locally!");

    syncCart(cart)
      .then(() => {
        toast.success("Cart synced with server.");
      })
      .catch(() => {
        toast.error("Failed to sync cart with server.");
      });
  };

  return (
    <div className="w-full bg-white overflow-hidden relative">
      {/* Aspect ratio container for maintaining box size */}
      <div className="aspect-w-4 aspect-h-3 w-full">
        <Link to={`/product/${data._id}`}>
          <img
            src={selectedVariant?.mainImage?.url}
            alt={data?.name || "Product Image"}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <div className="p-4">
        <Link to={`/shop/preview/${data?.shop?._id}`}>
          <h5 className="text-lg font-Roboto text-gray-800">
            {data?.shop?.name}
          </h5>
        </Link>

        <Link to={`/product/${data._id}`}>
          <p className="text-md font-Roboto text-gray-600 ">
            {data?.name?.length > 40
              ? `${data?.name.slice(0, 40)}...`
              : data?.name}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <h5 className="text-lg font-Roboto-thin text-gray-900">
                {selectedVariant?.price || data?.price}$
              </h5>
              {data?.discountPrice && (
                <span className="ml-2 text-gray-500 line-through">
                  {data?.variants?.[0]?.price}$
                </span>
              )}
            </div>
            <span className="text-sm text-green-600">
              {data?.sold_out || 0} sold
            </span>
          </div>
        </Link>
      </div>

      {colorOption && (
        <div className="p-2 text-sm text-gray-600">
          <span>Color: </span>
          {colorOption?.values?.map((color) => (
            <button
              key={color._id.$oid}
              className={`ml-1 p-1 border rounded ${
                selectedColor === color.value
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleColorSelect(color.value)}
            >
              {color.value}
            </button>
          ))}
        </div>
      )}

      <div className="absolute left-4 top-4">
        <button
          className=" text-white p-2 rounded-full"
          onClick={toggleDropdown}
        >
          ⋮
        </button>

        <div
          className={`absolute top-10 left-0 z-10 w-10 flex flex-col items-center space-y-2 transition-transform duration-500 ease-in-out ${
            dropdownOpen
              ? "transform translate-y-0 opacity-100"
              : "transform -translate-y-4 opacity-0"
          }`}
        >
          <Link
            onClick={() => setOpen(!open)}
            className="block p-2 hover:bg-gray-100 rounded-full"
          >
            <AiOutlineEye className="text-gray-600" />
          </Link>
          {userInfo?.role !== "seller" && (
            <button
              className="block p-2 hover:bg-gray-100 rounded-full"
              onClick={addToCartHandler}
              disabled={false}
            >
              <AiOutlineShoppingCart className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {open ? <ProductDetailCard setOpen={setOpen} data={data} /> : null}
    </div>
  );
};

export default ProductCard;
