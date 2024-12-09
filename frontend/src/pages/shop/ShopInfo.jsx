import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";

// Fake Data for testing purposes
const fakeUserInfo = {
  name: "John Doe",
  phoneNumber: "+1 234 567 890",
  address: "123 Main St, Springfield, IL",
  avatar: {
    url: "https://via.placeholder.com/150",
  },
  createdAt: "2023-04-25T12:34:56Z",
};

const fakeProducts = [
  {
    id: 1,
    name: "Product 1",
    reviews: [{ rating: 4 }, { rating: 5 }],
  },
  {
    id: 2,
    name: "Product 2",
    reviews: [{ rating: 3 }, { rating: 4 }],
  },
];

const ShopInfo = ({ isOwner }) => {
  const [avatar, setAvatar] = useState(null);
  const { products } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth); // Accessing user info from Redux store
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  // If there's no real userInfo from the Redux store, use fake data
  const user = userInfo || fakeUserInfo;

  useEffect(() => {
    dispatch(getAllProductsShop(id)); // Fetching products for the shop
    setIsLoading(true);

    setAvatar(user.avatar?.url);

    // Simulating fetching products from the Redux store if necessary
    // In reality, this would be fetched from the backend
    setIsLoading(false);
  }, [id, dispatch, user]);

  const logoutHandler = async () => {
    // Simulate logging out
    console.log("Logging out...");
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={avatar || user.avatar?.url} // Displaying user avatar
                alt="Shop Avatar"
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{user?.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {user?.address}
            </p>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Address</h5>
            <h4 className="text-[#000000a6]">{user?.address}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Phone Number</h5>
            <h4 className="text-[#000000a6]">{user?.phoneNumber}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Total Products</h5>
            <h4 className="text-[#000000a6]">{products && products.length}</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Shop Ratings</h5>
            <h4 className="text-[#000000b0]">{averageRating}/5</h4>
          </div>
          <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">
              {user?.createdAt?.slice(0, 10)}
            </h4>
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                >
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                onClick={logoutHandler}
              >
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;
