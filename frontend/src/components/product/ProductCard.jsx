import React, { useState } from "react";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice"; // Adjust the import based on your file structure
import { addToCart } from "../../redux/slices/cartSlice";
import ProductDetailCard from "./ProductDetailCard.jsx";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle dropdown

  // Get user info from the Redux state
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart.cart); // Cart from Redux state

  const [syncCart] = useSyncCartMutation(); // Mutation for syncing cart with the backend

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const addToCartHandler = () => {
    if (!userInfo) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    // Check if the item is already in the local cart
    const isItemExists = cart.items.find(
      (item) => item.product_id === data._id
    );
    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }

    if (data.stock_quantity < 1) {
      toast.error("Product stock limited!");
      return; // Stop execution if stock is limited
    }

    // Add to local cart first
    dispatch(
      addToCart({
        product_id: data._id,
        price: data.discountPrice || data.price,
        quantity: 1,
      })
    );
    toast.success("Item added to cart locally!");

    // Sync cart with backend asynchronously
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
        {/* Image that scales while keeping aspect ratio */}
        <Link to={`/product/${data._id}`}>
          <img
            src={data.mainImage?.url}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Product details */}
      <div className="p-4">
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className="text-lg font-semibold text-gray-800">
            {data?.shop?.name}
          </h5>
        </Link>

        <Link to={`/product/${data._id}`}>
          <p className="text-md font-medium text-gray-600 mt-1">
            {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <h5 className="text-lg font-bold text-gray-900">
                {data.discountPrice ? data.discountPrice : data.price}$
              </h5>
              {data.discountPrice && (
                <span className="ml-2 text-gray-500 line-through">
                  {data.price}$
                </span>
              )}
            </div>
            <span className="text-sm text-green-600">
              {data.sold_out || 0} sold
            </span>
          </div>
        </Link>
      </div>

      {/* Dropdown toggle button */}
      <div className="absolute left-4 top-4">
        <button
          className=" text-white p-2 rounded-full"
          onClick={toggleDropdown}
        >
          ⋮
        </button>

        {/* Dropdown menu */}
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
          {/* Conditionally hide Add to Cart for sellers */}
          {userInfo?.role !== "seller" && (
            <button
              className="block p-2 hover:bg-gray-100 rounded-full"
              onClick={addToCartHandler}
              disabled={false} // Disabled state can be added if necessary
            >
              <AiOutlineShoppingCart className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Product Detail Card modal */}
      {open ? <ProductDetailCard setOpen={setOpen} data={data} /> : null}
    </div>
  );
};

export default ProductCard;
