import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // To get the product ID from the URL
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../redux/slices/cartApiSlice";
import { addToCart as addToCartAction } from "../redux/slices/cartSlice";
import { useGetProductDetailsQuery } from "../redux/slices/productApiSlice"; // Import the query
import styles from "../styles/styles";

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [count, setCount] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Fetch product details using the product ID from the URL
  const { data, error, isLoading } = useGetProductDetailsQuery(id);

  // Sync cart mutation
  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    const isItemInWishlist = wishlist?.find((item) => item._id === data?._id);
    setSelectedImage(isItemInWishlist ? 1 : 0);
  }, [data, wishlist]);

  // Increase or decrease item quantity
  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => count > 1 && setCount(count - 1);

  const addToWishlistHandler = async (product) => {
    try {
      toast.success("Added to wishlist!");
    } catch (error) {
      toast.error("Failed to add to wishlist");
    }
  };

  const removeFromWishlistHandler = async (product) => {
    try {
      toast.success("Removed from wishlist!");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  // Add item to local cart and sync it later
  const addToCartHandler = (product) => {
    const isItemInCart = cart.items.find(
      (item) => item.product_id === product._id
    );

    if (isItemInCart) {
      toast.error("Item already in cart!");
    } else if (product.stock_quantity < 1) {
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

      // Sync cart with database (lazy sync)
      syncCart(cart).catch((error) => {
        toast.error("Failed to sync cart with server");
      });
    }
  };

  const handleMessageSubmit = async () => {
    if (userInfo) {
      // Logic to handle message to the seller
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching product details</div>;

  return (
    <div className="bg-white">
      {data && (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                {/* Image section with 4:3 aspect ratio */}
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

                {/* Display additional product details */}
                <p>
                  <strong>Category:</strong> {data.category}
                </p>
                <p>
                  <strong>Price:</strong> ${data.price}
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

                {/* Wishlist action */}
                {selectedImage ? (
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
