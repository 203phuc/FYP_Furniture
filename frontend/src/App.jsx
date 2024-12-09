import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import "./index.css";
import {
  useFetchCartQuery,
  useSyncCartMutation,
} from "./redux/slices/cartApiSlice";
import { addToCart } from "./redux/slices/cartSlice";
import { useGetProductApprovedQuery } from "./redux/slices/productApiSlice";

const App = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  console.log("cart", cart);
  const location = useLocation();
  const {
    data: products = [], // Default to empty array
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductApprovedQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const [syncCart] = useSyncCartMutation();
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useFetchCartQuery(userId, {
    skip: !userId,
  });
  console.log("fetch cart", cartData);

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      console.log("cart is not innitialized");
    } else if (
      cartData &&
      cartData.cart.items.length > 0 &&
      cart.items.length === 0
    ) {
      dispatch(addToCart(cartData.cart));
    }
    if (cartError) {
      toast.error("Error fetching cart data. Please try again.");
    }
  }, [cartData, cart]);

  // Sync cart only if it changes and if it's empty
  // Update cart in Redux store

  const hiddenPaths = [
    "/register",
    "/shop-create",
    "/shop-login",
    "/dashboard",
    "/dashboard/*", // Optionally match nested paths
    "/admin-dashboard",
    "/admin-dashboard/*",
  ];

  const shouldShowHeader = !hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <ToastContainer />
      {shouldShowHeader && (
        <Header
          allProducts={products}
          isLoading={productsLoading}
          error={productsError}
        />
      )}

      <Outlet />
      {shouldShowHeader && <Footer />}
    </>
  );
};

export default App;
