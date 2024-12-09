"use client";

import {
  Add,
  Favorite,
  FavoriteBorder,
  Remove,
  ShoppingCart,
} from "@mui/icons-material";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useGetProductDetailsQuery } from "../../redux/slices/productApiSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

export default function ProductDetailsCard() {
  const [model, setModel] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data, error, isLoading } = useGetProductDetailsQuery(id); // Fetch product details
  const userInfo = useSelector((state) => state.auth.userInfo);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [syncCart] = useSyncCartMutation();
  const previousCart = useRef(cart);
  const [is3D, setIs3D] = useState(false); // New state to toggle between 3D and 2D view

  useEffect(() => {
    // Log the entire data object
    console.log("Fetched product data:", data);

    if (previousCart.current !== cart) {
      syncCart(cart)
        .then(() => {
          console.log("Cart synced with server after cart change.");
          previousCart.current = cart;
        })
        .catch((error) => {
          console.error(
            "Failed to sync cart with server after cart change.",
            error
          );
        });
      toast.success("Cart synced with server after cart change.");
    }
    if (wishlist && data && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }

    if (data?.options) {
      const initialOptions = {};
      data.options.forEach((option) => {
        if (option.values && option.values.length > 0) {
          initialOptions[option.name] = option.values[0]?.value;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [wishlist, data, cart, syncCart]);

  const selectedVariant = useMemo(() => {
    return data?.variants?.find((variant) =>
      Object.entries(selectedOptions).every(
        ([key, value]) =>
          JSON.stringify(variant.attributes[key]?.value) ===
          JSON.stringify(value)
      )
    );
  }, [data?.variants, selectedOptions]);

  const toggleView = () => {
    setIs3D(!is3D);
    change3D();
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
    if (selectedVariant.stockQuantity < count) {
      toast.error("Product stock limited!");
      return;
    }

    const localCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    const existingCartItem = localCart.items.find(
      (item) =>
        item.productId._id === data._id &&
        item.variantId === selectedVariant._id
    );
    const currentCartQuantity = existingCartItem
      ? existingCartItem.quantity
      : 0;
    const newQuantity = currentCartQuantity + count;
    console.log(" newQuantity", newQuantity);
    if (newQuantity > selectedVariant.stockQuantity) {
      toast.error("Cannot add more than available stock!");
      return;
    }
    try {
      await dispatch(
        addToCart({
          productId: data._id,
          productName: data.name,
          attributes: selectedVariant.attributes,
          mainImage: selectedVariant.mainImage,
          variantId: selectedVariant._id,
          price: selectedVariant.price,
          stockQuantity: selectedVariant.stockQuantity,
          quantity: count,
        })
      );
      toast.success("Item added to cart successfully!");
      toast.success("Cart synced with server.");
    } catch (error) {
      toast.error("Failed to sync cart with server.", error);
    }
  };

  const handleWishlistToggle = () => {
    setClick(!click);
    if (click) {
      dispatch(removeFromWishlist(data));
    } else {
      dispatch(addToWishlist(data));
    }
  };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };
  const change3D = () => {
    console.log(selectedVariant);
    if (selectedVariant.threeDModel?.url) {
      setModel(selectedVariant.threeDModel.url);
    } else {
      toast.error("No 3D model available");
    }
  };

  const renderOptionValue = (option, value) => {
    if (option.name === "Dimensions") {
      const dimensions = Object.entries(value)
        .map(
          ([key, val]) =>
            `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}"`
        )
        .join(", ");
      return (
        <Tooltip className="w-80" title={dimensions}>
          <span className="text-xs whitespace-nowrap">{dimensions}</span>
        </Tooltip>
      );
    }
    if (option.values[0].image !== "") {
      return (
        <Tooltip title={value}>
          <div
            className="w-6 h-6"
            style={{
              backgroundImage: `url(${
                option.values.find((v) => v.value === value)?.image
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Tooltip>
      );
    }
    return value;
  };
  const Model = ({ url }) => {
    console.log("url", url);
    const { scene, error, isLoading } = useGLTF(url);

    if (isLoading) {
      return <div>Loading model...</div>;
    }

    if (error) {
      return <div>Error loading GLTF model: {error.message}</div>;
    }

    return <primitive object={scene} />;
  };
  useEffect(() => {
    // Log the image URLs
    console.log("Product main image URL:", data?.mainImage?.url);
    console.log(
      "Selected variant main image URL:",
      selectedVariant?.mainImage?.url
    );
  }, [data, selectedVariant]);

  if (isLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Error state
  }

  return (
    <div className=" mx-auto shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          {is3D ? (
            model ? (
              // Render 3D model if 'model' is set
              <Suspense fallback={<div>Loading 3D model...</div>}>
                <Canvas className="w-200px aspect-[4/3]">
                  <ambientLight intensity={0.5} />
                  <Model url={model} />
                  <pointLight position={[10, 10, 10]} />
                  <Environment preset="sunset" background />
                  <OrbitControls />
                </Canvas>
              </Suspense>
            ) : (
              <div>Loading 3D model...</div>
            )
          ) : (
            // Fallback to 2D image
            <img
              src={selectedVariant?.mainImage?.url || data.mainImage?.url}
              alt={data.name}
              className="w-full h-auto object-cover"
            />
          )}
          <div className="mt-4 flex items-center">
            <Link
              to={`/shop/preview/${data.shop._id}`}
              className="flex items-center"
            >
              <img
                src={data.shop.avatar?.url || "/placeholder.svg"}
                alt={data.shop.name}
                className="w-12 h-12 mr-2"
              />

              <div>
                <Typography variant="subtitle1">{data.shop.name}</Typography>
                <Typography variant="body2">{data.ratings} Ratings</Typography>
              </div>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-6 py-8">
          <div className="text-4xl font-thin mb-4 max-w-max">{data.name}</div>
          <p className="text-xl font-thin mt-4">
            $ {selectedVariant?.price || data.price}
          </p>
          <p className="mt-4 font-thin">{data.description}</p>

          <p className={`mt-4 font-thin `}>
            Available Stock:{" "}
            {selectedVariant?.stockQuantity || data.stockQuantity}
          </p>

          {data.options.map(
            (option) =>
              option.values &&
              option.values.length > 0 && (
                <div key={option.name} className="mt-4">
                  <p className="mb-2 font-semibold uppercase">{option.name}:</p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value._id}
                        onClick={() =>
                          handleOptionChange(option.name, value.value)
                        }
                        className={` focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-black m-1 ${
                          JSON.stringify(selectedOptions[option.name]) ===
                          JSON.stringify(value.value)
                            ? "ring-2 ring-offset-4 ring-black"
                            : ""
                        }`}
                        style={{
                          backgroundImage: value.image
                            ? `url(${value.image})`
                            : "none",
                          backgroundColor: value.image ? "transparent" : "",
                        }}
                      >
                        {renderOptionValue(option, value.value)}
                      </button>
                    ))}
                  </div>
                </div>
              )
          )}

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <IconButton onClick={decrementCount}>
                <Remove />
              </IconButton>
              <Typography variant="body1" className="mx-2">
                {count}
              </Typography>
              <IconButton onClick={incrementCount}>
                <Add />
              </IconButton>
            </div>
            <IconButton onClick={handleWishlistToggle}>
              {click ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </div>

          <button
            startIcon={<ShoppingCart />}
            className="mt-4 w-full font-bold bg-black text-white py-2 px-4 hover:bg-gray-800 flex items-center justify-center"
            onClick={addToCartHandler}
          >
            Add to Cart
          </button>
          {selectedVariant?.threeDModel?.url && (
            <>
              <button
                onClick={toggleView}
                className="mt-4 px-4 py-2 border rounded-md"
              >
                {is3D ? "Switch to 2D" : "Switch to 3D"}
              </button>
              <Link
                to="/ar-view"
                state={model}
                className="mt-4 px-4 py-2 border rounded-md"
              >
                AR View
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
