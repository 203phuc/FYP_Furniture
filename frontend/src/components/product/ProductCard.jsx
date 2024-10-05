import React from "react";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../../redux/slices/cartApiSlice"; // Adjust the import based on your file structure
import styles from "../../styles/styles";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const [addToCart, { isLoading }] = useAddToCartMutation(); // Get the mutation hook

  // Assuming you have a userInfo object in the redux state
  const userInfo = useSelector((state) => state.auth.userInfo); // Adjust based on your auth slice
  const { data: cartData } = userInfo
    ? useGetCartQuery(userInfo._id)
    : { data: null }; // Fetch the cart only if the userInfo is defined

  const addToCartHandler = async () => {
    if (!userInfo) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    // Check if cart is fetched and has items
    if (cartData) {
      const isItemExists = cartData.items.find(
        (item) => item.product_id === data._id
      );
      if (isItemExists) {
        toast.error("Item already in cart!");
        return; // Stop execution if item already exists
      }
    }

    if (data.stock_quantity < 1) {
      toast.error("Product stock limited!");
      return; // Stop execution if stock is limited
    }

    const cartDataPayload = {
      user_id: userInfo._id, // Change this to match your backend's expected field name
      items: [
        {
          product_id: data._id,
          price: data.discountPrice || data.price, // Use discount price if available
          quantity: 1,
        },
      ],
    };

    try {
      await addToCart(cartDataPayload).unwrap(); // Use the mutation to add the item to the cart
      toast.success("Item added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add item to cart.");
      console.log(error?.data?.message || error.error);
    }
  };

  return (
    <div className="w-full h-[370px]  relative cursor-pointer">
      <Link to={`/product/${data._id}`}>
        <img
          src={data.mainImage?.url}
          alt={data.name}
          className="w-full h-[220px] object-contain"
        />
      </Link>
      <Link to={`/shop/preview/${data?.shop._id}`}>
        <h5 className={styles.shop_name}>{data?.shop?.name}</h5>
      </Link>
      <Link to={`/product/${data._id}`}>
        <p className="text-1xl">
          {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
        </p>
        <div className=" flex items-center justify-between">
          <div className="flex">
            <h5 className="text-1xl">
              {data.discountPrice ? data.discountPrice : data.price}$
            </h5>
            {data.discountPrice && (
              <p className="text-1xl line-through">{data.price} $</p>
            )}
          </div>
          <span className="font-[400] text-[17px] text-[#68d284]">
            {data.sold_out || 0} sold
          </span>
        </div>
      </Link>

      {/* Bottom options */}
      <div>
        <AiOutlineEye
          size={22}
          className="cursor-pointer absolute right-2 top-14"
          color="#333"
          title="Quick view"
        />
        <AiOutlineShoppingCart
          size={25}
          className="cursor-pointer absolute right-2 top-24"
          onClick={addToCartHandler}
          color="#444"
          title="Add to cart"
          disabled={isLoading} // Disable the button while loading
        />
      </div>
    </div>
  );
};

export default ProductCard;
