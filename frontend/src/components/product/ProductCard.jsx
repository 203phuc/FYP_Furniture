import { MoreVert, ShoppingCart, Visibility } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import ProductDetailCard from "./ProductDetailCard";

const ProductCard = ({ data }) => {
  console.log(data);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);
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

    const isItemExists = cart.items.find((item) => item.productId === data._id);
    if (isItemExists) {
      toast.success("Updating item quantity in cart!");
    }

    try {
      // Dispatch action to update local cart state
      await dispatch(
        addToCart({
          productId: data._id,
          variantId: selectedVariant._id,
          productName: data.name,
          attributes: selectedVariant.attributes,
          quantity: 1,
          price: selectedVariant.price,
          mainImage: selectedVariant.mainImage,
        })
      );
      toast.success("Item updated to cart locally!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.");
    }
  };

  // useEffect hook to sync cart on initial render or cart changes
  const previousCart = useRef(cart);

  useEffect(() => {
    if (previousCart.current !== cart) {
      // Only sync if the cart has actually changed
      syncCart(cart)
        .then(() => {
          console.log("Cart synced with server after cart change.");
          toast.success("Cart synced with server after cart change.");
          previousCart.current = cart; // Update the reference to the latest cart
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
    <Card className="w-full overflow-hidden relative">
      <div className="aspect-w-4 aspect-h-3 w-full">
        <Link to={`/product/${data._id}`}>
          <img
            src={selectedVariant?.mainImage?.url || "/placeholder.svg"}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <CardContent className="p-4">
        <Link to={`/shop/preview/${data.shopId}`} className="no-underline">
          <Typography variant="h6" className="text-gray-800">
            {data.shop.name}
          </Typography>
        </Link>

        <Link to={`/product/${data._id}`} className="no-underline">
          <Typography variant="body1" className="text-gray-600 truncate">
            {data.name}
          </Typography>
        </Link>

        {optionWithMostImages.values.length > 0 && (
          <div className="mt-2">
            <Typography variant="subtitle1" className="font-bold">
              {optionWithMostImages.name}:
            </Typography>
            <div className="flex flex-wrap items-center mt-1 space-x-0.5 space-y-0.5">
              {optionWithMostImages.values.map((option) => (
                <Button
                  key={option._id}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-4 h-4 min-w-0 p-0 overflow-hidden bg-cover bg-center ${
                    selectedOptionValue === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  style={{
                    backgroundImage: option.image
                      ? `url(${option.image})`
                      : "none",
                    backgroundColor: option.image ? "transparent" : "#e5e7eb", // fallback bg color if no image
                    borderRadius: 0,
                  }}
                >
                  {!option.image && (
                    <div className="w-full h-full flex items-center justify-center text-[8px]">
                      {option.value.substring(0, 2)}
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 flex justify-between items-center">
          <Typography variant="h6" className="font-bold">
            ${selectedVariant?.price || "N/A"}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {selectedVariant?.stockQuantity || 0} in stock
          </Typography>
        </div>
      </CardContent>

      <div className="absolute right-2 top-2">
        <IconButton onClick={toggleDropdown}>
          <MoreVert />
        </IconButton>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <Button
                fullWidth
                startIcon={<Visibility />}
                onClick={() => setDetailsOpen(true)}
                className="justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                View Details
              </Button>
              {userInfo?.role !== "seller" && (
                <Button
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={addToCartHandler}
                  className="justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {detailsOpen && (
        <ProductDetailCard setOpen={setDetailsOpen} data={data} />
      )}
    </Card>
  );
};

export default ProductCard;
