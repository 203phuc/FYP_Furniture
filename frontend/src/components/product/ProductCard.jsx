"use client";

import { MoreVertical, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice";
import { addToCart } from "../../redux/slices/cartSlice";

// Assuming ProductDetailCard is adapted to work with this new design

export default function ProductCard({ data }) {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart.cart);
  const [syncCart] = useSyncCartMutation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const optionWithMostImages = useMemo(() => {
    return data.options.reduce(
      (prev, current) => {
        const prevImageCount = prev.values.filter((v) => v.image).length;
        const currentImageCount = current.values.filter((v) => v.image).length;
        return currentImageCount > prevImageCount ? current : prev;
      },
      { values: [] }
    );
  }, [data.options]);

  const [selectedOptionValue, setSelectedOptionValue] = useState(
    optionWithMostImages.values.find((v) => v.image)?.value ||
      optionWithMostImages.values[0]?.value
  );

  const selectedVariant = useMemo(() => {
    return data.variants.find(
      (variant) =>
        variant.attributes[optionWithMostImages.name]?.value ===
        selectedOptionValue
    );
  }, [data.variants, optionWithMostImages, selectedOptionValue]);

  const handleOptionSelect = (value) => {
    setSelectedOptionValue(value);
  };

  const addToCartHandler = async () => {
    if (!userInfo) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a variant.");
      return;
    }

    if (selectedVariant.stockQuantity < 1) {
      toast.error("Out of stock!");
      return;
    }

    const localCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    const existingCartItem = localCart.items.find(
      (item) =>
        item.productId === data._id && item.variantId === selectedVariant._id
    );

    const currentCartQuantity = existingCartItem
      ? existingCartItem.quantity
      : 0;
    const newQuantity = currentCartQuantity + 1;

    if (newQuantity > selectedVariant.stockQuantity) {
      toast.error("Exceeds available stock quantity!");
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: data._id,
          variantId: selectedVariant._id,
          productName: data.name,
          attributes: selectedVariant.attributes,
          quantity: 1,
          price: selectedVariant.price,
          stockQuantity: selectedVariant.stockQuantity,
          mainImage: selectedVariant.mainImage,
        })
      );
      toast.success("Item added to cart locally!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.");
    }
  };

  const previousCart = useRef(cart);

  useEffect(() => {
    if (previousCart.current !== cart) {
      syncCart(cart)
        .then(() => {
          console.log("Cart synced with server after cart change.");
          toast.success("Cart synced with server after cart change.");
          previousCart.current = cart;
        })
        .catch((error) => {
          console.error(
            "Failed to sync cart with server after cart change.",
            error
          );
        });
    }
  }, [cart, syncCart]);

  return (
    <div className="max-w-[500px] mx-auto">
      <div className="relative">
        <div className="aspect-[4/3] w-full bg-gray-100">
          <Link to={`/product/${data._id}`}>
            <img
              src={
                selectedVariant?.mainImage?.url ||
                "/placeholder.svg?height=280&width=450"
              }
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        <button
          onClick={toggleDropdown}
          className="absolute right-2 top-2 p-1 bg-white rounded-full shadow-md"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-2 top-10 w-48 bg-white rounded-md shadow-lg z-10">
            {userInfo?.role !== "seller" && (
              <button
                onClick={addToCartHandler}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </button>
            )}
          </div>
        )}
      </div>

      <div className="">
        <div>
          <Link
            href={`/shop/preview/${data.shopId}`}
            className="text-sm font-thin text-gray-900 hover:underline"
          >
            {data.shop.name}
          </Link>
          <Link
            href={`/product/${data._id}`}
            className="block text-lg font-thin text-gray-900 hover:underline"
          >
            {data.name}
          </Link>
        </div>

        {optionWithMostImages.values.length > 0 && (
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-thin text-gray-900">
              {optionWithMostImages.name}:
            </h3>
            <div className="flex flex-wrap gap-1">
              {optionWithMostImages.values.map((option) => (
                <button
                  key={option._id}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-6 h-6 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-black m-1 ${
                    selectedOptionValue === option.value
                      ? "ring-2 ring-offset-4 ring-black"
                      : ""
                  }`}
                  style={{
                    backgroundImage: option.image
                      ? `url(${option.image})`
                      : "none",
                    backgroundColor: option.image ? "transparent" : "#e5e7eb",
                  }}
                >
                  {!option.image && (
                    <span className="text-xs font-medium">
                      {option.value.substring(0, 2)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            ${selectedVariant?.price || "N/A"}
          </span>
          <span className="text-sm text-gray-500">
            {selectedVariant?.stockQuantity || 0} in stock
          </span>
        </div>
      </div>
    </div>
  );
}
