"use client";

import {
  Add,
  Close,
  Favorite,
  FavoriteBorder,
  Message,
  Remove,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

export default function ProductDetailsCard({ setOpen, data }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [syncCart] = useSyncCartMutation();
  const previousCart = useRef(cart);

  useEffect(() => {
    if (previousCart.current !== cart) {
      // Only sync if the cart has actually changed
      syncCart(cart)
        .then(() => {
          console.log("Cart synced with server after cart change.");
          previousCart.current = cart; // Update the reference to the latest cart
        })
        .catch((error) => {
          console.error(
            "Failed to sync cart with server after cart change.",
            error
          );
        });
    }
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }

    // Initialize selected options
    if (data.options) {
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
    return data.variants?.find((variant) =>
      Object.entries(selectedOptions).every(
        ([key, value]) =>
          JSON.stringify(variant.attributes[key]?.value) ===
          JSON.stringify(value)
      )
    );
  }, [data.variants, selectedOptions]);

  const addToCartHandler = async () => {
    if (!userInfo) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a variant.");
      return;
    }

    // Check if the desired quantity exceeds the available stock
    if (selectedVariant.stockQuantity < count) {
      toast.error("Product stock limited!");
      return;
    }

    // Retrieve cart from local storage
    const localCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };

    // Check if the item with the selected variant already exists in the local storage cart
    const existingCartItem = localCart.items.find(
      (item) =>
        item.productId === data._id && item.variantId === selectedVariant._id
    );

    // Calculate the new quantity by combining existing and selected quantities
    const currentCartQuantity = existingCartItem
      ? existingCartItem.quantity
      : 0;
    const newQuantity = currentCartQuantity + count;

    // Check if the combined quantity exceeds available stock
    if (newQuantity > selectedVariant.stockQuantity) {
      toast.error("Cannot add more than available stock!");
      return;
    }

    // Dispatch action to update local cart state
    dispatch(
      addToCart({
        productId: data._id,
        productName: data.name,
        attributes: selectedVariant.attributes,
        mainImage: selectedVariant.mainImage,
        variantId: selectedVariant._id,
        price: selectedVariant.price,
        quantity: count,
      })
    );
    toast.success("Item added to cart successfully!");

    try {
      await syncCart(cart).unwrap();
      toast.success("Cart synced with server.");
    } catch {
      toast.error("Failed to sync cart with server.");
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
            className="w-6 h-6 rounded-full"
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

  return (
    <Dialog open={true} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
      <DialogContent className="p-0">
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2"
        >
          <Close />
        </IconButton>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={selectedVariant?.mainImage?.url || data.mainImage?.url}
              alt={data.name}
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="mt-4 flex items-center">
              <Link
                to={`/shop/preview/${data.shop._id}`}
                className="flex items-center"
              >
                <img
                  src={data.shop.avatar?.url || "/placeholder.svg"}
                  alt={data.shop.name}
                  className="w-12 h-12 rounded-full mr-2"
                />
                <div>
                  <Typography variant="subtitle1">{data.shop.name}</Typography>
                  <Typography variant="body2">
                    {data.ratings} Ratings
                  </Typography>
                </div>
              </Link>
            </div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Message />}
              className="mt-4 w-full"
            >
              Send Message
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {data.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {data.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              ${selectedVariant?.price || data.price}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Available Stock:{" "}
              {selectedVariant?.stockQuantity || data.stockQuantity}
            </Typography>

            {data.options.map(
              (option) =>
                option.values &&
                option.values.length > 0 && (
                  <div key={option.name} className="mt-4">
                    <Typography variant="subtitle1" gutterBottom>
                      {option.name}:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <Button
                          key={value._id}
                          variant={
                            JSON.stringify(selectedOptions[option.name]) ===
                            JSON.stringify(value.value)
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() =>
                            handleOptionChange(option.name, value.value)
                          }
                          className="min-w-0"
                        >
                          {renderOptionValue(option, value.value)}
                        </Button>
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

            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              className="mt-4 w-full"
              onClick={addToCartHandler}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
