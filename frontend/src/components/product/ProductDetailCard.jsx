import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSyncCartMutation } from "../../redux/slices/cartApiSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";

const ProductDetailsCard = ({ setOpen, data }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  // Sync cart mutation for lazy updating backend
  const [syncCart] = useSyncCartMutation();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const addToCartHandler = () => {
    if (!userInfo) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    const isItemInCart = cart.items.find(
      (item) => item.product_id === data._id
    );
    if (isItemInCart) {
      toast.error("Item already in cart!");
      return;
    }

    if (data.stock_quantity < count) {
      toast.error("Product stock limited!");
      return;
    }

    // Add item to local cart
    dispatch(
      addToCart({
        product_id: data._id,
        price: data.discountPrice || data.price,
        quantity: count,
      })
    );
    toast.success("Item added to cart successfully!");

    // Lazy sync cart with backend
    syncCart(cart)
      .then(() => {
        toast.success("Cart synced with server.");
      })
      .catch(() => {
        toast.error("Failed to sync cart with server.");
      });
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

  return (
    <div className="bg-white">
      {data && (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <div className="block w-full 800px:flex">
              {/* Product Image */}
              <div className="w-full 800px:w-[50%]">
                <img
                  src={data.mainImage?.url}
                  alt={data.name}
                  className="w-full h-auto"
                />
                <div className="flex mt-4">
                  <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                    <img
                      src={data.shop.avatar?.url}
                      alt={data.shop.name}
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3>{data.shop.name}</h3>
                      <h5 className="text-sm">{data.ratings} Ratings</h5>
                    </div>
                  </Link>
                </div>
                <div className="bg-black text-white mt-4 rounded px-4 py-2 cursor-pointer">
                  <span className="flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full 800px:w-[50%] pt-5 px-4">
                <h1 className="text-xl font-semibold">{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex mt-4">
                  <h4 className="text-2xl font-bold">
                    {data.discountPrice
                      ? `${data.discountPrice}$`
                      : `${data.price}$`}
                  </h4>
                  {data.discountPrice && (
                    <h3 className="ml-2 text-gray-500 line-through">
                      {data.price}$
                    </h3>
                  )}
                </div>

                {/* Quantity and Wishlist */}
                <div className="flex items-center mt-8 justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={decrementCount}
                      className="px-4 py-2 bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{count}</span>
                    <button
                      onClick={incrementCount}
                      className="px-4 py-2 bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <div onClick={handleWishlistToggle}>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        color="red"
                        className="cursor-pointer"
                      />
                    ) : (
                      <AiOutlineHeart size={30} className="cursor-pointer" />
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <div
                  className={`bg-black text-white mt-6 px-4 py-2 cursor-pointer flex items-center`}
                  onClick={addToCartHandler}
                >
                  Add to cart <AiOutlineShoppingCart className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsCard;
