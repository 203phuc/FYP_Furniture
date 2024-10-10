import React, { useEffect, useRef, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../redux/slices/cartApiSlice";
import { addToCart as addToCartAction } from "../redux/slices/cartSlice";
import { useGetProductDetailsQuery } from "../redux/slices/productApiSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";
import styles from "../styles/styles";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [count, setCount] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, error, isLoading } = useGetProductDetailsQuery(id);
  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    const isItemInWishlist = wishlist?.find((item) => item._id === data?._id);
    setClick(!!isItemInWishlist);
  }, [wishlist, data]);

  const prevCartRef = useRef(cart.items);

  useEffect(() => {
    if (prevCartRef.current !== cart.items) {
      if (cart.items.length > 0) {
        syncCart(cart).catch((error) => {
          toast.error("Failed to sync cart with server");
          console.error(error);
        });
      }
      prevCartRef.current = cart.items;
    }
  }, [cart.items, syncCart]);

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => count > 1 && setCount(count - 1);

  const addToWishlistHandler = async (product) => {
    try {
      setClick(!click);
      dispatch(addToWishlist(product));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeFromWishlistHandler = async (product) => {
    try {
      setClick(!click);
      dispatch(removeFromWishlist(product));
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const addToCartHandler = (product) => {
    const isItemInCart = cart.items.find(
      (item) => item.product_id === product._id
    );

    if (product.stock_quantity < 1) {
      toast.error("Product out of stock!");
    } else {
      dispatch(
        addToCartAction({
          product_id: product._id,
          quantity: count,
          price: product.price,
        })
      );
      toast.success("Item added to cart successfully!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching product details</div>;

  return (
    <div className="bg-white">
      {data && (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={data.mainImage.url}
                  alt={data.name}
                  className="w-[80%] aspect-[4/3]"
                />
                <div className="w-full flex">
                  {data.images?.map((image, index) => (
                    <div
                      key={index}
                      className={`${
                        selectedImage === index ? "border" : ""
                      } cursor-pointer`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.url}
                        alt="Product"
                        className="h-[200px] mr-3 mt-3 aspect-[4/3]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>

                <p>
                  <strong>Category:</strong> {data.category}
                </p>
                <p>
                  <strong>Room Type:</strong> {data.roomtype}
                </p>
                <p>
                  <strong>Color:</strong> {data.color}
                </p>
                <p>
                  <strong>Price:</strong> ${data.price}
                </p>
                <p>
                  <strong>Stock:</strong> {data.stock_quantity} items available
                </p>
                <p>
                  <strong>Dimensions:</strong> {data.dimensions.width} x{" "}
                  {data.dimensions.height} x {data.dimensions.depth} (W x H x D)
                </p>
                <p>
                  <strong>Weight:</strong> {data.weight} kg
                </p>
                <p>
                  <strong>Approved:</strong> {data.approved ? "Yes" : "No"}
                </p>

                <div className="flex pt-3">
                  <button
                    className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                    {count}
                  </span>
                  <button
                    className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>

                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>

                {click ? (
                  <AiFillHeart
                    size={30}
                    className="cursor-pointer"
                    onClick={() => removeFromWishlistHandler(data)}
                    color="red"
                  />
                ) : (
                  <AiOutlineHeart
                    size={30}
                    className="cursor-pointer"
                    onClick={() => addToWishlistHandler(data)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
